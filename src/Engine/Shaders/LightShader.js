/*
 * File: Lights.js
 * Interfaces with the WebGL for Light
 */
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, aCamera: false, SpriteShader: false,
    vec3: false, vec4: false, gEngine: false,*/
"use strict";

function LightShader(vertexShaderPath, fragmentShaderPath){
	SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);

	//glsl uniform position references
	this.mColorRef = null;
	this.mPosRef = null;
	this.mRadiusRef = null;
	this.mIsOnRef = null;
	this.mLight = null; // the light source in the game engine

	//create references to these uniforms in the LightShader
	// Why do we create null references first??
	var shader = this.mCompiledShader;
	var gl = gEngine.Core.getGL();
	this.mColorRef = gl.getUniformLocation(shader, "uLightColor");
	this.mPosRef = gl.getUniformLocation(shader, "uLightPosition");
	this.mRadiusRef = gl.getUniformLocation(shader, "uLightRadius");
    this.mIsOnRef = gl.getUniformLocation(shader, "uLightOn");
}
gEngine.Core.inheritPrototype(LightShader, SpriteShader);

LightShader.prototype.setLight = function(l){
	this.mLight = l;
};

/**
* Overwrite the SpriteShader activation adding functionality of turning light off and on.
* @func
*/
LightShader.prototype.activateShader = function(pixelColor, aCamera) {
	//First call the superclass's activate
	SpriteShader.prototype.activateShader.call(this, pixelColor, aCamera);

	// Now push the light info to the shader
	if(this.mLight !== null){
		this._loadToShader(aCamera);
	} else {
		gEngine.Core.getGL().uniform1i(this.mIsOnRef, false); // switch off the light!
	}
};

/**
* Overwrite the SpriteShader activation adding functionality of turning light off and on.
* @func
*/
LightShader.prototype._loadToShader = function(aCamera){
	var gl = gEngine.Core.getGL();
	gl.uniform1i(this.mIsOnRef, this.mLight.isLightOn());
	if(this.mLight.isLightOn()){
		var p = aCamera.wcPosToPixel(this.mLight.getPosition());
		var r = aCamera.wcSizeToPixel(this.mLight.getRadius())
		var c = this.mLight.getColor();

		gl.uniform4fv(this.mColorRef, c);
		gl.uniform4fv(this.mPosRef, vec4.fromValues(p[0], p[1], p[2], 1));
		gl.uniform1f(this.mRadiusRef, r);
	}
};