const path = require('path');
const fs = require('fs');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const getFilesForOptions = require('./utils/utils').getFilesForOptions;
const expectedFiles = require('./utils/expected-files');
const angularFiles = require('../generators/client/files-angular').files;
const reactFiles = require('../generators/client/files-react').files;
const constants = require('../generators/generator-constants');

const ANGULAR = constants.SUPPORTED_CLIENT_FRAMEWORKS.ANGULAR;
const REACT = constants.SUPPORTED_CLIENT_FRAMEWORKS.REACT;

describe('JHipster client generator', () => {
    describe('generate client with React', () => {
        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/client'))
                .withOptions({ skipInstall: true, auth: 'jwt', experimental: true })
                .withPrompts({
                    baseName: 'jhipster',
                    serviceDiscoveryType: false,
                    enableTranslation: true,
                    nativeLanguage: 'en',
                    languages: ['fr'],
                    clientFramework: REACT
                })
                .on('end', done);
        });
        it('creates expected files for react configuration for client generator', () => {
            assert.noFile(expectedFiles.maven);
            assert.file(
                getFilesForOptions(reactFiles, {
                    enableTranslation: true,
                    serviceDiscoveryType: false,
                    authenticationType: 'jwt',
                    testFrameworks: []
                })
            );
        });
        it('contains clientFramework with react value', () => {
            assert.fileContent('.yo-rc.json', /"clientFramework": "react"/);
        });
        it('generates a package.json with mutually compatible react-router-dom versions', () => {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const runtimeVersion = packageJson.dependencies['react-router-dom'];
            const typesVersion = packageJson.devDependencies['@types/react-router-dom'];
            assert.strictEqual(runtimeVersion, '5.1.2');
            assert.strictEqual(typesVersion, '5.1.3');
            assert.strictEqual(
                runtimeVersion.split('.')[0],
                typesVersion.split('.')[0],
                `@types/react-router-dom (${typesVersion}) major version must match react-router-dom (${runtimeVersion})`
            );
        });
    });

    describe('generate client with Angular', () => {
        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/client'))
                .withOptions({ skipInstall: true, auth: 'jwt' })
                .withPrompts({
                    baseName: 'jhipster',
                    serviceDiscoveryType: false,
                    enableTranslation: true,
                    nativeLanguage: 'en',
                    languages: ['fr'],
                    clientFramework: ANGULAR
                })
                .on('end', done);
        });

        it('creates expected files for default configuration for client generator', () => {
            assert.noFile(expectedFiles.common);
            assert.noFile(expectedFiles.server);
            assert.noFile(expectedFiles.maven);
            assert.file(expectedFiles.i18nJson);
            assert.file(
                getFilesForOptions(angularFiles, {
                    enableTranslation: true,
                    serviceDiscoveryType: false,
                    authenticationType: 'jwt',
                    testFrameworks: []
                })
            );
        });
        it('contains clientFramework with angularX value', () => {
            assert.fileContent('.yo-rc.json', /"clientFramework": "angularX"/);
        });
        it('contains clientPackageManager with npm value', () => {
            assert.fileContent('.yo-rc.json', /"clientPackageManager": "npm"/);
        });
    });

    describe('generate client with Angular using yarn flag', () => {
        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/client'))
                .withOptions({ skipInstall: true, auth: 'jwt', yarn: true })
                .withPrompts({
                    baseName: 'jhipster',
                    serviceDiscoveryType: false,
                    enableTranslation: true,
                    nativeLanguage: 'en',
                    languages: ['fr'],
                    clientFramework: ANGULAR
                })
                .on('end', done);
        });

        it('creates expected files for default configuration for client-2 generator', () => {
            assert.noFile(expectedFiles.common);
            assert.noFile(expectedFiles.server);
            assert.noFile(expectedFiles.maven);
            assert.file(expectedFiles.i18nJson);
            assert.file(
                getFilesForOptions(angularFiles, {
                    enableTranslation: true,
                    serviceDiscoveryType: false,
                    authenticationType: 'jwt',
                    testFrameworks: []
                })
            );
        });
        it('contains clientFramework with angularX value', () => {
            assert.fileContent('.yo-rc.json', /"clientFramework": "angularX"/);
        });
        it('contains clientPackageManager with yarn value', () => {
            assert.fileContent('.yo-rc.json', /"clientPackageManager": "yarn"/);
        });
    });
});
