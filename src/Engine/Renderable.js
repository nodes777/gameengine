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
* @param {shader} shader - Compiled shader from SimpleShader.js
* @classdesc This is a description of the Renderable class.
*/
function Renderable (shader){
	this.mShader = shader;
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
* @param {mat4} vpMatrix - View Projection Matrix
*/
Renderable.prototype.draw = function(vpMatrix){
	//gets the web context
	var gl = gEngine.Core.getGL();
	//activate the shader before you draw
	this.mShader.activateShader(this.mColor, vpMatrix);
	// vertices of the unit square are processed by the vertex shader
	// Get the transforms from the Renderable's Transform first
	this.mShader.loadObjectTransform(this.mXform.getXform());
	//(typeOfDrawing, offset, count)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0 , 4);
};

Renderable.prototype.getXform = function(){return this.mXform;};
Renderable.prototype.setColor = function(color){this.mColor = color;};
Renderable.prototype.getColor = function(){return this.mColor;};

