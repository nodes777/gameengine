/*
 * File: InterpolateVec2.js
 * Provides functionality to interpolate vec2 values, as many camera params are vec2
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec2: false, Interpolate: false, */

"use strict";

/**
* Class for interpolating vec2 values. Calls Interpolate.js
* @constructor
* @param {number} value - Target for interpolation. Why is this both the current and final value?
* @param {number} cycles - Duration, how many cycles it should take for a value to change to final
* @param {number} rate - Stiffness of the change per update. The rate at which the value should change at each cycle
*/
function InterpolateVec2(value, cycle, rate) {
	Interpolate.call(this, value, cycle, rate);
}
gEngine.Core.inheritPrototype(InterpolateVec2, Interpolate);

/**
* Computes for each of the x and y components of vec2 with identical calculations as the _interpolateValue() function in the Interpolate object
* @func
*/
InterpolateVec2.prototype._interpolateValue = function() {
	vec2.lerp(this.mCurrentValue, this.mCurrentValue, this.mFinalValue, this.mRate);
};