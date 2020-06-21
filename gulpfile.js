'use strict';

const { dest, parallel, series, src, task } = require('gulp');

task
(
    'clean',
    async () =>
    {
        const { promises: { rmdir } } = require('fs');

        const paths = ['.nyc_output', '.tmp-out', 'coverage', 'lib'];
        const options = { recursive: true };
        await Promise.all(paths.map(path => rmdir(path, options)));
    },
);

task
(
    'lint',
    () =>
    {
        const lint = require('@fasttime/gulp-lint');

        const stream =
        lint
        (
            {
                src: 'src/**/*.ts',
                parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
            },
            {
                src: 'test/**/*.ts',
                envs: ['ebdd/ebdd', 'mocha'],
                parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
                plugins: ['ebdd'],
            },
            {
                src: '*.js',
                envs: ['node'],
                parserOptions: { ecmaVersion: 2020 },
            },
        );
        return stream;
    },
);

task
(
    'test',
    callback =>
    {
        const { fork } = require('child_process');

        const { resolve } = require;
        const nycPath = resolve('nyc/bin/nyc');
        const mochaPath = resolve('mocha/bin/mocha');
        const forkArgs =
        [
            '--include=src',
            '--reporter=html',
            '--reporter=text-summary',
            mochaPath,
            '--require=ts-node/register',
            '--ui=ebdd',
            '--check-leaks',
            'test/spec/**/*.spec.ts',
        ];
        const forkOpts = { env: { ...process.env, TS_NODE_PROJECT: 'test/tsconfig.json' } };
        const childProcess = fork(nycPath, forkArgs, forkOpts);
        childProcess.on('exit', code => callback(code && 'Test failed'));
    },
);

task
(
    'compile',
    () =>
    {
        const { include }       = require('gulp-ignore');
        const { createProject } = require('gulp-typescript');
        const mergeStream       = require('merge-stream');

        const { dts, js } = src('src/**/*.ts').pipe(createProject('tsconfig.json')());
        const condition = ['novem.d.ts', 'solution.d.ts', 'solution-type.d.ts'];
        const stream =
        mergeStream
        (
            dts.pipe(include(condition)).pipe(dest('lib')),
            js.pipe(dest('.tmp-out')),
        );
        return stream;
    },
);

task
(
    'bundle',
    async () =>
    {
        const { homepage, version } = require('./package.json');
        const { rollup }            = require('rollup');

        const inputOptions =
        {
            input: '.tmp-out/novem.js',
            onwarn(warning)
            {
                if (warning.code !== 'THIS_IS_UNDEFINED')
                    console.error(warning.message);
            },
        };
        const outputOptions =
        {
            banner: `// novem ${version} – ${homepage}\n`,
            file:   'lib/novem.mjs',
            format: 'esm',
        };
        const bundle = await rollup(inputOptions);
        await bundle.write(outputOptions);
    },
);

task('default', series(parallel('clean', 'lint'), 'test', 'compile', 'bundle'));
