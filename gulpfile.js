'use strict';

const { series, task } = require('gulp');

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

task('default', series('lint', 'test'));
