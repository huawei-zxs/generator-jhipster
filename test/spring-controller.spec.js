const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fse = require('fs-extra');
const constants = require('../generators/generator-constants');

const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;

describe('JHipster generator spring-controller', () => {
    describe('creates spring controller', () => {
        before(done => {
            helpers
                .run(require.resolve('../generators/spring-controller'))
                .inTmpDir(dir => {
                    fse.copySync(path.join(__dirname, '../test/templates/default'), dir);
                })
                .withArguments(['foo'])
                .withPrompts({
                    actionAdd: false
                })
                .on('end', done);
        });

        it('creates controller files', () => {
            assert.file([`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/web/rest/FooResource.java`]);

            assert.file([`${SERVER_TEST_SRC_DIR}com/mycompany/myapp/web/rest/FooResourceIT.java`]);
        });
    });

    describe('creates spring controller with --default flag', () => {
        before(done => {
            helpers
                .run(require.resolve('../generators/spring-controller'))
                .inTmpDir(dir => {
                    fse.copySync(path.join(__dirname, '../test/templates/default'), dir);
                })
                .withArguments(['foo'])
                .withOptions({ default: true })
                .on('end', done);
        });

        it('creates controller files', () => {
            assert.file([`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/web/rest/FooResource.java`]);

            assert.file([`${SERVER_TEST_SRC_DIR}com/mycompany/myapp/web/rest/FooResourceIT.java`]);
        });
    });
});

describe('spring-controller template paths', () => {
    it('references only existing template directories in the generator source', () => {
        const fs = require('fs');
        const nodeAssert = require('assert');
        const BaseGenerator = require('../generators/generator-base').prototype;

        const source = fs.readFileSync(path.join(__dirname, '../generators/spring-controller/index.js'), 'utf-8');
        const matches = source.match(/fetchFromInstalledJHipster\(\s*'([^']+)'\s*\)/g);
        nodeAssert.ok(matches && matches.length > 0, 'expected at least one referenced template subpath');

        matches.forEach(match => {
            const subpath = match.match(/'([^']+)'/)[1];
            const resolved = BaseGenerator.fetchFromInstalledJHipster(subpath);
            nodeAssert.strictEqual(fs.existsSync(resolved), true, `referenced template path does not exist: ${resolved}`);
        });
    });
});
