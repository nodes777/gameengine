/*
 * File: Particle.js
 * Defines a particle
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, LineRenderable */

"use strict";

/**
*
* @param {vec2} pos - likely to be a reference to xform.mPosition
* @class
*/
function Particle(pos){
	this.kPadding = 0.5;   // for drawing particle bounds

    this.mPosition = pos;  
    this.mVelocity = vec2.fromValues(0, 0);
    this.mAcceleration = gEngine.Particle.getSystemAcceleration();
    this.mDrag = 0.95;

    this.mPositionMark = new LineRenderable();
    this.mDrawBounds = false;
}

Particle.prototype.draw = function(aCamera){
	if(!this.mDrawBounds){
		return;
	}

	// calculation for the X at the particle position
	var x = this.mPosition[0];
	var y = this.mPosition[1];

	this.mPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
    this.mPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT

    this.mPositionMark.draw(aCamera);
    this.mPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);//TOP RIGHT
    this.mPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding);//BOTTOM LEFT
    this.mPositionMark.draw(aCamera);
}

Particle.prototype.update = function(){
	var dt = gEngine.GameLoop.getUpdateIntervalInSeconds();
	// Symplectic Euler
    //    v += a * dt
    //    x += v * dt
    var p = this.getPosition();
    vec2.scaleAndAdd(this.mVelocity, this.mVelocity, this.mAcceleration, dt);
    vec2.scale(this.mVelocity, this.mVelocity, this.mDrag);
    vec2.scaleAndAdd(p, p, this.mVelocity, dt);
}