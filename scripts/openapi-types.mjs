import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

// 根据 OpenAPI schema 生成小程序共享类型文件。
const outputFile = path.resolve(process.cwd(), 'miniprogram/typings/api.d.ts');
const schemaSource = process.env.OPENAPI_SCHEMA_URL ?? process.env.OPENAPI_SCHEMA_PATH;

if (!schemaSource) {
  // 没有 schema 时也保留占位文件，避免类型导入路径失效。
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(
    outputFile,
    [
      '// OpenAPI types are not configured yet.',
      '// Set OPENAPI_SCHEMA_URL or OPENAPI_SCHEMA_PATH before running `npm run openapi:types`.',
      'export {};',
      '',
    ].join('\n'),
    'utf8',
  );
  console.log('Skipped OpenAPI generation because no schema source is configured.');
  process.exit(0);
}

const { astToString, default: openapiTS } = await import('openapi-typescript');

const ast = await openapiTS(schemaSource);
await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, astToString(ast), 'utf8');
console.log(`Generated OpenAPI types to ${outputFile}`);
