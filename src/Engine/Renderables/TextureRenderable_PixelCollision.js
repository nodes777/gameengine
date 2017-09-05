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
* Given a pixel (i,j) compute the world coordinate position of that pixel.
* The returned value of returnWCPos is a displacement from the object’s center position along the xDirDisp and yDirDisp vectors, the scaled xDir and yDir vectors.
* @func
* @param{array} returnWCPos - The world position of that pixel, an array.
* @param{number} i - x position of pixel in texture
* @param{number} j - y position of pixel in texture
* @param{vec2} xDir - Normalized vector component
* @param{vec2} yDir - Normalized vector component
*/
TextureRenderable.prototype._indexToWCPosition = function(returnWCPos, i, j, xDir, yDir){
	var x = i * this.mXform.getWidth() / (this.mTexWidth - 1);
	var y = j * this.mXform.getHeight() / (this.mTexHeight - 1);
	var xDisp = x - (this.mXform.getWidth() * 0.5);
    var yDisp = y - (this.mXform.getHeight() * 0.5);
    var xDirDisp = [];
    var yDirDisp = [];

    vec2.scale(xDirDisp, xDir, xDisp);
    vec2.scale(yDirDisp, yDir, yDisp);
    vec2.add(returnWCPos, this.mXform.getPosition(), xDirDisp);
    vec2.add(returnWCPos, returnWCPos, yDirDisp);
};

/**
* Private method for converting from WC position to texture pixel indices
* @function
* @param{array} returnIndex - Array of the index we're changing
* @param{array} wcPos - The world coordinate position we're taking from
* @param{vec2} xDir - Rotated normalized vector component
* @param{vec2} yDir - Rotated normalized vector component
*/
TextureRenderable.prototype._wcPositionToIndex = function (returnIndex, wcPos, xDir, yDir) {
    // use wcPos to compute the corresponding returnIndex[0 and 1]
    var delta = [];
    vec2.sub(delta, wcPos, this.mXform.getPosition());
	var xDisp = vec2.dot(delta, xDir);
    var yDisp = vec2.dot(delta, yDir);
    returnIndex[0] = this.mTexWidth  * (xDisp / this.mXform.getWidth());
    returnIndex[1] = this.mTexHeight * (yDisp / this.mXform.getHeight());
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

	var xDir = [1, 0];
    var yDir = [0, 1];
    var otherXDir = [1, 0];
    var otherYDir = [0, 1];
    vec2.rotate(xDir, xDir, this.mXform.getRotationInRad());
    vec2.rotate(yDir, yDir, this.mXform.getRotationInRad());
    vec2.rotate(otherXDir, otherXDir, other.mXform.getRotationInRad());
    vec2.rotate(otherYDir, otherYDir, other.mXform.getRotationInRad())

	// go across the width of the texture
    while ((!pixelTouch) && (xIndex < this.mTexWidth)) {
        yIndex = 0;
		// go up the height of the texture
        while ((!pixelTouch) && (yIndex < this.mTexHeight)) {
			// if the pixel there is opaque
            if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
				// Get the World Coord position for that pixel, this changes wcTouchPos
                this._indexToWCPosition(wcTouchPos, xIndex, yIndex, xDir, yDir);
				// Get the index from the wcTouchPos, this changes otherIndex
                other._wcPositionToIndex(otherIndex, wcTouchPos, otherXDir, otherYDir);
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