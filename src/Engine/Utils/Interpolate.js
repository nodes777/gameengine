/*
 * File: Interpolate.js
 * Provides functionality to interpolate values
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec3: false, BoundingBox: false, */

"use strict";

/**
* Class for interpolating values. During each update, the results are computed based on the rate.
* @constructor
* @param {number} value - Target for interpolation. Why is this both the current and final value?
* @param {number} cycles - Duration, how many cycles it should take for a value to change to final
* @param {number} rate - Stiffness of the change per update. The rate at which the value should change at each cycle
*/
function Interpolate(value, cycles, rate){
	this.mCurrentValue = value;
	this.mFinalValue = value;
	this.mCycles = cycles;
	this.mRate = rate;

	// If there is a new value to interpolate to, number of cycles left for interpolation
	this.mCyclesLeft = 0;
}

/**
* The current value is the currentValue plus the rate, times the difference between the final and current value.
* The subclass will overwrite this for non-scalar values.
* @func
*/
Interpolate.prototype._interpolateValue = function() {
	this.mCurrentValue = this.mCurrentValue + this.mRate * (this.mFinalValue - this.mCurrentValue);
};

Interpolate.prototype.getValue = function(){ return this.mCurrentValue;};

/**
* Change how interpolation occurs each update.
* @func
* @param {number} stiffness - Changes the rate the value is changed each cycle, between 0 and 1.
* @param {number} duration - Changes the number of cycles.
*/
Interpolate.prototype.configInterpolation = function(stiffness, duration){
	this.mRate = stiffness;
	this.mCycles = duration;
};

Interpolate.prototype.setFinalValue = function(v){
	this.mFinalValue = v;
	this.mCyclesLeft = this.mCycles;
};

/**
* If the cyclesLeft are less than 0, exit.
* Else, decrement the cyclesLeft, if its 0 set the currentValue to the finalValue
* Else, interpolate the value
* @func
*/
Interpolate.prototype.updateInterpolation = function(){
	if(this.mCyclesLeft <= 0){
		return;
	}
	this.mCyclesLeft--;

	if(this.mCyclesLeft === 0){
		this.mCurrentValue = this.mFinalValue;
	} else {
		this._interpolateValue();
	}
};