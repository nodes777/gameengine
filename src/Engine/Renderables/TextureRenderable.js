/*
* Texture Renderable Constructor
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false,
    gSquareVertexBuffer: false, document: false, gEngine: false,
    Transform: false, Renderable: false*/
"use strict";
/**
* @constructor
* @param {path} myTexture - path to the file that contains the texture image
* @classdesc A subclass of Renderable.
*/
function TextureRenderable(myTexture){
	// calls the superclass, sets the default shader,transform, and color
	Renderable.call(this);
    Renderable.prototype.setColor.call(this, [1, 1, 1, 0]);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getTextureShader());
    this.mTexture = null;
    // these two instance variables are to cache texture information
    // for supporting per-pixel accurate collision
    this.mTextureInfo = null;
    this.mColorArray = null;
    // defined for subclass to override
    this.mTexWidth = 0;
    this.mTexHeight = 0;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
    this.setTexture(myTexture);
}

gEngine.Core.inheritPrototype(TextureRenderable, Renderable);

TextureRenderable.prototype.draw = function(aCamera){
	gEngine.Textures.activateTexture(this.mTexture);
	Renderable.prototype.draw.call(this, aCamera);
};

TextureRenderable.prototype.getTexture = function(){return this.mTexture;};
TextureRenderable.prototype.setTexture = function (newTexture) {
    this.mTexture = newTexture;
    this.mTextureInfo = gEngine.Textures.getTextureInfo(newTexture);
    this.mColorArray = null;
    this.mTexWidth = this.mTextureInfo.mWidth;
    this.mTexHeight = this.mTextureInfo.mHeight;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
};

