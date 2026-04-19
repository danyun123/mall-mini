import { existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ci from 'miniprogram-ci';

// 把仓库根目录的 package.json 打成小程序可加载的 miniprogram_npm。
const repoRoot = process.cwd();
const packageJsonPath = path.join(repoRoot, 'package.json');
const miniprogramRoot = path.join(repoRoot, 'miniprogram');
const miniprogramNpmRoot = path.join(miniprogramRoot, 'miniprogram_npm');

if (!existsSync(packageJsonPath)) {
  throw new Error(`package.json not found: ${packageJsonPath}`);
}

if (!existsSync(miniprogramRoot)) {
  throw new Error(`miniprogram root not found: ${miniprogramRoot}`);
}

mkdirSync(miniprogramRoot, { recursive: true });
// 先清理旧产物，避免开发者工具读取到过期依赖。
rmSync(miniprogramNpmRoot, { recursive: true, force: true });

const result = await ci.packNpmManually({
  packageJsonPath,
  miniprogramNpmDistDir: miniprogramRoot,
});

const warningCount = result.warnList?.length ?? 0;

if (warningCount > 0) {
  console.warn('Mini program npm build completed with warnings:');

  for (const warning of result.warnList) {
    console.warn(`- ${warning.msg}`);
  }
}

console.log(
  `Mini program npm build completed. miniprogram packages: ${result.miniProgramPackNum}, bundled packages: ${result.otherNpmPackNum}.`,
);
