/*
 * File: Camera_Input.js
 * Defines the functions that supports mouse input coordinate transforms
 */

/*jslint node: true, vars: true, bitwise: true */
/*global gEngine, Camera, BoundingBox, vec2, CameraShake */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

/*
* Transforms mouse positions from canvas coordinates to device coordinate space.
* this.mViewport[Camera.eViewport.eOrgX] -> this.mViewport[0] -> the x coord of where the viewport starts
* @func
*/
Camera.prototype._mouseDCX = function(){				// Camera.eViewport.eOrgX = 0
	return gEngine.Input.getMousePosX() - this.mViewport[Camera.eViewport.eOrgX];
};

Camera.prototype._mouseDCY = function() {				// Camera.eViewport.eOrgY = 1
	return gEngine.Input.getMousePosY() - this.mViewport[Camera.eViewport.eOrgY];
};

/*
* Checks if mouse is within viewport
* @func
* @returns boolean
*/
Camera.prototype.isMouseInViewport = function(){
	var dcX = this._mouseDCX();
	var dcY = this._mouseDCY();
	return ((dcX >= 0) && (dcX < this.mViewport[Camera.eViewport.eWidth]) &&
            (dcY >= 0) && (dcY < this.mViewport[Camera.eViewport.eHeight]));
};

/*
* Returns the mouse X position in world coordinates.
* @func
* @returns number
*/
Camera.prototype.mouseWCX = function(){
	var minWCX = this.getWCCenter()[0] - this.getWCWidth() / 2;
	return minWCX + (this._mouseDCX() * (this.getWCWidth() / this.mViewport[Camera.eViewport.eWidth]));
};

Camera.prototype.mouseWCY = function(){
	var minWCY = this.getWCCenter()[1] - this.getWCHeight() / 2;
	return minWCY + (this._mouseDCY() * (this.getWCHeight()/ this.mViewport[Camera.eViewport.eHeight]));
};