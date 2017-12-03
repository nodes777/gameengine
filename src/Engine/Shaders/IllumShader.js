/*
 * File: IllumShader.js
 * Subclass from LightShader (to take advantage of light sources)
 */
/*jslint node: true, vars: true */
/*global gEngine, SpriteShader, LightShader, ShaderMaterial, ShaderLightAtIndex, vec4 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";
/**
* Subclass from LightShader, provides normal mapping support. Talks to IllumFS.glsl
* @class
*/
function IllumShader (vertexShaderPath, fragmentShaderPath){
	LightShader.call(this, vertexShaderPath, fragmentShaderPath);

	var gl = gEngine.Core.getGL();

	// this is the material property of the renderable
    this.mMaterial = null;
    this.mMaterialLoader = new ShaderMaterial(this.mCompiledShader);

    // Reference to the camera position
    this.mCameraPos = null;  // points to a vec3
    this.mCameraPosRef = gl.getUniformLocation(this.mCompiledShader, "uCameraPosition");

	this.mNormalSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uNormalSampler");
}

gEngine.Core.inheritPrototype(IllumShader, LightShader);

IllumShader.prototype.activateShader = function(pixelColor, aCamera){
	LightShader.prototype.activateShader.call(this, pixelColor, aCamera);
	var gl = gEngine.Core.getGL();

	// bind to texture unit 1
	gl.uniform1i(this.mNormalSamplerRef, 1);
	// Don't need texture coord buffer
	// Will use the ones from the sprite texture
	this.mMaterialLoader.loadToShader(this.mMaterial);
    gl.uniform3fv(this.mCameraPosRef, this.mCameraPos);
};

IllumShader.prototype.setMaterialAndCameraPos = function(m, p){
	this.mMaterial = m;
	this.mCameraPos = p;
};