import gulpLint             from '@fasttime/gulp-lint';
import { fork }             from 'child_process';
import fs                   from 'fs';
import gulp                 from 'gulp';
import gulpIgnore           from 'gulp-ignore';
import gulpTypescript       from 'gulp-typescript';
import mergeStream          from 'merge-stream';
import { createRequire }    from 'module';
import { rollup }           from 'rollup';
import rollupPluginCleanup  from 'rollup-plugin-cleanup';

const { dest, parallel, series, src } = gulp;

export async function clean()
{
    const paths = ['.nyc_output', '.tmp-out', 'coverage', 'lib', 'test/node-legacy'];
    const options = { recursive: true };
    await Promise.all(paths.map(path => fs.promises.rmdir(path, options)));
}

export function lint()
{
    const stream =
    gulpLint
    (
        {
            src: 'src/**/*.ts',
            parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
        },
        {
            src: 'test/spec/**/*.ts',
            envs: ['ebdd/ebdd', 'mocha'],
            parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
            plugins: ['ebdd'],
        },
        {
            src: ['*.js', 'build/**/*.js'],
            envs: ['node'],
            parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
        },
    );
    return stream;
}

export function test(callback)
{
    const { resolve } = createRequire(import.meta.url);
    const nycPath = resolve('nyc/bin/nyc');
    const mochaPath = resolve('mocha/bin/mocha');
    const forkArgs =
    [
        '--include=src',
        '--reporter=html',
        '--reporter=text-summary',
        mochaPath,
        '--check-leaks',
        '--require=ts-node/register',
        '--ui=ebdd',
        'test/spec/**/*.spec.ts',
    ];
    const forkOpts =
    { env: { ...process.env, TS_NODE_COMPILER_OPTIONS: '{ "module": "CommonJS" }' } };
    const childProcess = fork(nycPath, forkArgs, forkOpts);
    childProcess.on('exit', code => callback(code && 'Test failed'));
}

export function compile()
{
    const { dts, js } = src('src/**/*.ts').pipe(gulpTypescript.createProject('tsconfig.json')());
    const condition = ['novem.d.ts', 'solution.d.ts', 'solution-type.d.ts'];
    const stream =
    mergeStream
    (dts.pipe(gulpIgnore.include(condition)).pipe(dest('lib')), js.pipe(dest('.tmp-out')));
    return stream;
}

export async function bundle()
{
    const require = createRequire(import.meta.url);
    const { homepage, version } = require('./package.json');

    const inputOptions =
    {
        input: '.tmp-out/novem.js',
        onwarn(warning)
        {
            if (warning.code !== 'THIS_IS_UNDEFINED')
                console.error(warning.message);
        },
        plugins: [rollupPluginCleanup({ comments: /^(?!\/ *@ts-)/ })],
    };
    const outputOptions =
    { banner: `// novem ${version} – ${homepage}\n`, file: 'lib/novem.js', format: 'esm' };
    const bundle = await rollup(inputOptions);
    await bundle.write(outputOptions);
}

export default series(parallel(clean, lint), test, compile, bundle);
