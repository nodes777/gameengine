/*
 * File: IllumShader.js
 * Subclass from LightShader (to take advantage of light sources)
 */
/*jslint node: true, vars: true */
/*global gEngine, SpriteShader, LightShader, ShaderLightAtIndex, vec4 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";
/**
* Subclass from LightShader, provides normal mapping support. Talks to IllumFS.glsl
* @class
*/
function IllumShader (vertexShaderPath, fragmentShaderPath){
	LightShader.call(this, vertexShaderPath, fragmentShaderPath);

	var gl = gEngine.Core.getGL();

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
};