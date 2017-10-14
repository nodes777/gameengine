/*
 * File: Camera_Manipulation.js
 * Provides camera manipulation functionality
 */

/*jslint node: true, vars: true */
/*global Camera: false, vec2: false, gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec3: false, BoundingBox: false, */

"use strict";

/**
* @func
* @param {number} dx - X direction to move camera by
* @param {number} dy - Y direction to move camera by
*/
Camera.prototype.panBy = function(dx, dy){
	this.mWCCenter[0] += dx;
	this.mWCCenter[1] += dy;
};
/**
* @func
* @param {number} cx - X position to move camera to
* @param {number} cy - Y position to move camera to
*/
Camera.prototype.panTo = function(cx, cy){
	this.mWCCenter[0] = cx;
	this.mWCCenter[1] = cy;
};
/**
* Keeps the camera on a transform, a Game Object or Renderable, by moving the WCCenter.
* The camera will not be changed if the aXform bounds are completely outside the tested WC bounds area
* @func
* @param {transform} aXform - a Game Object or Renderable
* @param {object} zone - The "walls" from the camera edges. Defines the relative size of WC that should be used in computation
*/
Camera.prototype.panWith = function(aXform, zone){
	 var status = this.collideWCBound(aXform, zone);
	 if (status !== BoundingBox.eboundCollideStatus.eInside){
	 	var pos = aXform.getPosition();
	 	var newC = this.getWCCenter();
	 	if ((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0){
			newC[1] = pos[1] + (aXform.getHeight() / 2) - (zone * this.getWCHeight() / 2);
	 	}
        if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0){
			newC[1] = pos[1] - (aXform.getHeight() / 2) + (zone * this.getWCHeight() / 2);
		}
        if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0){
			newC[0] = pos[0] + (aXform.getWidth() / 2) - (zone * this.getWCWidth() / 2);
		}
        if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0){
            newC[0] = pos[0] - (aXform.getWidth() / 2) + (zone * this.getWCWidth() / 2);
		}
	 }
};

/**
* If the zoom variable is greater than 1, the WC window size becomes larger.
* You will see more of the world and, thus, zoom out. Zoom < 1
* @func
* @param {number} zoom - Amount to zoom by, greater than 0
*/
Camera.prototype.zoomBy = function(zoom){
	if(zoom > 0){
		this.mWCWidth *= zoom;
	}
};

/**
* Zooms the camera towards a position
* @func
* @param {array} pos - Position to move camera to
* @param {number} zoom - Amount to zoom by
*/
Camera.prototype.zoomTowards = function (pos, zoom) {
	var delta = [];
    vec2.sub(delta, pos, this.mWCCenter);
    vec2.scale(delta, delta, zoom - 1);
    vec2.sub(this.mWCCenter, this.mWCCenter, delta);
    this.zoomBy(zoom);
};