import process from 'node:process';

// 统一封装微信开发者工具的 preview / upload 流程，减少手工重复配置。
const mode = process.argv[2];

if (!mode || !['preview', 'upload'].includes(mode)) {
  console.error('Usage: node scripts/miniprogram-ci.mjs <preview|upload>');
  process.exit(1);
}

const requiredEnv = ['MINIPROGRAM_APPID', 'MINIPROGRAM_PRIVATE_KEY_PATH', 'MINIPROGRAM_ROBOT'];

const missing = requiredEnv.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Missing environment variables for miniprogram-ci: ${missing.join(', ')}.`);
  console.error('Provide the required credentials before running preview or upload.');
  process.exit(1);
}

const ci = await import('miniprogram-ci');

// 只打包源码，生成的 npm 产物会被忽略，不参与 CI 产出。
const project = new ci.Project({
  appid: process.env.MINIPROGRAM_APPID,
  type: 'miniProgram',
  projectPath: process.cwd(),
  privateKeyPath: process.env.MINIPROGRAM_PRIVATE_KEY_PATH,
  ignores: ['node_modules/**/*'],
});

const commonOptions = {
  project,
  version: process.env.MINIPROGRAM_VERSION ?? '0.1.0',
  desc: process.env.MINIPROGRAM_DESC ?? `Codex ${mode} run`,
  robot: Number(process.env.MINIPROGRAM_ROBOT),
  setting: {
    es6: true,
    minifyJS: true,
    minifyWXML: true,
    minifyWXSS: true,
    autoPrefixWXSS: true,
  },
};

if (mode === 'preview') {
  await ci.preview({
    ...commonOptions,
    qrcodeFormat: 'image',
    qrcodeOutputDest: process.env.MINIPROGRAM_QRCODE_OUTPUT ?? './preview.png',
  });
  console.log('Mini program preview completed.');
  process.exit(0);
}

await ci.upload(commonOptions);
console.log('Mini program upload completed.');
