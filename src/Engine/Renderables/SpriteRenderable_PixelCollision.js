/* File: SpriteRenderable_PixelCollision.js
 *
 * implements the _setTexInfo() function to support per-pixel collision for
 * sprite elements
 */

/*jslint node: true, vars: true */
/*global gEngine, SpriteRenderable */

"use strict";
/**
* @func
* Overrides the current texture vars in TextureRenderable, to associate these vars with the current sprite element.
*/
SpriteRenderable.prototype._setTexInfo = function () {
    var imageW = this.mTextureInfo.mWidth;
    var imageH = this.mTextureInfo.mHeight;
		// Gets the left and bottom indices for the current sprite element
    this.mTexLeftIndex = this.mTexLeft * imageW;
    this.mTexBottomIndex = this.mTexBottom * imageH;
		// Sets the texture width and height to be the w and height of the current sprite element
    this.mTexWidth = ((this.mTexRight - this.mTexLeft) * imageW) + 1;
    this.mTexHeight = ((this.mTexTop - this.mTexBottom) * imageH) + 1;
};