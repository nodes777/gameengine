/*
 * File: ShakePosition.js
 * Abstracts shaking of positions
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec3: false, BoundingBox: false, */

"use strict";

/**
* Shaking is in relation to the camera center position
* @constructor
* @param {number} xDelta - Severity of the shake in x direction
* @param {number} yDelta - Severity of the shake in the y direction
* @param {number} shakeFrequency - How rapidly the camera shakes
* @param {number} shakeDuration - How long the shake lasts, number of cycles to complete the shake
*/
function ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration){
	this.mXMag = xDelta;
	this.mYMag = yDelta;
	this.mCycles = shakeDuration;
	this.mOmega = shakeFrequency * 2 * Math.PI; // converts to radians
	this.mNumCyclesLeft = shakeDuration;
}

/**
* The frac variable is a ratio of the number of cycles left in the shake (mNumCyclesLeft) to the total number of cycles the camera should shake (mCycles). 
* This value decreases from 1 to 0 as mNumCyclesLeft decreases from mCycles to 0.
* @func
*/
ShakePosition.prototype._nextDampedHarmonic = function() {
	var frac = this.mNumCyclesLeft / this.mCycles;
	return frac * frac * Math.cos((1-frac) * this.mOmega);
};

ShakePosition.prototype.shakeDone = function() {
	return (this.mNumCyclesLeft <= 0);
};

/**
* For the same mNumCyclesLeft, the call to the _nextDampedHarmonic() will return the same value.
* @func
*/
ShakePosition.prototype.getShakeResults = function(){
	this.mNumCyclesLeft--;
	var c = [];
	var fx = 0;
	var fy = 0;
	if(!this.shakeDone()){
		var v = this._nextDampedHarmonic();
		fx = (Math.random() > 0.5) ? -v : v;
		fy = (Math.random() > 0.5) ? -v : v;
	}
	c[0] = this.mXMag * fx;
	c[1] = this.mYMag * fy;
	return c;
};