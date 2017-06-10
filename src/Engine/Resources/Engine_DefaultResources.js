/*jslint node: true, vars: true, evil: true*/
/*global SimpleShader: false, TextureShader: false*/
"use strict";

var gEngine = gEngine || { };

gEngine.DefaultResources = (function() {
	/** @constant Simple Shader GLSL Shader file paths*/
	var kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";
	var kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";

		// Texture Shader
	var kTextureVS = "src/GLSLShaders/TextureVS.glsl";  // Path to VertexShader
	var kTextureFS = "src/GLSLShaders/TextureFS.glsl";  // Path to FragmentShader
	var mTextureShader = null;

	var mConstColorShader = null;
	var _getConstColorShader = function(){
		return mConstColorShader;
	};

	/** @callback func after loading is done*/
	var _createShaders = function(callbackFunction){
		mConstColorShader = new SimpleShader(kSimpleVS,kSimpleFS);
		mTextureShader = new TextureShader(kTextureVS, kTextureFS);
		callbackFunction();
	};

	var getTextureShader = function() { return mTextureShader; };

	/** initiate async loading of GLSL Shader files*/
	var _initialize = function(callbackFunction){
		// constant color shader: SimpleVS, and SimpleFS
	    gEngine.TextFileLoader.loadTextFile(kSimpleVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
	    gEngine.TextFileLoader.loadTextFile(kSimpleFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
		// texture shader:
	    gEngine.TextFileLoader.loadTextFile(kTextureVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
	    gEngine.TextFileLoader.loadTextFile(kTextureFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		gEngine.ResourceMap.setLoadCompleteCallback(function() {
			_createShaders(callbackFunction);
		});
	};

    var mPublic = {
		initialize: _initialize,
	    getConstColorShader: _getConstColorShader,
		getTextureShader: getTextureShader,
	};
    return mPublic;
}());