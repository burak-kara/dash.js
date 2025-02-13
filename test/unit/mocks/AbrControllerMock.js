const QUALITY_DEFAULT = 0;

function AbrControllerMock () {
    this.qualityDict = {};
    this.elementWidth = undefined;
    this.elementHeight = undefined;
    this.windowResizeEventCalled = false;
    this.currentStreamId = undefined;
    this.topBitrateInfo = null;
    let self = this;

    this.QUALITY_DEFAULT = function () {
        return QUALITY_DEFAULT;
    };

    this.initialize = function () {};

    this.createAbrRulesCollection = function () {};

    this.reset = function () {
    };

    this.setConfig = function () {};

    this.getMaxAllowedIndexFor = function () {};


    this.getTopBitrateInfoFor = function () {
        return self.topBitrateInfo;
    };

    this.setTopBitrateInfo = function (info) {
        self.topBitrateInfo = info;
    };

    this.getInitialBitrateFor = function (/*type*/) {
        return null;
    };

    this.checkPlaybackQuality = function () {};

    this.setPlaybackQuality = function (type, streamInfo, newQuality) {
        this.setQualityFor(type,streamInfo.id,newQuality);
    };

    this.setAbandonmentStateFor = function () {};

    this.getAbandonmentStateFor = function () {};

    this.getQualityForBitrate = function () {};

    this.getBitrateList = function () {
        return [];
    };

    this.updateTopQualityIndex = function () {};

    this.isPlayingAtTopQuality = function () {};

    this.setQualityFor = function (type, id, value) {
        this.currentStreamId = id;
        this.qualityDict[id] = this.qualityDict[id] || {};
        this.qualityDict[id][type] = value;
    };

    this.setWindowResizeEventCalled = function (value) {
        this.windowResizeEventCalled = value;
    };

    this.getWindowResizeEventCalled = function () {
        return this.windowResizeEventCalled;
    };

    this.setElementSize = function () {
        this.elementWidth = 10;
        this.elementHeight = 10;
    };

    this.getElementWidth = function () {
        return this.elementWidth;
    };

    this.getElementHeight = function () {
        return this.elementHeight;
    };

    this.unRegisterStreamType = function (/*type*/) {
    };


    this.getMinAllowedIndexFor = function () {};

    this.clearDataForStream = function () {};

    this.getPossibleVoRepresentations = function () {
        return []
    }

    this.getPossibleVoRepresentationsFilteredBySettings = function () {
        return []
    }
}

export default AbrControllerMock;
