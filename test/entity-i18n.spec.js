const path = require('path');
const fs = require('fs');
const os = require('os');
const fse = require('fs-extra');
const expect = require('chai').expect;
// using base generator which extends the private base
const BaseGenerator = require('../generators/generator-base').prototype;

const TEMPLATES_DIR = path.join(__dirname, '../generators/entity-i18n/templates');

describe('JHipster entity i18n files', () => {
    describe('copyI18n', () => {
        let tmpDir;

        before(() => {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jhipster-entity-i18n-'));
        });

        after(() => {
            fse.removeSync(tmpDir);
        });

        it('creates the entity i18n json file and registers the menu translation key', () => {
            // Mimic yeoman's mem-fs-editor behavior: throwing when the source template does not exist.
            const template = (src, dest) => {
                if (!fs.existsSync(src)) {
                    throw new Error(`${src} doesn't exist`);
                }
                fse.ensureDirSync(path.dirname(dest));
                fse.copySync(src, dest);
            };
            const addedKeys = [];
            const generator = {
                entityTranslationKey: 'foo',
                entityTranslationKeyMenu: 'foo',
                entityClass: 'Foo',
                CLIENT_MAIN_SRC_DIR: `${tmpDir}/`,
                template,
                addEntityTranslationKey: (menuKey, entityClass, lang) => addedKeys.push({ menuKey, entityClass, lang }),
                debug: () => {}
            };

            BaseGenerator.copyI18n.call(generator, 'en', TEMPLATES_DIR);

            expect(fs.existsSync(path.join(tmpDir, 'i18n/en/foo.json'))).to.equal(true);
            expect(addedKeys).to.have.length(1);
            expect(addedKeys[0]).to.eql({ menuKey: 'foo', entityClass: 'Foo', lang: 'en' });
        });
    });
});
