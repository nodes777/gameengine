/*jslint node: true, vars: true, evil: true*/
/*global SimpleShader: false, TextureShader: false, SpriteShader: false, vec4:false*/
"use strict";

var gEngine = gEngine || { };
/**
 * Default Resources Module.
 * @module Core/Resources/Engine_DefaultResources
 */
gEngine.DefaultResources = (function() {
	/** @constant Simple Shader GLSL Shader file paths*/
	var kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";
	var kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";


	// Global Ambient color
	var mGlobalAmbientColor = [0.3, 0.3, 0.3, 1];
	var mGlobalAmbientIntensity = 1;

		// Texture Shader
	var kTextureVS = "src/GLSLShaders/TextureVS.glsl";  // Path to VertexShader
	var kTextureFS = "src/GLSLShaders/TextureFS.glsl";  // Path to FragmentShader
	var mTextureShader = null;

	var mSpriteShader = null;
	var getSpriteShader = function(){
		return mSpriteShader;
	};

	var mConstColorShader = null;
	var _getConstColorShader = function(){
		return mConstColorShader;
	};

	// Fonts
	var kDefaultFont = "assets/fonts/system-default-font";
	var getDefaultFont = function() { return kDefaultFont; };

	/** @callback func after loading is done*/
	var _createShaders = function(callbackFunction){
		mConstColorShader = new SimpleShader(kSimpleVS,kSimpleFS);
		mTextureShader = new TextureShader(kTextureVS, kTextureFS);
		mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
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
		// Font
		gEngine.Fonts.loadFont(kDefaultFont);

		gEngine.ResourceMap.setLoadCompleteCallback(function() {
			_createShaders(callbackFunction);
		});
	};

	/** @function Removes resources from memory by deleting associated buffers from webGL and detaching shaders. And unloading text and font files. */
	var cleanUp = function(){
		mConstColorShader.cleanUp();
		mTextureShader.cleanUp();
		mSpriteShader.cleanUp();

		gEngine.TextFileLoader.unloadTextFile(kSimpleVS);
		gEngine.TextFileLoader.unloadTextFile(kSimpleFS);

		gEngine.TextFileLoader.unloadTextFile(kTextureVS);
		gEngine.TextFileLoader.unloadTextFile(kTextureFS);

		gEngine.Fonts.unloadFont(kDefaultFont);
	};

	var getGlobalAmbientIntensity = function() { return mGlobalAmbientIntensity; };
	var setGlobalAmbientIntensity = function(v) { mGlobalAmbientIntensity = v; };
	var getGlobalAmbientColor = function() { return mGlobalAmbientColor; };
	var setGlobalAmbientColor = function(v) {
        mGlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]);
	};

    var mPublic = {
		initialize: _initialize,
	    getConstColorShader: _getConstColorShader,
		getTextureShader: getTextureShader,
		getSpriteShader:getSpriteShader,
		getDefaultFont: getDefaultFont,
		cleanUp: cleanUp,
		getGlobalAmbientColor: getGlobalAmbientColor,
		getGlobalAmbientIntensity: getGlobalAmbientIntensity,
		setGlobalAmbientColor: setGlobalAmbientColor,
		setGlobalAmbientIntensity: setGlobalAmbientIntensity,
	};
    return mPublic;
}());