/*
* SpriteAnimateRenderable Class
*/
/*jslint node: true, vars: true, evil: true*/
/*global SimpleShader: false, Renderable: false, SpriteRenderable: false, gEngine: false
*
*/
"use strict";
/**
* Derived from SpriteRenderable, specifies animation of a sprite. All coordinates are in texture coordinate (UV between 0 to 1).
* The first set, including mFirstElmLeft, mElmTop, and so on, defines the location and dimensions of each sprite element and the number of elements in the animation. This information can be used to accurately compute the texture coordinates for each sprite element when the elements are ordered by rows and columns. Note that all coordinates are in Texture Space (0 to 1).
* The second set stores information on how to animate: the mAnimationType of left, right, or swing; and how many mUpdateInterval time to wait before advancing to the next sprite element to control the speed of the animation. This information can be changed during runtime to reverse a character’s movement, loop the character’s movement, or speed up or slow down the movement.
* The third set, mCurrentAnimAdvance and mCurrentElm, describes the current animation state, which frame, and the direction of the animation. Both of these variables are in units of element counts, are not accessible by the game programmer, and are used internally to compute the next sprite element for display.
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

SpriteAnimateRenderable.prototype.setAnimationType = function(animationType){
	this.mAnimationType = animationType;
	this.mCurrentAnimAdvance = -1;
	this.mCurrentElm = 0;
	this._initAnimation();
};

SpriteAnimateRenderable.prototype._initAnimation = function(){
	this.mCurrentTick = 0;
	switch(this.mAnimationType){
		case SpriteAnimateRenderable.eAnimationType.eAnimateRight:
            this.mCurrentElm = 0;
            this.mCurrentAnimAdvance = 1; // either 1 or -1
            break;
		case SpriteAnimateRenderable.eAnimationType.eAnimateSwing:
			this.mCurrentAnimAdvance = -1 * this.mCurrentAnimAdvance;
			this.mCurrentElm += 2 * this.mCurrentAnimAdvance;
			break;
		case SpriteAnimateRenderable.eAnimationType.eAnimateLeft:
			this.mCurrentElm = this.mNumElem - 1;
			this.mCurrentAnimAdvance = -1; // either 1 or -1
			break;
	}
	this._setSpriteElement();
};
/**
* Sets the sprite element in the sheet by computing the left (u value) from the current element factoring in width and padding.
* From this, the right, bottom and top uv values can be determined. The function then calls setElementUVCoordinate from SpriteRenderable
* @function
*/
SpriteAnimateRenderable.prototype._setSpriteElement = function() {
	var left = this.mFirstElmLeft + (this.mCurrentElm * (this.mElmWidth + this.mWidthPadding));
	var right = left + this.mElmWidth;
	var bottom = this.mElmTop - this.mElmHeight;
	var top = this.mElmTop;

	SpriteRenderable.prototype.setElementUVCoordinate.call(this, left, left+this.mElmWidth,
		this.mElmTop-this.mElmHeight, this.mElmTop);
};

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
* The inputs of the setSpriteSequence() function are in pixels and are converted to texture (uv) coordinates by dividing by the width and height of the image.
* @function
* @param {pixels} topPixel - Offset from top
* @param {pixels} leftPixel - offset from left?? Named leftPixel in code example, rightPixel in book. DISCREPANCY
* @param {pixels} mElmWidthInPixel - Width of the element in pixels.
* @param {pixels} mElmHeightInPixel - Height of the element in pixels.
* @param {pixels} numElements - Number of elements in the animation/sequence.
* @param {pixels} wPaddingInPixel - Left/Right padding in pixels.
*/
SpriteAnimateRenderable.prototype.setSpriteSequence = function(topPixel, leftPixel, elmWidthInPixel, elmHeightInPixel, numElements, wPaddingInPixel){
	var texInfo = gEngine.ResourceMap.retrieveAsset(this.mTexture);
	// entire image width and height
	var imageW = texInfo.mWidth;
	var imageH = texInfo.mHeight;

	this.mNumElems = numElements;
	this.mFirstElmLeft = leftPixel / imageW;
	this.mElmTop = topPixel / imageH;
	this.mElmWidth = elmWidthInPixel / imageW;
	this.mElmHeight = elmHeightInPixel / imageH;
	this.mWidthPadding = wPaddingInPixel / imageW;

	this._initAnimation();
};
/**
* Set the speed of the animation, how often the next frame will appear.
* @function
* @param {number} tickInterval - number of update calls before advancing animation
*/
SpriteAnimateRenderable.prototype.setAnimationSpeed = function(tickInterval){
	// number of update calls before advancing animation
	this.mUpdateInterval = tickInterval;
};

SpriteAnimateRenderable.prototype.incAnimationSpeed = function(deltaInterval) {
    // number of update calls before advancing animation
    this.mUpdateInterval += deltaInterval;   // how often to advance
};
/**
* Advances the animation for each game loop update. The mCurrentTick counter is incremented on each call, when the number of ticks reaches
* the mUpdateInterval value, the animation is reinitialized with _initAnimation(). The game engine architecture ensures the updateAnimation() function calls are kMPF millisecond apart.
* @function
*/
SpriteAnimateRenderable.prototype.updateAnimation = function(){
	this.mCurrentTick++;
	if(this.mCurrentTick >= this.mUpdateInterval){
		this.mCurrentTick = 0;
		this.mCurrentElm += this.mCurrentAnimAdvance;
		if((this.mCurrentElm >= 0) && (this.mCurrentElm < this.mNumElems)){
			this._setSpriteElement();
		} else {
			this._initAnimation();
		}
	}
};