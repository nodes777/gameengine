/*
 * File: ShaderMaterial.js
 * Knows how to load aMaterial into the IllumShader
 * Rederences point to uMaterial.
 */

/*jslint node: true, vars: true */
/*global gEngine, vec4 */

"use strict";
/**
* Allows interfacing with webgl for material class.
* @class
*/
function ShaderMaterial(aIllumShader){
	var gl = gEngine.Core.getGL();
	this.mKaRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ka");
	this.mKdRef = gl.getUniformLocation(aIllumShader, "uMaterial.Kd");
	this.KsRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ks");
	this.mShineRef = gl.getUniformLocation(aIllumShader, "uMaterial.Shininess");
}

ShaderMaterial.prototype.loadToShader = function(aMaterial){
	var gl = gEngine.Core.getGL();
	gl.uniform4fv(this.mKaRef, aMaterial.getAmbient());
	gl.uniform4fv(this.mKdRef, aMaterial.getDiffuse());
	gl.uniform4fv(this.KsRef, aMaterial.getSpecular());
	gl.uniform1f(this.mShineRef, aMaterial.getShininess());
};