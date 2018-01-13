/*
 * File: ShadowCasterShader.js
 * Subclass from SpriteShader
 *      a little similar to LightShader, except, only defines
 *      one light: the one that casts the shadow
 */
/*jslint node: true, vars: true */
/*global gEngine, SpriteShader, ShaderLightAtIndex, vec4 */
"use strict";

function ShadowCasterShader(vertexShaderPath, fragmentShaderPath){
	SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);

	this.mLight = null; // the light that casts the shadow

	// **** The GLSL Shader must define uLights[1] <-- as the only light source!!
    this.mShaderLight = new ShaderLightAtIndex(this.mCompiledShader, 0);
}
gEngine.Core.inheritPrototype(ShadowCasterShader, SpriteShader);

ShadowCasterShader.prototype.activateShader = function (pixelColor, aCamera) {
    // first call the super class’s activate
    SpriteShader.prototype.activateShader.call(this, pixelColor, aCamera);
    this.mShaderLight.loadToShader(aCamera, this.mLight);
};

ShadowCasterShader.prototype.setLight = function(l){
	this.mLight = l;
}