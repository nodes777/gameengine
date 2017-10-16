/*
 * File: CameraShake.js
 * Supports camera shake effect.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, ShakePosition: false, InterpolateVec2: false, vec2: false, Interpolate: false, */

"use strict";

/**
* Shaking is in relation to the camera center position
* @constructor
* @param {number} state - Camera state gives the center of a camera.
* @param {number} xDelta - Severity of the shake in x direction
* @param {number} yDelta - Severity of the shake in the y direction
* @param {number} shakeDuration - How rapidly the camera shakes
* @param {number} shakeDuration - How long the shake lasts, number of cycles to complete the shake
*/
function CameraShake(state, xDelta, yDelta, shakeFrequency, shakeDuration){
	this.mOrgCenter = vec2.clone(state.getCenter());
	this.mShakeCenter = vec2.clone(this.mOrgCenter);
	this.mShake = new ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration);
}

/**
* Triggers the displacement computation for the shaking effect
* @func
*/
CameraShake.prototype.updateShakeState = function () {
    var s = this.mShake.getShakeResults();
	// The mShakeCenter is the sum of the original center and the shake results
    vec2.add(this.mShakeCenter, this.mOrgCenter, s);
};

CameraShake.prototype.shakeDone = function () {
    return this.mShake.shakeDone();
};

CameraShake.prototype.getCenter = function () { return this.mShakeCenter; };
CameraShake.prototype.setRefCenter = function (c) {
    this.mOrgCenter[0] = c[0];
    this.mOrgCenter[1] = c[1];
};

