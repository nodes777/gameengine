/*
 * File: LightRenderable.js
 * Renderable for light
 */
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, aCamera: false, SpriteShader: false,
    vec3: false, vec4: false, gEngine: false,*/
/**
* Subclass from SpriteAnimateRenderable, supporting interaction with lights
* @class
*/
 function LightRenderable(myTexture){
 	SpriteAnimateRenderable.call(this, myTexture);
 	Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLightShader());

 	this.mLights = [];
 }
 gEngine.Core.inheritPrototype(LightRenderable, SpriteAnimateRenderable);

LightRenderable.prototype.draw = function(aCamera){
	this.mShader.setLights(this.mLights);
	SpriteAnimateRenderable.prototype.draw.call(this, aCamera);
};

LightRenderable.prototype.getLight = function(index){
	return this.mLights[index];
};
LightRenderable.prototype.addLight = function(l){
	this.mLights.push(l);
};