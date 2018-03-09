/**
* GameObject - Class for common funcs in GameObjs
*/
/*jslint node: true, vars: true, evil: true*/
/*global gEngine: false, vec2: false, vec3: false, BoundingBox: false*/

"use strict";

/**
* @constructor
* @param {object} renderableObj - A renderable
* @classdesc GameObjects provide a better way to write code for rendered objects.
*/
function GameObject(renderableObj){
	this.mRenderComponent = renderableObj;
	this.mVisible = true;
	this.mCurrentFrontDir = vec2.fromValues(0,1);
	this.mSpeed = 0;
	this.mPhysicsComponent = null;
}

GameObject.prototype.getXform = function(){
	return this.mRenderComponent.getXform();
};

GameObject.prototype.update = function(){
	// simple default behavior, overwrite with subclass behavior
    var pos = this.getXform().getPosition();
	//Adds two vec2's after scaling the second operand by a scalar value
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
	if (this.mPhysicsComponent !== null) {
        this.mPhysicsComponent.update();
    }
};

GameObject.prototype.getRenderable = function(){ return this.mRenderComponent; };

GameObject.prototype.draw = function(aCamera){
    if (this.isVisible()) {
        this.mRenderComponent.draw(aCamera);
    }
    if (this.mPhysicsComponent !== null) {
        this.mPhysicsComponent.draw(aCamera);
    }
};
GameObject.prototype.setPhysicsComponent = function (p) { this.mPhysicsComponent = p; };
GameObject.prototype.getPhysicsComponent = function () { return this.mPhysicsComponent; };

GameObject.prototype.setVisibility = function (f) { this.mVisible = f; };
GameObject.prototype.isVisible = function () { return this.mVisible; };

GameObject.prototype.setSpeed = function (s) { this.mSpeed = s; };
GameObject.prototype.getSpeed = function () { return this.mSpeed; };
GameObject.prototype.incSpeedBy = function (delta) { this.mSpeed += delta; };

GameObject.prototype.setCurrentFrontDir = function (f) { vec2.normalize(this.mCurrentFrontDir, f); };
GameObject.prototype.getCurrentFrontDir = function () { return this.mCurrentFrontDir; };

GameObject.prototype.getRenderable = function () { return this.mRenderComponent; };

GameObject.prototype.rotateObjPointTo = function(p, rate){
	/* Determine destination position p */
	var dir = [];
	// determines dir via destination position and this object's position
	vec2.sub(dir, p, this.getXform().getPosition());
	// length is Math.sqrt(x*x + y*y)
	var len = vec2.length(dir);
    if (len < Number.MIN_VALUE)
        return; // we are there.
	// scale dir, as dir, by 1/len
    vec2.scale(dir, dir, 1 / len);

	/* Compute angle to rotate */
	var fdir = this.getCurrentFrontDir();
	var cosTheta = vec2.dot(dir, fdir);
	if (cosTheta > 0.999999) {
		return; // almost exactly the same direction
	}

	/* Clamp cosTheta to -1 to 1 */
    if(cosTheta>1){
		cosTheta = 1;
	} else{
		if(cosTheta < -1){
			cosTheta = -1;
		}
	}

	/* Compute whether to rotate clockwise, or counterclockwise */
	var dir3d = vec3.fromValues(dir[0], dir[1], 0);
	var f3d = vec3.fromValues(fdir[0], fdir[1], 0);

	var r3d = [];
	// recieving vector, operator1, operator2
	vec3.cross(r3d, f3d, dir3d);

	var rad = Math.acos(cosTheta);
	// if the z is negative the rotation is counterclockwise. Right hand rule
	if(r3d[2]<0){
		rad = -rad;
	}

	/* Rotate the facing direction with angle and rate */

	rad *= rate; //apply how quickly to rotate // actual angle need to rotate from Obj’s front
	// rotates current front direction
    vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), rad);
	// set the rotation in the Transform of the Renderable
	this.getXform().incRotationByRad(rad);
};

/**
* @func
* @desc Returns the unrotated Renderable object
*/
GameObject.prototype.getBBox = function() {
	var xform = this.getXform();
	var b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
	return b;
};