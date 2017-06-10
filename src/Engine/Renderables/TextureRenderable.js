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
	Renderable.prototype.setColor.call(this, [1, 1, 1, 0]);// Alpha 0: switch off tinting
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getTextureShader());
	// the object’s texture, cannot be null.
    this.mTexture = myTexture;
}

gEngine.Core.inheiritPrototype(TextureRenderable, Renderable);

TextureRenderable.prototype.draw = function(vpMatrix){
	gEngine.Textures.activateTexture(this.mTexture);
	Renderable.prototype.draw.call(this, vpMatrix);
};

TextureRenderable.prototype.getTexture = function(){return this.mTexture;};
TextureRenderable.prototype.setTexture = function(t){ this.mTexture = t;};

