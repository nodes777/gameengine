/*
 * File: RigidRectangle.js
 * Defines a rigid Rectangle
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, RigidShape, vec2, LineRenderable */
"use strict";

/**
* Rigid Rectangle physics object. Subclass of RigidShape
* @constructor
* @param {xform} xform
* @param {num} w - width
* @param {num} h - height
*/
function RigidRectangle (xform, w, h){
	RigidShape.call(this, xform);
	this.mSides = new LineRenderable();

	this.mWidth = w;
	this.mHeight = h;
}

gEngine.inheritPrototype(RigidRectangle, RigidShape);

RigidRectangle.prototype.draw.call = function(aCamera){
	if(!this.mDrawBounds){
		return
	}

	RigidShape.prototype.draw.call(this, aCamera);

	var x = this.getPosition()[0];
    var y = this.getPosition()[1];
    var w = this.mWidth/2;
    var h = this.mHeight/2;

	this.mSides.setFirstVertex(x - w, y + h);   //TOP LEFT
    this.mSides.setSecondVertex(x + w, y + h);  //TOP RIGHT
    this.mSides.draw(aCamera);
    this.mSides.setFirstVertex(x + w, y - h);   //BOTTOM RIGHT
    this.mSides.draw(aCamera);
    this.mSides.setSecondVertex(x - w, y - h);  //BOTTOM LEFT
    this.mSides.draw(aCamera);
    this.mSides.setFirstVertex(x - w, y + h);   //TOP LEFT
    this.mSides.draw(aCamera);
}

RigidRectangle.prototype.rigidType = function () {
    return RigidShape.eRigidType.eRigidRectangle;
};
RigidRectangle.prototype.getWidth = function () { return this.mWidth; };
RigidRectangle.prototype.getHeight = function () { return this.mHeight; };
RigidRectangle.prototype.setColor = function (color) {
    RigidShape.prototype.setColor.call(this, color);
    this.mSides.setColor(color);
};