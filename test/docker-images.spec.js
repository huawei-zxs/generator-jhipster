const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const constants = require('../generators/generator-constants');

describe('JHipster docker images configuration', () => {
    describe('MySQL docker image constant', () => {
        it('uses the MySQL 8.0.19 image shipped with JHipster 6.8.0', () => {
            assert.textEqual(constants.DOCKER_MYSQL, 'mysql:8.0.19');
        });
    });

    describe('generated MySQL docker configuration', () => {
        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/server'))
                .withOptions({ skipInstall: true, skipChecks: true })
                .withPrompts({
                    baseName: 'jhipster',
                    packageName: 'com.mycompany.myapp',
                    packageFolder: 'com/mycompany/myapp',
                    serviceDiscoveryType: false,
                    authenticationType: 'jwt',
                    cacheProvider: 'ehcache',
                    enableHibernateCache: true,
                    databaseType: 'sql',
                    devDatabaseType: 'h2Memory',
                    prodDatabaseType: 'mysql',
                    enableTranslation: true,
                    nativeLanguage: 'en',
                    languages: ['fr'],
                    buildTool: 'maven',
                    rememberMeKey: '5c37379956bd1242f5636c8cb322c2966ad81277',
                    serverSideOptions: []
                })
                .on('end', done);
        });

        it('generates src/main/docker/mysql.yml with the MySQL 8.0.19 image', () => {
            assert.fileContent('src/main/docker/mysql.yml', /image: mysql:8\.0\.19/);
        });
    });
});
