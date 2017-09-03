/* File: TextureRenderable_PixelCollision.js
 *
 * Implements the pixelTouches() and related supporting functions of TextureRenderable
 */

/*jslint node: true, vars: true */
/*global gEngine, TextureRenderable, vec2 */

"use strict";

TextureRenderable.prototype.setColorArray = function () {
    if (this.mColorArray === null)
        this.mColorArray = gEngine.Textures.getColorArray(this.mTexture);
};
/**
* Private method for getting the alpha value of a given pixel coord. In Texture space.
* @func
* @param{number} x - x position of pixel in texture
* @param{number} y - y position of pixel in texture
*/
TextureRenderable.prototype._pixelAlphaValue = function(x,y){
	x = x * 4;
	y = y * 4;
	// mColorArray is a one-dimensional array where colors of pixels are stored as four floats and organized by rows
	return this.mColorArray[(y*this.mTextureInfo.mWidth) + x + 3];
};
/**
* Given a pixel (i,j) compute the world coordinate position of that pixel
* @func
* @param{array} returnWCPos - The world position of that pixel, an array.
* @param{number} i - x position of pixel in texture
* @param{number} j - y position of pixel in texture
*/
TextureRenderable.prototype._indexToWCPosition = function(returnWCPos, i, j){
	var x = i * this.mXform.getWidth() / (this.mTexWidth - 1);
	var y = j * this.mXform.getHeight() / (this.mTexHeight - 1);
	returnWCPos[0] = this.mXform.getXPos() + (x - (this.mXform.getWidth() * 0.5));
	returnWCPos[1] = this.mXform.getYPos() + (y - (this.mXform.getHeight() * 0.5));
};

/**
* Private method for converting from WC position to texture pixel indices
* @function
* @param{array} returnIndex - Array of the index we're changing
* @param{array} wcPos - The world coordinate position we're taking from
*/
TextureRenderable.prototype._wcPositionToIndex = function (returnIndex, wcPos) {
    // use wcPos to compute the corresponding returnIndex[0 and 1]
    var delta = [];
    vec2.sub(delta, wcPos, this.mXform.getPosition());
    returnIndex[0] = this.mTexWidth  * (delta[0] / this.mXform.getWidth());
    returnIndex[1] = this.mTexHeight * (delta[1] / this.mXform.getHeight());

    // recall that xForm.getPosition() returns center, yet Texture origin is at lower-left corner!
    returnIndex[0] += this.mTexWidth / 2;
    returnIndex[1] += this.mTexHeight / 2;

    returnIndex[0] = Math.floor(returnIndex[0]);
    returnIndex[1] = Math.floor(returnIndex[1]);
};

/**
* Determines if 2 Textures are touching on the non-alpha pixels. Note wcTouchPos is only one of potentialy many colliding points.
* @function
* @param{array} other - The other texture renderable, This one (the one calling this func) is the smaller one.
* @param{array} wcTouchPos - The world coordinate position we're taking from
*/
TextureRenderable.prototype.pixelTouches = function(other, wcTouchPos) {
    var pixelTouch = false;
    var xIndex = 0, yIndex;
    var otherIndex = [0, 0];

	// go across the width of the texture
    while ((!pixelTouch) && (xIndex < this.mTexWidth)) {
        yIndex = 0;
		// go up the height of the texture
        while ((!pixelTouch) && (yIndex < this.mTexHeight)) {
			// if the pixel there is opaque
            if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
				// Get the World Coord position for that pixel, this changes wcTouchPos
                this._indexToWCPosition(wcTouchPos, xIndex, yIndex);
				// Get the index from the wcTouchPos, this changes otherIndex
                other._wcPositionToIndex(otherIndex, wcTouchPos);
				// if the other index is inside the texture of the other
                if ((otherIndex[0] > 0) && (otherIndex[0] < other.mTexWidth) &&
                    (otherIndex[1] > 0) && (otherIndex[1] < other.mTexHeight)) {
					// set pixelTouch to the boolean of value of if the alpha of the other index is greater than 0.
					// if this is true, exits the loop because of the (!pixelTouch checks)
                    pixelTouch = other._pixelAlphaValue(otherIndex[0], otherIndex[1]) > 0;
                }
            }
            yIndex++;
        }
        xIndex++;
    }
    return pixelTouch;
};