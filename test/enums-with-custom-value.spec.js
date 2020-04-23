const assert = require('yeoman-assert');
const utils = require('../generators/utils');

describe('JHipster Utils ::buildEnumInfo', () => {
    describe('when the entity has enum fields with custom values', () => {
        it('exposes the custom value of every enum member', () => {
            const infos = utils.buildEnumInfo(
                { fieldType: 'Country', fieldValues: 'FRANCE(FR),ENGLAND(EN),GERMANY' },
                'myApp',
                'com.mycompany.myapp',
                'root'
            );
            assert.deepStrictEqual(infos.enumsWithCustomValue, [
                { name: 'FRANCE', value: 'FR' },
                { name: 'ENGLAND', value: 'EN' },
                { name: 'GERMANY', value: false }
            ]);
        });
    });
});
