/*
* Renderable Constructor
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false,
    gSquareVertexBuffer: false, document: false, gEngine: false,
    Transform: false,*/
"use strict";
/**
* @constructor
* @param {shader} shader - OLD - Compiled shader from SimpleShader.js
* @classdesc mShader - refers to default constColorShader by default
*/
function Renderable (){
	this.mShader = gEngine.DefaultResources.getConstColorShader();
	/**
	* Transform operator for the Renderable
	*/
	this.mXform = new Transform(); 
	/**
	* Color for fragment shader
	*/
	this.mColor = [1, 1, 1, 1]; 
}
/**
* Get the canvas, activate the shader, load the transforms, and then draw on canvas
* @function
* @param {object} aCamera - a Camera object to be passed to the shader. The getVPMatrix() will be called there. //OLD: vpMatrix - View Projection Matrix
*/
Renderable.prototype.draw = function(aCamera){
	//gets the web context
	var gl = gEngine.Core.getGL();
	//activate the shader before you draw
	this.mShader.activateShader(this.mColor, aCamera);
	// vertices of the unit square are processed by the vertex shader
	// Get the transforms from the Renderable's Transform first
	this.mShader.loadObjectTransform(this.mXform.getXform());
	//(typeOfDrawing, offset, count)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0 , 4);
};

Renderable.prototype.getXform = function(){return this.mXform;};
Renderable.prototype.setColor = function(color){this.mColor = color;};
Renderable.prototype.getColor = function(){return this.mColor;};
Renderable.prototype._setShader = function(s){ this.mShader = s;};

/**
* Allows Renderables to swap their shaders, used in ShadowCaster and ShadowReceiver
* @function
* @param {shader} shader - The shader that will be swapped in. Returns the old shader.
*/
Renderable.prototype.swapShader = function (s) {
    var out = this.mShader;
    this.mShader = s;
    return out;
};

Renderable.prototype.update = function () {};


