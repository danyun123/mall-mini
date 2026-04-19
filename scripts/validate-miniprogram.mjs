import { existsSync, lstatSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// 在小程序运行前做结构和依赖校验，尽早暴露 DevTools 里的运行时问题。
const repoRoot = process.cwd();
const projectConfigPath = path.join(repoRoot, 'project.config.json');
const projectConfig = JSON.parse(readFileSync(projectConfigPath, 'utf8'));
const miniprogramRootPath = projectConfig.miniprogramRoot || 'miniprogram/';
const miniprogramRoot = path.join(repoRoot, 'miniprogram');
const appJsonPath = path.join(miniprogramRoot, 'app.json');

const errors = [];
const barePackageImports = new Set();

const appConfig = JSON.parse(readFileSync(appJsonPath, 'utf8'));

if (appConfig?.rendererOptions?.skyline?.tagNameStyleIsolation !== undefined) {
  errors.push(
    'miniprogram/app.json: rendererOptions.skyline.tagNameStyleIsolation 会在当前微信开发者工具环境下报无效配置，请移除。',
  );
}

const ensurePageExists = (pagePath) => {
  const pageRoot = path.join(miniprogramRoot, pagePath);
  const requiredFiles = ['.json', '.ts', '.wxml', '.scss'];

  for (const extension of requiredFiles) {
    if (!existsSync(`${pageRoot}${extension}`)) {
      errors.push(`miniprogram/app.json: 页面 ${pagePath} 缺少 ${pagePath}${extension}。`);
    }
  }
};

for (const pagePath of appConfig.pages ?? []) {
  ensurePageExists(pagePath);
}

for (const subpackage of appConfig.subpackages ?? appConfig.subPackages ?? []) {
  const root = subpackage.root;

  for (const pagePath of subpackage.pages ?? []) {
    ensurePageExists(path.posix.join(root, pagePath));
  }
}

const collectTsFiles = (directory) => {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'miniprogram_npm') {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectTsFiles(fullPath));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
};

const resolveImportTarget = (importerPath, specifier) => {
  const basePath = path.resolve(path.dirname(importerPath), specifier);
  const directCandidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.js`,
    `${basePath}.d.ts`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.js'),
    path.join(basePath, 'index.d.ts'),
  ];

  for (const candidate of directCandidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
};

const importPattern = /from\s+['"](\.[^'"]+)['"]|require\(\s*['"](\.[^'"]+)['"]\s*\)/g;
const bareImportPattern = /from\s+['"]([^./][^'"]*)['"]|require\(\s*['"]([^./][^'"]*)['"]\s*\)/g;

const getPackageRootName = (specifier) => {
  if (specifier.startsWith('@')) {
    const [scope, name] = specifier.split('/');
    return scope && name ? `${scope}/${name}` : specifier;
  }

  const [name] = specifier.split('/');
  return name;
};

for (const filePath of collectTsFiles(miniprogramRoot)) {
  const source = readFileSync(filePath, 'utf8');
  const matches = source.matchAll(importPattern);
  const bareMatches = source.matchAll(bareImportPattern);

  for (const match of matches) {
    const specifier = match[1] ?? match[2];

    if (!specifier) {
      continue;
    }

    const resolved = resolveImportTarget(filePath, specifier);

    if (!resolved) {
      errors.push(`${path.relative(repoRoot, filePath)}: 无法解析相对导入 ${specifier}。`);
      continue;
    }

    if (statSync(resolved).isDirectory()) {
      errors.push(
        `${path.relative(repoRoot, filePath)}: 相对导入 ${specifier} 指向目录。微信小程序运行时不保证支持目录索引，请改成显式的 /index 导入。`,
      );
      continue;
    }

    if (
      path.basename(resolved).startsWith('index.') &&
      path.dirname(resolved) === path.resolve(path.dirname(filePath), specifier)
    ) {
      errors.push(
        `${path.relative(repoRoot, filePath)}: 相对导入 ${specifier} 依赖目录索引解析。请改成显式的 ${specifier}/index。`,
      );
    }
  }

  for (const match of bareMatches) {
    const specifier = match[1] ?? match[2];

    if (!specifier) {
      continue;
    }

    const packageRootName = getPackageRootName(specifier);
    const packageRootPath = path.join(repoRoot, 'node_modules', packageRootName);
    barePackageImports.add(packageRootName);

    if (!existsSync(packageRootPath)) {
      errors.push(
        `${path.relative(repoRoot, filePath)}: 裸导入 ${specifier} 对应的 npm 包不存在。`,
      );
      continue;
    }

    // 微信开发者工具对符号链接 node_modules 的兼容性不稳定，提前报错更容易排查。
    if (lstatSync(packageRootPath).isSymbolicLink()) {
      errors.push(
        `${path.relative(repoRoot, filePath)}: 裸导入 ${specifier} 指向符号链接 npm 包。微信开发者工具对符号链接 node_modules 兼容性不稳定，请使用普通 node_modules 目录后重新安装依赖。`,
      );
    }
  }
}

if (barePackageImports.size > 0) {
  const miniprogramPackageJsonPath = path.join(repoRoot, miniprogramRootPath, 'package.json');
  const packNpmManually = Boolean(projectConfig.setting?.packNpmManually);
  const packNpmRelationList = projectConfig.setting?.packNpmRelationList;

  // 根目录依赖需要手动映射到 miniprogramRoot，避免开发者工具找不到 npm 包。
  if (!packNpmManually && !existsSync(miniprogramPackageJsonPath)) {
    errors.push(
      'project.config.json: 当前依赖安装在仓库根目录，且 miniprogramRoot 下没有 package.json。请启用 setting.packNpmManually 并配置 packNpmRelationList。',
    );
  }

  if (packNpmManually) {
    if (!Array.isArray(packNpmRelationList) || packNpmRelationList.length === 0) {
      errors.push(
        'project.config.json: setting.packNpmManually 已开启，但 packNpmRelationList 为空。',
      );
    } else {
      for (const relation of packNpmRelationList) {
        const packageJsonPath = path.join(repoRoot, relation.packageJsonPath ?? '');
        const miniprogramNpmDistDir = path.join(repoRoot, relation.miniprogramNpmDistDir ?? '');

        if (!relation.packageJsonPath || !existsSync(packageJsonPath)) {
          errors.push(
            `project.config.json: packNpmRelationList.packageJsonPath 无效或不存在：${relation.packageJsonPath ?? ''}`,
          );
        }

        if (!relation.miniprogramNpmDistDir || !existsSync(miniprogramNpmDistDir)) {
          errors.push(
            `project.config.json: packNpmRelationList.miniprogramNpmDistDir 无效或不存在：${relation.miniprogramNpmDistDir ?? ''}`,
          );
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Mini program runtime validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Mini program runtime validation passed.');
