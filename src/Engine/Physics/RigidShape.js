/*
 * File: RigidShape.js
 * Defines a simple rigid shape
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, LineRenderable */

"use strict";

RigidShape.eRigidType = Object.freeze({
	eRigidAbstract: 0,
	eRigidCircle: 1,
	eRigidRectange: 2
});

/**
* Adds physics rigidbody to the transform,
* @constructor
* @param {xform} xform - Transform to have a rigidbody, typically from a game object
*/
function RigidShape(xform){
	this.mXform = xform;
	this.kPadding = 0.25; // size of position mark
	this.mPositionMark = new LineRenderable();
	this.mDrawBounds = false; // defines whether the bounds should be drawn

	// Physics properties
	this.mInvMass = 1; //mass?
	this.mRestitution = 0.8; //Bounciness
	this.mVelocity = vec2.fromValues(0,0);
	this.mFriction = 0.3;
	this.mAcceleration = gEngine.Physics.getSystemAcceleration();
}

RigidShape.prototype.draw = function (aCamera){
	if(!this.mDrawBounds){
		return;
	}

	// calculation for the X at center of shape
	var x = this.mXform.getXPos();
	var y = this.mXform.getYPos();

	this.mPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
    this.mPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT
    this.mPositionMark.draw(aCamera);

    this.mPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);  //TOP RIGHT
    this.mPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding); //BOTTOM LEFT
    this.mPositionMark.draw(aCamera);
}

RigidShape.prototype.update = function () {};

RigidShape.prototype.getPosition = function() {
    return this.mXform.getPosition();
};

RigidShape.prototype.setPosition = function(x, y ) {
    this.mXform.setPosition(x, y);
};
RigidShape.prototype.getXform = function () { return this.mXform; };
RigidShape.prototype.setXform = function (xform) { this.mXform = xform; };
RigidShape.prototype.setColor = function (color) {
    this.mPositionMark.setColor(color);
};
RigidShape.prototype.getColor = function () { return this.mPositionMark1.getColor(); };
RigidShape.prototype.setDrawBounds = function(d) { this.mDrawBounds = d; };
RigidShape.prototype.getDrawBounds = function() { return this.mDrawBounds; };