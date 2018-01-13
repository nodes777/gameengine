/*
 * File: Camera.js
 * Encapsulates the user define WC and Viewport functionality
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec3: false, BoundingBox: false, CameraState:false, vec2:false*/

"use strict";

/**
* By default the bound is empty and the camera draws the entire viewport.
* @constructor
* @param {vec2} wcCenter - Center of the world coordinates
* @param {number} wcWidth -Width of the user defined WC. Height of the user defined WC is implicitly defined by the viewport aspect ratio.  wcHeight = wcWidth * viewport[3]/viewport[2]
* @param {Object[]} viewportRect - An array of 4 elements [x,y,width,height]
* @param{number} bound - Number of pixels surrounding the viewport of the camera left as the background color. A border basically.
*/
function Camera(wcCenter, wcWidth, viewportArray, bound) {
	this.mCameraState = new CameraState(wcCenter, wcWidth);

	this.mCameraShake = null;

	this.mViewport = []; // x,y,width,height
	this.mViewportBound = 0;
	if(bound !== undefined){
		this.mViewportBound = bound;
	}

	this.mScissorBound = [];
	this.setViewport(viewportArray, this.mViewportBound);

	this.mNearPlane = 0;
	this.mFarPlane = 1000;
	this.kCameraZ = 10; // for illumination computation

	// Transformation matrices
	this.mViewMatrix = mat4.create();
	this.mProjMatrix = mat4.create();
	this.mVPMatrix = mat4.create();

	// Background color
	this.mBgColor = [0.8,0.8,0.8,1];

	// per-rendering cached information
    this.mRenderCache = new PerRenderCache();
}

Camera.eViewport = Object.freeze({
    eOrgX: 0,
    eOrgY: 1,
    eWidth: 2,
    eHeight: 3
});

Camera.prototype.setWCCenter = function (xPos, yPos) {
    var p = vec2.fromValues(xPos, yPos);
    this.mCameraState.setCenter(p);
};
// Getters and Setters for instance vars
Camera.prototype.getWCCenter = function () { return this.mCameraState.getCenter(); };
Camera.prototype.setWCWidth = function (width) { this.mCameraState.setWidth(width); };
Camera.prototype.getWCWidth = function () { return this.mCameraState.getWidth(); };
Camera.prototype.getWCHeight = function () { return this.mCameraState.getWidth() * this.mViewport[Camera.eViewport.eHeight] / this.mViewport[Camera.eViewport.eWidth]; };


Camera.prototype.setViewport = function(viewportArray, bound) { 
	if(bound === undefined){
		bound = this.mViewportBound;
	}
	// [x, y, width, height]
    this.mViewport[0] = viewportArray[0] + bound;
    this.mViewport[1] = viewportArray[1] + bound;
    this.mViewport[2] = viewportArray[2] - (2 * bound);
	this.mViewport[3] = viewportArray[3] - (2 * bound);
	this.mScissorBound[0] = viewportArray[0];
    this.mScissorBound[1] = viewportArray[1];
    this.mScissorBound[2] = viewportArray[2];
    this.mScissorBound[3] = viewportArray[3];
};

/**
* Returns the actual bounds reserved for this camera. Includes the scissor bounds.
* @func
*/
Camera.prototype.getViewport = function() { 
	var out = [];
    out[0] = this.mScissorBound[0];
    out[1] = this.mScissorBound[1];
    out[2] = this.mScissorBound[2];
    out[3] = this.mScissorBound[3];
    return out;
};

Camera.prototype.setBackgroundColor = function(newColor) { this.mBgColor = newColor; };
Camera.prototype.getBackgroundColor = function() { return this.mBgColor; };

Camera.prototype.getVPMatrix = function () {
    return this.mVPMatrix;
};

/**
* @func
* @param {object} aXform - A transform
* @param {object} zone - The "walls" from the camera edges. Defines the relative size of WC that should be used in the collision computation
* @returns {boolean} returns the status of a given transform colliding with the camera edge, as adjusted by a zone.
*/
Camera.prototype.collideWCBound = function(aXform, zone){
	var bbox = new BoundingBox(aXform.getPosition(), aXform.getWidth(), aXform.getHeight());
	var w = zone * this.getWCWidth();
	var h = zone * this.getWCHeight();
	var cameraBound = new BoundingBox(this.getWCCenter(), w, h);
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
	gl.scissor(this.mScissorBound[0], this.mScissorBound[1], this.mScissorBound[2], this.mScissorBound[3]);
	// Step A3: set the color to be cleared to black
	gl.clearColor(this.mBgColor[0], this.mBgColor[1], this.mBgColor[2], this.mBgColor[3]);
	// Step A4: enable and clear the scissor area
	gl.enable(gl.SCISSOR_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.disable(gl.SCISSOR_TEST);

	// Step B: define the View-Projection matrix

	// Step B1:
	var center = [];
	if(this.mCameraShake !== null){
		center = this.mCameraShake.getCenter();
	} else {
		center = this.getWCCenter();
	}
	/**
	* Define the view matrix, a given func from webGL lib
	* @function lookAt
	* @param {object} viewMatrix - assign the properties to this viewMatrix
 	* @param {array} eye - World Coord center, position of the viewer
 	* @param {number} center - Look At Position, point the viewer is looking at
 	* @param {number} up - Orientation, vec3 pointing up
 	*/
    mat4.lookAt(this.mViewMatrix,
        [center[0], center[1], this.kCameraZ],   // WC center
        [center[0], center[1], 0],    //
        [0, 1, 0]);     // orientation


	// Step B2: define the projection matrix
	var halfWCWidth = 0.5 * this.getWCWidth();
	var halfWCHeight = 0.5 * this.getWCHeight();

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

	// Step B4: compute and cache per-rendering information
	this.mRenderCache.mWCToPixelRatio = this.mViewport[Camera.eViewport.eWidth] / this.getWCWidth();
	this.mRenderCache.mCameraOrgX = center[0] - (this.getWCWidth()/2);
	this.mRenderCache.mCameraOrgY = center[1] - (this.getWCHeight()/2);

	var p = this.wcPosToPixel(this.getWCCenter());
	this.mRenderCache.mCameraPosInPixelSpace[0] = p[0];
	this.mRenderCache.mCameraPosInPixelSpace[1] = p[1];
	this.mRenderCache.mCameraPosInPixelSpace[2] = this.fakeZInPixelSpace(this.kCameraZ);
};

Camera.prototype.getPosInPixelSpace = function(){ return this.mRenderCache.mCameraPosInPixelSpace;};

/**
* Ensure that the bounds of a transform, from a renderable or Game Object, stay within WC bounds.
* The camera will not be changed if the aXform bounds are completely outside the tested WC bounds area
* @func
* @param {object} aXform - A transform
* @param {object} zone - The "walls" from the camera edges. Defines the relative size of WC that should be used in the collision computation
* @returns {boolean} returns the status of a given transform colliding with the camera edge, as adjusted by a zone.
*/
Camera.prototype.clampAtBoundary = function (aXform, zone){
	var status = this.collideWCBound(aXform, zone);
	if( status !== BoundingBox.eboundCollideStatus.eInside){
		var pos = aXform.getPosition();
		if((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0){
			pos[1] = (this.getWCCenter())[1] + (zone* this.getWCHeight()/2) - aXform.getHeight()/2;
		}
		if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0){
			pos[1] = (this.getWCCenter())[1] - (zone * this.getWCHeight() / 2) + (aXform.getHeight() / 2);
		}
		if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0){
			pos[0] = (this.getWCCenter())[0] + (zone * this.getWCWidth() / 2) - (aXform.getWidth() / 2);
		}
        if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0){
			pos[0] = (this.getWCCenter())[0] - (zone * this.getWCWidth() / 2) + (aXform.getWidth() / 2);
		}
	}
	return status;
};
/**
* Since Camera funcs are implemented multiple times while rendering the LightShader object, some values do not need to be recomputed. Efficient.
* This should be used for rendering purposes only. No functionality. These values don't change once a rendering begins. Used in Xform operations.
* Needed for computing transforms for shaders. Updated each time in setupViewProjection()
* @class
*/
function PerRenderCache(){
	this.mWCToPixelRatio = 1; //WC to Pixel transform
	this.mCameraOrgX = 1; //Lower left in WC
	this.mCameraOrgY = 1;
	this.mCameraPosInPixelSpace = vec3.fromValues(0, 0, 0);
}