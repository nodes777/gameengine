/*
 * File: EngineCore_Fonts.js
 * Provides support for loading and unloading of font image and font description
 */

/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, XMLHttpRequest: false, DOMParser: false, alert: false, XPathResult: false */

"use strict";

var gEngine = gEngine || { };

/**
* @class
* @classdesc An object for storing pixel location and display information associated with the characters.
* In texture/ uv coords (0 to 1). Maps to entire image.
* UV coord and char info can be computed from .fnt file
*/
function CharacterInfo() {
	this.mTexCoordLeft = 0;
	this.mTexCoordRight = 1;
	this.mTexCoordBottom = 0;
	this.mTexCoordTop = 1;

	// nominal character size, 1 is "standard width/height" of a char
	this.mCharWidth = 1;
	this.mCharHeight = 1;
	this.mCharWidthOffset = 0;
	this.mCharHeightOffset = 0;

	// Reference to width/height ratio
	this.mCharAspectRatio = 1;
}

gEngine.Fonts = (function(){
	var loadFont = function(fontName){
		if(!gEngine.ResourceMap.isAssetLoaded(fontName)){
			var fontInfoSourceString = fontName + ".fnt";
			var textureSourceString = fontName + ".png";

			//register and entry in the map
			gEngine.ResourceMap.asyncLoadRequested(fontName);
			gEngine.Textures.loadTexture(textureSourceString);
			// params: filename, filetype, callback
			gEngine.TextFileLoader.loadTextFile(fontInfoSourceString,
				gEngine.TextFileLoader.eTextFileType.eXMLFile,
				_storeLoadedFont);
	    } else {
	        gEngine.ResourceMap.incAssetRefCount(fontName);
	    }
	};
	/** @params fontInfoSourceString - Path to .fnt file. Since the callback in loadTextFile only passes one param (fileName), additional massaging is used to get all data. */
	var _storeLoadedFont = function(fontInfoSourceString){
		var fontName = fontInfoSourceString.slice(0,-4);
		var fontInfo = gEngine.ResourceMap.retrieveAsset(fontInfoSourceString);
		fontInfo.fontImage = fontName + ".png";
		gEngine.ResourceMap.asyncLoadCompleted(fontName, fontInfo);
	};

	var unloadFont = function(fontName){
		gEngine.ResourceMap.unloadAsset(fontName);
		if(!(gEngine.ResourceMap.isAssetLoaded(fontName))){
			var fontInfoSourceString = fontName + ".fnt";
			var textureSourceString = fontName + ".png";

			gEngine.Textures.unloadAsset(textureSourceString);
			gEngine.TextFileLoader.unloadTextFile(fontInfoSourceString);
		}

	};

	/** @function Uses the fnt file to determine which character to pull from map. Not covered in book*/
	var getCharInfo = function(fontName, aChar){
		var returnInfo = null;
        var fontInfo = gEngine.ResourceMap.retrieveAsset(fontName);
        var commonPath = "font/common";
        var commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        commonInfo = commonInfo.iterateNext();
        if (commonInfo === null) {
            return returnInfo;
        }
        var charHeight = commonInfo.getAttribute("base");

        var charPath = "font/chars/char[@id=" + aChar + "]";
        var charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        charInfo = charInfo.iterateNext();

        if (charInfo === null) {
            return returnInfo;
        }

        returnInfo = new CharacterInfo();
        var texInfo = gEngine.Textures.getTextureInfo(fontInfo.FontImage);
        var leftPixel = Number(charInfo.getAttribute("x"));
        var rightPixel = leftPixel + Number(charInfo.getAttribute("width")) - 1;
        var topPixel = (texInfo.mHeight - 1) - Number(charInfo.getAttribute("y"));
        var bottomPixel = topPixel - Number(charInfo.getAttribute("height")) + 1;

        // texture coordinate information
        returnInfo.mTexCoordLeft = leftPixel / (texInfo.mWidth - 1);
        returnInfo.mTexCoordTop = topPixel / (texInfo.mHeight - 1);
        returnInfo.mTexCoordRight = rightPixel / (texInfo.mWidth - 1);
        returnInfo.mTexCoordBottom = bottomPixel / (texInfo.mHeight - 1);

        // relative character size
        var charWidth = charInfo.getAttribute("xadvance");
        returnInfo.mCharWidth = charInfo.getAttribute("width") / charWidth;
        returnInfo.mCharHeight = charInfo.getAttribute("height") / charHeight;
        returnInfo.mCharWidthOffset = charInfo.getAttribute("xoffset") / charWidth;
        returnInfo.mCharHeightOffset = charInfo.getAttribute("yoffset") / charHeight;
        returnInfo.mCharAspectRatio = charWidth / charHeight;

        return returnInfo;
	};

	var mPublic = {
		loadFont: loadFont,
        unloadFont: unloadFont,
        getCharInfo: getCharInfo
	};
    return mPublic;
}());

