import esbuild from 'esbuild';
import fs from 'node:fs';
import parse from 'minimist';
import envs from './envs.mjs';
import browserslistToEsbuild from 'browserslist-to-esbuild';

let args = parse(process.argv.slice(2), {boolean: true});

const context = await esbuild.context({
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
  logLevel: 'info',
  metafile: true,
});

if (args.watch) {
  await context.watch();
} else {
  const build = await context.rebuild();
  if (args.stats) {
    fs.writeFileSync('./dist/esbuild.json', JSON.stringify(build.metafile, null, 2));
  }
  await context.dispose();
}
