/*
 * File: Camera.js
 * Encapsulates the user define WC and Viewport functionality
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec3: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

/**
* @constructor
* @param {vec2} wcCenter - Center of the world coordinates
* @param {number} wcWidth -Width of the user defined WC. Height of the user defined WC is implicitly defined by the viewport aspect ratio
* @param {Object[]} viewportRect - an array of 4 elements
* @param {number} viewportRect[].x - x position of lower left corner on the canvas (in pixels)
* @param {number} viewportRect[].y - (x,y) position of lower left corner on the canvas (in pixels)
* @param {number} viewportRect[].width - width of viewport
* @param {number} viewportRect[].height - height of viewport
*/
function Camera(wcCenter, wcWidth, viewportArray) {
	/** World Coordinates and viewport position and size */
	this.mWCCenter = wcCenter;
	/** The height of the WC is always computed from the width.
	* This guarantees a matching aspect ratio between WC and viewport
	* wcHeight = wcWidth * viewport[3]/viewport[2]
	*/
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
Camera.prototype.getWCWidth = function(){
	return this.mWCWidth;
};
Camera.prototype.getWCHeight = function () {
	 // viewportH/viewportW
	return this.mWCWidth * this.mViewport[3] / this.mViewport[2];
};

Camera.prototype.setViewport = function(viewportArray) { this.mViewport = viewportArray; };
Camera.prototype.getViewport = function() { return this.mViewport;};

Camera.prototype.setBackgroundColor = function(newColor) { this.mBgColor = newColor; };
Camera.prototype.getBackgroundColor = function() { return this.mBgColor; };

Camera.prototype.getVPMatrix = function () {
    return this.mVPMatrix;
};

Camera.prototype.collideWCBound = function(aXform, zone){
	var bbox = new BoundingBox(aXform.getPosition(), aXform.getWidth(), aXform.getHeight());
	var w = zone * this.getWCWidth();
	var h = zone * this.getWCHeight();
	var cameraBound = new BoundingBox(this.getWCCenter, w, h);
	return cameraBound.boundCollideStatus(bbox);
};

// Configures webGL and sets up View-Proj Transform
Camera.prototype.setupViewProjection = function () {
	var gl = gEngine.Core.getGL();
	// Step A: configure viewport
	// Step A1: Set up the viewport: area on canvas to be drawn
	/**
	* Specifies the affine transformation of x and y from normalized device coordinates to window coordinates.
	* @function
	* @param {number} x
 	* @param {number} y
 	* @param {number} width
 	* @param {number} height
 	*/
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

	// Step B1:
	/**
	* Define the view matrix, a given func from webGL lib
	* @function lookAt
	* @param {object} viewMatrix - assign the properties to this viewMatrix
 	* @param {array} eye - World Coord center, position of the viewer
 	* @param {number} center - Look At Position, point the viewer is looking at
 	* @param {number} up - Orientation, vec3 pointing up
 	*/
	mat4.lookAt(this.mViewMatrix,
		[this.mWCCenter[0], this.mWCCenter[1], 10], // WC center
		[this.mWCCenter[0], this.mWCCenter[1], 0], // look at position?
		[0,1,0]); // orientation

	// Step B2: define the projection matrix
	var halfWCWidth = 0.5 * this.mWCWidth;
	// WCHeight = WCWidth * viewportHeight / viewportWidth, why????
	var halfWCHeight = halfWCWidth * this.mViewport[3]/this.mViewport[2];

	/**
	* Generates a orthogonal projection matrix with the given bounds, a given func from webGL lib
	* @function ortho
	* @param {mat4} defines the dimesion of the WC, out mat4 frustum matrix will be written into
	* @param {number} distant to left of WC, left Left bound of the frustum
	* @param {number} distant to right of WC, right Right bound of the frustum
	* @param {number} distant to bottom of WC, bottom Bottom bound of the frustum
	* @param {number} distant to top of WC, top Top bound of the frustum
	* @param {number} z-distant to near plane, near Near bound of the frustum
	* @param {number} z-distant to far plane, far Far bound of the frustum
	* @returns {mat4} out
 	*/
	mat4.ortho(this.mProjMatrix, //defines the dimesion of the WC
		-halfWCWidth,      // distant to left of WC
         halfWCWidth,      // distant to right of WC
        -halfWCHeight,     // distant to bottom of WC
         halfWCHeight,     // distant to top of WC
         this.mNearPlane,  // z-distant to near plane
         this.mFarPlane    // z-distant to far plane
	);
	/**
	* Applies the matrix transforms
	* @function multiply
	* @param {mat4} view projection matrix
	* @param {mat4} projection matrix
	* @param {mat4} view matrix
	*/
	mat4.multiply(this.mVPMatrix, this.mProjMatrix, this.mViewMatrix);
};