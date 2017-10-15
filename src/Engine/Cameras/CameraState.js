/*
 * File: CameraState.js
 * Supports gradual changes in the camera.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, InterpolateVec2: false, vec2: false, Interpolate: false, */

"use strict";

/**
* Class for state of the camera. mCenter and mWidth are both InterpolateVec2 objects, a subclass of Interpolate.
* @constructor
* @param {vec2} center - Center to support panning.
* @param {number} width - Width to support zooming.
*/
function CameraState(center, width) {
    this.kCycles = 300;  // number of cycles to complete the transition
    this.kRate = 0.1;    // rate of change for each cycle
    this.mCenter = new InterpolateVec2(center, this.kCycles, this.kRate);
    this.mWidth = new Interpolate(width, this.kCycles, this.kRate);
}

CameraState.prototype.getCenter = function(){ return this.mCenter.getValue();};
CameraState.prototype.getWidth = function (){ return this.mWidth.getValue(); };

CameraState.prototype.setCenter = function (c){ this.mCenter.setFinalValue(c); };
CameraState.prototype.setWidth = function (w){ this.mWidth.setFinalValue(w); };

CameraState.prototype.updateCameraState = function(){
	this.mCenter.updateInterpolation();
	this.mWidth.updateInterpolation();
};

CameraState.prototype.configInterpolation = function (stiffness, duration) {
    this.mCenter.configInterpolation(stiffness, duration);
    this.mWidth.configInterpolation(stiffness, duration);
};