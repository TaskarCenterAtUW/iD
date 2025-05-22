import esbuild from 'esbuild';
import fs from 'node:fs';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import envs from './envs.mjs';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

await esbuild.build({
  entryPoints: ['./modules/index.js'],
  outfile: 'dist/iD.min.js',
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'esm',
  platform: 'browser',
  target: browserslistToEsbuild(),
  external: ['lodash-es', 'whatwg-fetch', 'exifr', 'alif-toolkit', 'polygon-clipping'],
  define: {
    ...envs,
    __VERSION__: JSON.stringify(pkg.version)
  },
  logLevel: 'info'
});
