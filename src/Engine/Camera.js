/*
 * File: Camera.js
 * Encapsulates the user define WC and Viewport functionality
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec3: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

/* wcCenter: is a vec2
// wcWidth: is the width of the user defined WC
//      Height of the user defined WC is implicitly defined by the viewport aspect ratio
//      Please refer to the following
// viewportRect: an array of 4 elements
//      [0] [1]: (x,y) position of lower left corner on the canvas (in pixel)
//      [2]: width of viewport
//      [3]: height of viewport
//
//  wcHeight = wcWidth * viewport[3]/viewport[2]
*/
function Camera(wcCenter, wcWidth, viewportArray) {
	// WC and viewport position and size
	this.mWCCenter = wcCenter;
	// the height of the WC is always computed from the width
	// this guarantees a matching aspect ratio between WC and viewport
	this.mWCWidth = wcWidth;
	// [x,y,width,height]
	// x and y are of lower left corner
	this.mViewport = viewportArray;
	this.mNearPlane = 0;
	this.mFarPlane = 1000;

	// Transformation matrices
	this.mViewMatrix = mat4.create();
	this.mProjMatrix = mat4.create();
	this.mVPMatrix = mat4.create();

	// Background color
	this.mBgColor = [0.8,0.8,0.8,1];
}

// Getters and Setters for instance vars
Camera.prototype.setWCCenter = function(xPos,yPos){
	this.mWCCenter[0] = xPos;
	this.mWCCenter[1] = yPos;
};

Camera.prototype.getWCCenter = function(){
	return this.mWCCenter;
};

Camera.prototype.setViewport = function(viewportArray) { this.mViewport = viewportArray; };
Camera.prototype.getViewport = function() { return this.mViewport;};

Camera.prototype.setBackgroundColor = function(newColor) { this.mBgColor = newColor; };
Camera.prototype.getBackgroundColor = function() { return this.mBgColor; };

Camera.prototype.getVPMatrix = function() { return this.mVPMatrix; };

// Configures webGL and sets up View-Proj Transform
Camera.prototype.setupViewProjection = function () {
	var gl = gEngine.Core.getGL();
	// Step A: configure viewport
	// Step A1: Set up the viewport: area on canvas to be drawn
	// viewport(x,y,width,height)
	gl.viewport(this.mViewport[0], this.mViewport[1], this.mViewport[2], this.mViewport[3]);
	// Step A2: set up the corresponding scissor area to limit clear area
	gl.scissor(this.mViewport[0], this.mViewport[1], this.mViewport[2], this.mViewport[3]);
	// Step A3: set the color to be cleared to black
	gl.clearColor(this.mBgColor[0], this.mBgColor[1], this.mBgColor[2], this.mBgColor[3]);
	// Step A4: enable and clear the scissor area
	gl.enable(gl.SCISSOR_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.disable(gl.SCISSOR_TEST);

	// Step B: define the View-Projection matrix

	// Step B1: define the view matrix
	mat4.lookAt(this.mViewMatrix,
		[this.mWCCenter[0], this.mWCCenter[1], 10], // WC center
		[this.mWCCenter[0], this.mWCCenter[1], 0], // look at position?
		[0,1,0]); // orientation

	// Step B2: define the projection matrix
	var halfWCWidth = 0.5 * this.mWCWidth;
	// WCHeight = WCWidth * viewportHeight / viewportWidth, why????
	var halfWCHeight = halfWCWidth * this.mViewport[3]/this.mViewport[2];
	mat4.ortho(this.mProjMatrix, //defines the dimesion of the WC
		-halfWCWidth,      // distant to left of WC
         halfWCWidth,      // distant to right of WC
        -halfWCHeight,     // distant to bottom of WC
         halfWCHeight,     // distant to top of WC
         this.mNearPlane,  // z-distant to near plane
         this.mFarPlane    // z-distant to far plane);)
	);

	mat4.multiply(this.mVPMatrix, this.mProjMatrix, this.mViewMatrix);
};