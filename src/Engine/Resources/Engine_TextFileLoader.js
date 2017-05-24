/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false,
XMLHttpRequest: false, alert: false, DOMParser: false, vec2: false */
"use strict";

var gEngine = gEngine || {};

gEngine.TextFileLoader = (function(){

	// Object.freese disables modification, makes it immutable
	var eTextFileType = Object.freeze({
	    eXMLFile: 0,
	    eTextFile: 1
	});

	/**
	 * Load a text file
	 * @param {string} fileName - path to the resource
	 * @param {string} fileType - xml or text
	 * @param {string} callback - func to call when load is complete
	 */
    var loadTextFile = function (fileName, fileType, callbackFunction) {
        /** check if asset is already loaded*/
        if (!(gEngine.ResourceMap.isAssetLoaded(fileName))) {
            // Update resources in load counter.
            gEngine.ResourceMap.asyncLoadRequested(fileName);

            // Async request the data from server.
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                /** readyState 4 is request complete and returned */
                if ((req.readyState === 4) && (req.status !== 200)) {
                    alert(fileName + ": loading failed! [Hint: you cannot double click index.html to run this project. " +
                        "The index.html file must be loaded by a web-server.]");
                }
            };
            req.open('GET', fileName, true);
            req.setRequestHeader('Content-Type', 'text/xml');

            req.onload = function () {
                var fileContent = null;
                if (fileType === eTextFileType.eXMLFile) {
                    var parser = new DOMParser();
                    fileContent = parser.parseFromString(req.responseText, "text/xml");
                } else {
                    fileContent = req.responseText;
                }
                gEngine.ResourceMap.asyncLoadCompleted(fileName, fileContent);
                if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                    callbackFunction(fileName);
                }
            };
            req.send();
        } else {
            if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                callbackFunction(fileName);
            }
        }
    };

	var unloadTextFile = function (fileName){
		gEngine.ResourceMap.unloadAsset(fileName);
	};

	var mPublic = {
		loadTextFile: loadTextFile,
	    unloadTextFile: unloadTextFile,
	    eTextFileType: eTextFileType
	};
	return mPublic;
}());