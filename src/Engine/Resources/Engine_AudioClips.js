/*
 * File: EngineCore_Audio.js
 * Provides support for loading and unloading of Audio clips
 */

/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, SimpleShader: false, window: false, alert: false, XMLHttpRequest: false */

"use strict";

var gEngine = gEngine || { };
gEngine.AudioClips = (function(){

	var mAudioContext = null;
	var mBgAudioNode = null;

	var initAudioContext = function(){
		try {
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			mAudioContext = new AudioContext();
		} catch(e){
			alert("Web Audio not supported!");
		}
	};

	var loadAudio = function(clipName){
		if(!(gEngine.ResourceMap.isAssetLoaded(clipName))){
			// Update resources in load counter
			gEngine.ResourceMap.asyncLoadRequested(clipName);
			// Async request data from server
			var req = new XMLHttpRequest();
			req.onreadystatechange = function(){
				if ((req.readyState === 4)&&(req.status !== 200)) {
					alert(clipName + ": loading failed! Hint: the index.html must beloaded by a webserver");
				}
			};
			/**
			* Initializes the request
			* @function
			* @param {method} GET - Make a GET request
			* @param {url} clipName - The location/name of the clip to get
			* @param {async} true - Make this request asynchronous
			*/
			req.open('GET', clipName, true);
			// Specify that the request retrieves binary data.
			req.responseType = "arraybuffer";

			req.onload = function(){
				/**
				* Decode the binary audio data
				* @function
				* @param {object} response - Response from the XMLHttprequest
				* @param {function} anonymous - Callback for when the decoding is done
				*/
				mAudioContext.decodeAudioData(req.response, function(buffer){
					gEngine.ResourceMap.asyncLoadCompleted(clipName, buffer);
				});
			};
			req.send();
		} else {
			gEngine.ResourceMap.incAssetRefCount(clipName);
		}
	};

	var unloadAudio = function(clipName){
		gEngine.ResourceMap.unloadAsset(clipName);
	};

	/**
	* Play a full audio clip. No reference to the source node is kept. Cannot be paused.
	* @function
	* @param {path} clipName - Audio file path to resource
	*/
	var playACue = function(clipName){
		var clipInfo = gEngine.ResourceMap.retrieveAsset(clipName);
		if(clipInfo !== null){
			// Source nodes are one use only
			var sourceNode = mAudioContext.createBufferSource();
			sourceNode.buffer = clipInfo;
			sourceNode.connect(mAudioContext.destination);
			sourceNode.start(0);
		}
	};

	var playBackgroundAudio = function(clipName){
		var clipInfo = gEngine.ResourceMap.retrieveAsset(clipName);
		if(clipInfo !== null){
			stopBackgroundAudio();
			mBgAudioNode = mAudioContext.createBufferSource();
			mBgAudioNode.buffer = clipInfo;
			mBgAudioNode.connect(mAudioContext.destination);
			mBgAudioNode.loop = true;
			mBgAudioNode.start(0);
		}
	};

    var stopBackgroundAudio = function () {
        // Check if the audio is  playing.
        if (mBgAudioNode !== null) {
            mBgAudioNode.stop(0);
            mBgAudioNode = null;
        }
    };

	var isBackgroundAudioPlaying = function() {
    return (mBgAudioNode !== null);
	};

    var mPublic = {
		initAudioContext: initAudioContext,
	    loadAudio: loadAudio,
	    unloadAudio: unloadAudio,
	    playACue: playACue,
	    playBackgroundAudio: playBackgroundAudio,
	    stopBackgroundAudio: stopBackgroundAudio,
	    isBackgroundAudioPlaying: isBackgroundAudioPlaying
	};
    return mPublic;
}());