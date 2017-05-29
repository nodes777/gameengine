/*jslint node: true, vars: true, evil: true*/
/*global SimpleShader: false,*/
"use strict";

var gEngine = gEngine || { };

gEngine.DefaultResources = (function() {
	/** @constant Simple Shader GLSL Shader file paths*/
	var kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";
	var kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";

	var mConstColorShader = null;
	var _getConstColorShader = function(){
		return mConstColorShader;
	};

	/** @callback func after loading is done*/
	var _createShaders = function(callbackFunction){
		mConstColorShader = new SimpleShader(kSimpleVS,kSimpleFS);
		callbackFunction();
	};

	/** initiate async loading of GLSL Shader files*/
	var _initialize = function(callbackFunction){
		// constant color shader: SimpleVS, and SimpleFS
	    gEngine.TextFileLoader.loadTextFile(kSimpleVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
	    gEngine.TextFileLoader.loadTextFile(kSimpleFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
		gEngine.ResourceMap.setLoadCompleteCallback(function() {
			_createShaders(callbackFunction);
		});
	};

    var mPublic = {
		initialize: _initialize,
	    getConstColorShader: _getConstColorShader
	};
    return mPublic;
}());