const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fse = require('fs-extra');
const constants = require('../generators/generator-constants');

const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;

describe('JHipster generator for entity with enum fields', () => {
    context('regeneration from json file', () => {
        describe('entity with an enum field', () => {
            before(done => {
                helpers
                    .run(require.resolve('../generators/entity'))
                    .inTmpDir(dir => {
                        fse.copySync(path.join(__dirname, '../test/templates/default-ng2'), dir);
                        fse.outputJsonSync(path.join(dir, '.jhipster/Foo.json'), {
                            fluentMethods: true,
                            relationships: [],
                            fields: [
                                { fieldName: 'id', fieldType: 'Long' },
                                { fieldName: 'language', fieldType: 'Language', fieldValues: 'FRENCH,ENGLISH,SPANISH' }
                            ],
                            changelogDate: '20160926101210',
                            entityTableName: 'foo',
                            dto: 'no',
                            pagination: 'no',
                            service: 'no'
                        });
                    })
                    .withArguments(['Foo'])
                    .withOptions({ regenerate: true, force: true })
                    .on('end', done);
            });

            it('creates the enum java file for enum fields', () => {
                assert.file(`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/domain/enumeration/Language.java`);
                assert.fileContent(`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/domain/enumeration/Language.java`, 'public enum Language');
            });

            it('creates the domain entity referencing the enum type', () => {
                assert.fileContent(`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/domain/Foo.java`, 'private Language language;');
            });
        });
    });
});
