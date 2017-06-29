/*
* SpriteRenderable Renderable Constructor
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false,
    gSquareVertexBuffer: false, document: false, gEngine: false,
    TextureRenderable: false, Renderable: false*/
"use strict";
/**
* @constructor
* @param {path} myTexture - path to the file that contains the texture image
* @classdesc A subclass of TextureRenderable.
*/
function SpriteRenderable(myTexture){
	TextureRenderable.call(this, myTexture);
	Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getSpriteShader());

	this.mTexLeft = 0.0;   // bounds of texture coord (0 is left, 1 is right)
    this.mTexRight = 1.0;  //
    this.mTexTop = 1.0;    // 1 is top and 0 is bottom of image
    this.mTexBottom = 0.0; //
}
gEngine.Core.inheritPrototype(SpriteRenderable, TextureRenderable);

// The expected texture coordinate array is an array of 8 floats where:
/*
* [0][1]: is u/v coordinate of Top-Right
* [2] [3]: is u/v coordinate of Top-Left
* [4] [5]: is u/v coordinate of Bottom-Right
* [6] [7]: is u/v coordinate of Bottom-Left
*/
/**
* Define an enumerated data type with values that identify corresponding offset positions of a WebGL texture coordinate specification array.
* @namespace
* @property {number}  eLeft - [0][1]: is u/v coordinate of Top-Right
* @property {number}  eRight - [2] [3]: is u/v coordinate of Top-Left
* @property {number}  eTop - [4] [5]: is u/v coordinate of Bottom-Right
* @property {number}  eBottom - [6] [7]: is u/v coordinate of Bottom-Left
*/
SpriteRenderable.eTexCoordArray = Object.freeze({
	eLeft: 2,
	eRight: 0,
	eTop: 1,
	eBottom: 5
});

/**
* Specifies a sprite sheet element’s uv values in UV/texture coordinate space (normalized between 0 to 1)
* @function
* @param{number} left - left bound
* @param{number} right - right bound
* @param{number} bottom - bottom bound
* @param{number} top - top bound
*/
SpriteRenderable.prototype.setElementUVCoordinate = function (left, right, bottom, top) {
    this.mTexLeft = left;
    this.mTexRight = right;
    this.mTexBottom = bottom;
    this.mTexTop = top;
};
/**
* Specifies a sprite sheet element’s uv values with pixel positions (which is converted to uv values/texture coordinates).
* @function
* @param{number} left - left bound
* @param{number} right - right bound
* @param{number} bottom - bottom bound
* @param{number} top - top bound
*/
SpriteRenderable.prototype.setElementPixelPositions = function (left, right, bottom, top) {
    var texInfo = gEngine.ResourceMap.retrieveAsset(this.mTexture);
    // entire image width, height
    var imageW = texInfo.mWidth;
    var imageH = texInfo.mHeight;

    this.mTexLeft = left / imageW;
    this.mTexRight = right / imageW;
    this.mTexBottom = bottom / imageH;
    this.mTexTop = top / imageH;
};

SpriteRenderable.prototype.getElementUVCoordinateArray = function () {
    return [
        this.mTexRight,  this.mTexTop,          // x,y of top-right
        this.mTexLeft,   this.mTexTop,
        this.mTexRight,  this.mTexBottom,
        this.mTexLeft,   this.mTexBottom
    ];
};
/**
* Override the draw() function to load the specific texture coordinates values into WebGL context before the actual drawing.
* Sets then activates the current texture
* @function
* @param{color} pixelColor - color to draw
* @param{matrix} vpMatrix - View Projection Matrix
*/
SpriteRenderable.prototype.draw = function(pixelColor, vpMatrix){
	this.mShader.setTextureCoordinate(this.getElementUVCoordinateArray());
	TextureRenderable.prototype.draw.call(this, pixelColor, vpMatrix);
};