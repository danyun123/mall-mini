import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// 初始化 Husky hooks，保证本仓库的提交校验在本地可直接生效。
const repoRoot = process.cwd();
const gitDir = path.join(repoRoot, '.git');

if (!existsSync(gitDir)) {
  console.log('Skipping Husky setup because .git is not initialized.');
  process.exit(0);
}

const resolveGitExecutable = () => {
  // 优先从常见安装路径和 PATH 中寻找 Git 可执行文件。
  const candidates = new Set();
  const pathValue = process.env.Path ?? process.env.PATH ?? '';

  if (process.env.GIT_EXECUTABLE) {
    candidates.add(process.env.GIT_EXECUTABLE);
  }

  for (const entry of pathValue.split(path.delimiter).filter(Boolean)) {
    candidates.add(path.join(entry, 'git.exe'));
    candidates.add(path.join(entry, 'git.cmd'));
    candidates.add(path.join(entry, 'git'));
  }

  candidates.add('D:/Git/cmd/git.exe');
  candidates.add('C:/Program Files/Git/cmd/git.exe');
  candidates.add('C:/Program Files/Git/bin/git.exe');

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return 'git';
};

const runGit = (args) => {
  // Git 配置失败时直接抛错，避免静默跳过 hook 安装。
  const result = spawnSync(resolveGitExecutable(), args, {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`Git command failed: git ${args.join(' ')}`);
  }
};

const huskyRoot = path.join(repoRoot, '.husky');
const huskyInternalRoot = path.join(huskyRoot, '_');
const huskyHelperSource = path.join(repoRoot, 'node_modules', 'husky', 'husky');
const huskyHelperDest = path.join(huskyInternalRoot, 'h');

mkdirSync(huskyInternalRoot, { recursive: true });
runGit(['config', 'core.hooksPath', '.husky/_']);

writeFileSync(path.join(huskyInternalRoot, '.gitignore'), '*\n', 'utf8');
writeFileSync(huskyHelperDest, readFileSync(huskyHelperSource, 'utf8'), 'utf8');
writeFileSync(
  path.join(huskyInternalRoot, 'pre-commit'),
  '#!/usr/bin/env sh\n. "$(dirname "$0")/h"\n',
  'utf8',
);
writeFileSync(
  path.join(huskyInternalRoot, 'commit-msg'),
  '#!/usr/bin/env sh\n. "$(dirname "$0")/h"\n',
  'utf8',
);
writeFileSync(path.join(huskyRoot, 'pre-commit'), '#!/usr/bin/env sh\nlint-staged\n', 'utf8');
writeFileSync(
  path.join(huskyRoot, 'commit-msg'),
  '#!/usr/bin/env sh\ncommitlint --edit "$1"\n',
  'utf8',
);

chmodSync(huskyHelperDest, 0o755);
chmodSync(path.join(huskyInternalRoot, 'pre-commit'), 0o755);
chmodSync(path.join(huskyInternalRoot, 'commit-msg'), 0o755);
chmodSync(path.join(huskyRoot, 'pre-commit'), 0o755);
chmodSync(path.join(huskyRoot, 'commit-msg'), 0o755);

console.log('Husky hooks configured.');
