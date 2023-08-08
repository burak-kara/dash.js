import ThroughputRule from '../../src/streaming/rules/abr/ThroughputRule';
import SwitchRequest from '../../src/streaming/rules/SwitchRequest';

const expect = require('chai').expect;
const context = {};
const throughputRule = ThroughputRule(context).create({});

describe('ThroughputRule', function () {
    it('should return an empty switchRequest when getMaxIndex function is called with an empty parameter', function () {
        const maxIndexRequest = throughputRule.getMaxIndex();

        expect(maxIndexRequest.quality).to.be.equal(SwitchRequest.NO_CHANGE);
    });

    it('should return an empty switchRequest when getMaxIndex function is called with an malformed parameter', function () {
        const maxIndexRequest = throughputRule.getMaxIndex({});

        expect(maxIndexRequest.quality).to.be.equal(SwitchRequest.NO_CHANGE);
    });

});
