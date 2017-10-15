/*
 * File: BoundingBox.js
 * Provides Axis Aligned Bounding Boxes
 */
/*jslint node: true, vars: true,  */
/*global gEngine: false, window: false, vec2: false */

"use strict";

/**
* @constructor
* @param {array} centerPos - Center of bounding box, length of 2.
* @param {number} w - Width of bounding box.
* @param {number} h - Height of bounding box.
*/
function BoundingBox(centerPos, w, h) {
	this.mLL = vec2.fromValues(0,0); // Lower left corner
	this.setBounds(centerPos, w, h);
}

BoundingBox.prototype.setBounds = function(centerPos, w, h){
	this.mWidth = w;
	this.mHeight = h;
	this.mLL[0] = centerPos[0] - (w/2);
	this.mLL[1] = centerPos[1] - (h/2);
};

/**
*	@enum eboundCollideStatus- Enumerated data type with values that identify the collision sides of a bounding box
*	@desc Each has only one non-zero bit. This allows enumerated values to be combined with the bitwise-or operator to represent a multisided collision.
* 	For example: if an object collides with both the top and left sides of a bounding box, the collision status will be eCollideLeft | eCollideTop = 4 | 1 = 5.
*/
BoundingBox.eboundCollideStatus = Object.freeze({
    eCollideLeft: 1,
    eCollideRight: 2,
    eCollideTop: 4,
    eCollideBottom: 8,
    eInside : 16,
    eOutside: 0
});

/**
* @function	Determines if the point given is inside the bounding box.
* @param {number} x - The point to compare to.
* @returns {boolean}
*/
BoundingBox.prototype.containsPoint = function (x, y) {
	return ((x > this.minX()) && (x<this.maxX()) && (y > this.minY()) && (y < this.maxY()));
};

/**
* @function	Determines if the other bounding box overlaps this one.
* @param {obj} otherBound - The other bounding box to compare to.
* @returns {boolean}
*/
BoundingBox.prototype.intersectsBound = function(otherBound){
	return ((this.minX() < otherBound.maxX()) &&
			(this.maxX() > otherBound.minX()) &&
			(this.minY() < otherBound.maxY()) &&
			(this.maxY() > otherBound.minY()));
};

/**
* @function Determines what sides the other bound box is overlapping on. Uses bitwise OR operator to evaluate status
* @param {obj} otherBound - The other bounding box to compare to.
* @returns {status} enum
*/
BoundingBox.prototype.boundCollideStatus = function(otherBound){
	var status = BoundingBox.eboundCollideStatus.eOutside;
	if (this.intersectsBound(otherBound)){
		if(otherBound.minX() < this.minX()){
			// Bitwise Or assignment
			status |= BoundingBox.eboundCollideStatus.eCollideLeft; // status = status or left
		}
		if (otherBound.maxX() > this.maxX())
            status |= BoundingBox.eboundCollideStatus.eCollideRight;
        if (otherBound.minY() < this.minY())
            status |= BoundingBox.eboundCollideStatus.eCollideBottom;
        if (otherBound.maxY() > this.maxY())
            status |= BoundingBox.eboundCollideStatus.eCollideTop;
        // if the bounds intersects and yet none of the sides overlaps
        // otherBound is completely inside thisBound
        if (status === BoundingBox.eboundCollideStatus.eOutside)
            status = BoundingBox.eboundCollideStatus.eInside;
	}
	return status;
};

BoundingBox.prototype.minX = function () { return this.mLL[0]; };
BoundingBox.prototype.maxX = function () { return this.mLL[0] + this.mWidth; };
BoundingBox.prototype.minY = function () { return this.mLL[1]; };
BoundingBox.prototype.maxY = function () { return this.mLL[1] + this.mHeight;};