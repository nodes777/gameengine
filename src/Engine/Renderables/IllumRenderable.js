/*
 * File: IllumRenderable.js
 *
 * LightRenderable with light illumination
 */

/*jslint node: true, vars: true */
/*global gEngine, Renderable, LightRenderable, Material*/

"use strict";

/**
*
* Subclass from LightRenderable, interface for supporting normal maps.
* Normal maps texture coordinates will reporduce the corresponding sprite sheet.
* Normal maps must be based on the sprite sheet.
* @class
*/
function IllumRenderable(myTexture, myNormalMap){
	LightRenderable.call(this, myTexture);
	Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getIllumShader());

	this.mNormalMap = myNormalMap;
	this.mMaterial = new Material();
}
gEngine.Core.inheritPrototype(IllumRenderable, LightRenderable);

/**
*
* Normal map texture coordinates are copied from corresponding sprite sheet.
* @func
*/
IllumRenderable.prototype.draw = function(aCamera){
	gEngine.Textures.activateNormalMap(this.mNormalMap);
	this.mShader.setMaterialAndCameraPos(this.mMaterial, aCamera.getPosInPixelSpace());
	LightRenderable.prototype.draw.call(this, aCamera);
};

IllumRenderable.prototype.getMaterial = function() { return this.mMaterial; };