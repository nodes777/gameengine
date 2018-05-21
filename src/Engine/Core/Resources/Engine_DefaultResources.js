/*jslint node: true, vars: true, evil: true*/
/*global SimpleShader: false, TextureShader: false, SpriteShader: false, vec4:false, LightShader: false, IllumShader: false*/
"use strict";

var gEngine = gEngine || { };
/**
 * Default Resources Module.
 * @module Core/Resources/Engine_DefaultResources
 */
gEngine.DefaultResources = (function() {

	// Global Ambient color
	var mGlobalAmbientColor = [0.3, 0.3, 0.3, 1];
	var mGlobalAmbientIntensity = 1;

	var getGlobalAmbientIntensity = function() { return mGlobalAmbientIntensity; };
	var setGlobalAmbientIntensity = function(v) { mGlobalAmbientIntensity = v; };
	var getGlobalAmbientColor = function() { return mGlobalAmbientColor; };
	var setGlobalAmbientColor = function(v) {
        mGlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]);
	};

	/** @constant Simple Shader GLSL Shader file paths*/
	var kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";
	var kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";

		// Texture Shader
	var kTextureVS = "src/GLSLShaders/TextureVS.glsl";  // Path to VertexShader
	var kTextureFS = "src/GLSLShaders/TextureFS.glsl";  // Path to FragmentShader
	var mTextureShader = null;

	// Illumination Shader
	var kIllumFS = "src/GLSLShaders/IllumFS.glsl";      // Path to the Illumination FragmentShader
	var mIllumShader = null;
	var getIllumShader = function(){ return mIllumShader; };

	/** @constant Particle Shader GLSL Shader file paths*/
	var kParticleFS = "src/GLSLShaders/ParticleFS.glsl";
	var mParticleShader = null;
	var getParticleShader = function () { return mParticleShader };

	var mSpriteShader = null;
	var getSpriteShader = function(){
		return mSpriteShader;
	};

	var mConstColorShader = null;
	var _getConstColorShader = function(){
		return mConstColorShader;
	};

	var kLightFS = "src/GLSLShaders/LightFS.glsl";
	var mLightShader = null;

	var kLineFS = "src/GLSLShaders/LineFS.glsl";        // Path to the Line FragmentShader
    var mLineShader = null;

	// Shadow Shaders
	var kShadowReceiverFS = "src/GLSLShaders/ShadowReceiverFS.glsl"
	var mShadowReceiverShader = null;
	var kShadowCasterFS = "src/GLSLShaders/ShadowCasterFS.glsl";  // Path to the FragmentShader
	var mShadowCasterShader = null;

	// Fonts
	var kDefaultFont = "assets/fonts/system-default-font";
	var getDefaultFont = function() { return kDefaultFont; };


	/** @callback func after loading is done*/
	var _createShaders = function(callbackFunction){
		gEngine.ResourceMap.setLoadCompleteCallback(null);
		mConstColorShader = new SimpleShader(kSimpleVS,kSimpleFS);
		mTextureShader = new TextureShader(kTextureVS, kTextureFS);
		mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
		mLineShader =  new LineShader(kSimpleVS, kLineFS);
		mLightShader = new LightShader(kTextureVS, kLightFS);
		mIllumShader = new IllumShader(kTextureVS, kIllumFS);
		mShadowReceiverShader = new SpriteShader(kTextureVS, kShadowReceiverFS);
		mShadowCasterShader = new ShadowCasterShader(kTextureVS, kShadowCasterFS);
		mParticleShader = new TextureShader(kTextureVS, kParticleFS);
		callbackFunction();
	};

	var getTextureShader = function() { return mTextureShader; };
	var getShadowReceiverShader = function () { return mShadowReceiverShader; };
    var getShadowCasterShader = function () { return mShadowCasterShader; };

    var getLineShader = function () { return mLineShader; };

	/** initiate async loading of GLSL Shader files*/
	var initialize = function(callbackFunction){
		// constant color shader: SimpleVS, and SimpleFS
	    gEngine.TextFileLoader.loadTextFile(kSimpleVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
	    gEngine.TextFileLoader.loadTextFile(kSimpleFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
		// texture shader:
	    gEngine.TextFileLoader.loadTextFile(kTextureVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
	    gEngine.TextFileLoader.loadTextFile(kTextureFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		// Line Shader:
        gEngine.TextFileLoader.loadTextFile(kLineFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		// Font
		gEngine.Fonts.loadFont(kDefaultFont);
		// Light shader
        gEngine.TextFileLoader.loadTextFile(kLightFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

        // IllumShader
        gEngine.TextFileLoader.loadTextFile(kIllumFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		// Shadow caster and receiver shaders
        gEngine.TextFileLoader.loadTextFile(kShadowReceiverFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.loadTextFile(kShadowCasterFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

        // Particle Shader
        gEngine.TextFileLoader.loadTextFile(kParticleFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		gEngine.ResourceMap.setLoadCompleteCallback(function() {
			_createShaders(callbackFunction);
		});
	};

	/** @function Removes resources from memory by deleting associated buffers from webGL and detaching shaders. And unloading text and font files. */
	var cleanUp = function(){
		mConstColorShader.cleanUp();
		mTextureShader.cleanUp();
		mSpriteShader.cleanUp();
		mLineShader.cleanUp();
        mIllumShader.cleanUp();
        mShadowReceiverShader.cleanUp();
        mShadowCasterShader.cleanUp();

		gEngine.TextFileLoader.unloadTextFile(kSimpleVS);
		gEngine.TextFileLoader.unloadTextFile(kSimpleFS);

		gEngine.TextFileLoader.unloadTextFile(kTextureVS);
		gEngine.TextFileLoader.unloadTextFile(kTextureFS);

		gEngine.Fonts.unloadFont(kDefaultFont);

        gEngine.TextFileLoader.unloadTextFile(kLightFS);

	    gEngine.TextFileLoader.unloadTextFile(kIllumFS);

        gEngine.TextFileLoader.unloadTextFile(kShadowReceiverFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.unloadTextFile(kShadowCasterFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		gEngine.TextFileLoader.unloadTextFile(kParticleFS);
	};

	var getLightShader = function() {return mLightShader;};

    var mPublic = {
        initialize: initialize,
        getConstColorShader: _getConstColorShader,
        getTextureShader: getTextureShader,
        getSpriteShader: getSpriteShader,
        getLineShader: getLineShader,
        getLightShader: getLightShader,
        getIllumShader: getIllumShader,
        getShadowReceiverShader: getShadowReceiverShader,
        getShadowCasterShader: getShadowCasterShader,
        getDefaultFont: getDefaultFont,
        getGlobalAmbientColor: getGlobalAmbientColor,
        setGlobalAmbientColor: setGlobalAmbientColor,
        getGlobalAmbientIntensity: getGlobalAmbientIntensity,
        setGlobalAmbientIntensity: setGlobalAmbientIntensity,
        getParticleShader: getParticleShader,
        cleanUp: cleanUp
	};
    return mPublic;
}());