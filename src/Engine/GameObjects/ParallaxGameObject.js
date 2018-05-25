/* File: ParallexGameObject.js 
 *
 * Represent an GameObject located at some distance D away, thus 
 * resulting in slower movements
 * 
 * Passed in scale: 
 *     ==1: means same as actors
 *     > 1: farther away, slows down inversely (scale==2 slows down twice)
 *     < 1: closer, speeds up inversely (scale==0.5 speeds up twice)
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, TiledGameObject, vec2  */

"use strict"; 

/**
* Creates a parallax scrolleable gameobject, based on the position of one camera
* @param {object} renderableObj - The texture renderable that is being parallaxed
* @param {int} scale - Positive integer value. Numbers greater than 1 represent objects that are farther away from the default distance	
* @param {object} aCamera - Camera object
*/
function ParallaxGameObject(renderableObj, scale, aCamera){
	this.mRefCamera = aCamera;
	this.mCameraWCCenterRef = vec2.clone(this.mRefCamera.getWCCenter());
	this.mParallaxScale = 1;
	this.setParallaxScale(scale);
	TiledGameObject.call(this, renderableObj);
}
gEngine.Core.inheritPrototype(ParallaxGameObject, TiledGameObject);

ParallaxGameObject.prototype.getParallaxScale = function () {
    return this.mParallaxScale;
};

ParallaxGameObject.prototype.setParallaxScale = function(s) {
    if (s <= 0) {
        this.mParallaxScale = 1;
    } else {
        this.mParallaxScale = 1/s;
    }
};

ParallaxGameObject.prototype.update = function() {
	this._refPosUpdate(); // check to see if the camera has moved
	var pos = this.getXform().getPosition(); // self xform
	vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed() * this.mParallaxScale)// move the parallax object
};

/**
* Computes relative displacement based on the ref camera's WC center position.
* vec2.scaleAndAdd() in update() moves the current object at a speed scaled by the mParallaxScale
* @func
*/
ParallaxGameObject.prototype._refPosUpdate = function() {
	// now check for reference movement
	var deltaT = vec2.fromValues(0, 0);
	vec2.sub(deltaT, this.mCameraWCCenterRef, this.mRefCamera.getWCCenter());
	// translate the object
	this.setWCTranslationBy(deltaT);
	// update the WC Center ref position
	vec2.sub(this.mCameraWCCenterRef, this.mCameraWCCenterRef, deltaT)
};

ParallaxGameObject.prototype.setWCTranslationBy = function (delta) {
    var f = (1-this.mParallaxScale);
    this.getXform().incXPosBy(-delta[0] * f);
    this.getXform().incYPosBy(-delta[1] * f);
};