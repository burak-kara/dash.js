/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */

import FactoryMaker from '../../core/FactoryMaker';
import Debug from '../../core/Debug';
import Thumbnail from '../vo/Thumbnail';
import ThumbnailTracks from './ThumbnailTracks';
import {replaceTokenForTemplate, unescapeDollarsInTemplate} from '../../dash/utils/SegmentsUtils';

function ThumbnailController(config) {

    const context = this.context;
    const log = Debug(context).getInstance().log;

    let instance;
    let thumbnailTracks;

    function setup() {
        reset();
        thumbnailTracks = ThumbnailTracks(context).create({
            manifestModel: config.manifestModel,
            dashManifestModel: config.dashManifestModel,
            adapter: config.adapter,
            baseURLController: config.baseURLController,
            stream: config.stream
        });
    }

    function getThumbnail(time) {
        if (!thumbnailTracks) {
            return null;
        }
        const track = thumbnailTracks.getCurrentTrack();
        if (!track || track.segmentDuration <= 0) {
            return null;
        }
        log('Retrieving thumbnail from track index ', track.id, ' at time ', time, ' seconds');

        const seq = Math.floor(time / track.segmentDuration);
        const offset = time % track.segmentDuration;
        const thumbIndex = Math.floor(offset / (track.tilesHor * track.tilesVert)) - 1;

        const thumbnail = new Thumbnail();
        thumbnail.url = buildUrlFromTemplate(track, seq);
        thumbnail.width = Math.floor(track.width / track.tilesHor);
        thumbnail.height = Math.floor(track.height / track.tilesVert);
        thumbnail.x = Math.floor(thumbIndex % track.tilesHor) * thumbnail.width;
        thumbnail.y = Math.floor(thumbIndex / track.tilesHor) * thumbnail.height;

        log('Time', time, 'Thumbnail - seq:', seq, ', x:', thumbnail.x, ', y:', thumbnail.y, ', w:', thumbnail.width, 'h:', thumbnail.height);
        return thumbnail;
    }

    function buildUrlFromTemplate(track, seq) {
        const seqIdx = seq + track.startNumber;
        let url = replaceTokenForTemplate(track.templateUrl, 'Number', seqIdx);
        url = replaceTokenForTemplate(url, 'Time', (seqIdx - 1) * track.segmentDuration);
        url = replaceTokenForTemplate(url, 'Bandwidth', track.bandwidth);
        return unescapeDollarsInTemplate(url);
    }

    function setTrack(id) {
        thumbnailTracks.setCurrentTrackId(id);
    }

    function getCurrentTrack() {
        return thumbnailTracks.getCurrentTrack();
    }

    function reset() {
        if (thumbnailTracks) {
            thumbnailTracks.reset();
        }
    }

    instance = {
        get: getThumbnail,
        setTrack: setTrack,
        getCurrentTrack: getCurrentTrack,
        reset: reset
    };

    setup();

    return instance;
}

ThumbnailController.__dashjs_factory_name = 'ThumbnailController';
export default FactoryMaker.getClassFactory(ThumbnailController);