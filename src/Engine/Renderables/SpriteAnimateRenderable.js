/*
* SpriteAnimateRenderable Class
*/
/*jslint node: true, vars: true, evil: true*/
/*global SimpleShader: false, Renderable: false, SpriteRenderable: false, gEngine: false
*
*/
"use strict";
/**
* Assumption: first sprite in an animation is always the left-most element.
* Animations are always organized along the same row.
* @namespace
* @property {number}  eAnimateRight - Animate from left to right, then restart to left
* @property {number}  eAnimateLeft - Animate from right to left, then restart to right
* @property {number}  eAnimateSwing - Animate left to right then animate backwards
*/
SpriteAnimateRenderable.eAnimationType = Object.freeze({
	eAnimateRight: 0, // Animate from left to right, then restart to left
	eAnimateLeft: 1, // Animate from right to left, then restart to right
	eAnimateSwing: 2 // Animate left to right then animate backwards
});

/**
* Derived from SpriteRenderable, specifies animation of a sprite. All coordinates are in texture coordinate (UV between 0 to 1)
* @class
* @param {texture} myTexture - Path to sprite sheet
*/
function SpriteAnimateRenderable(myTexture){
	SpriteRenderable.call(this, myTexture);
	Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getSpriteShader());

	// Info on the sprite element:
	/** Left corner of the image*/
	this.mFirstElmLeft = 0.0;
	/** Top corner of the image*/
	this.mElmTop = 1.0;
	/** Default sprite element size is the entire image*/
	this.mElmWidth = 1.0;
	this.mElmHeight = 1.0;
	this.mWidthPadding = 0.0;
	/** Number of elements in an animation*/
	this.mNumsElems = 1;

	this.mAnimationType = SpriteAnimateRenderable.eAnimationType.eAnimateRight;
	/** How often to advance */
	this.mUpdateInterval = 1;

	/** Current animation state */
    this.mCurrentAnimAdvance = -1;
    this.mCurrentElm = 0;

    this._initAnimation();
}

gEngine.Core.inheritPrototype(SpriteAnimateRenderable, SpriteRenderable);