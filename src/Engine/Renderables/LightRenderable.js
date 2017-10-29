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

 	this.mLight = null;
 }
 gEngine.Core.inheritPrototype(LightRenderable, SpriteAnimateRenderable);

LightRenderable.prototype.draw = function(aCamera){
	this.mShader.setLight(this.mLight);
	SpriteAnimateRenderable.prototype.draw.call(this, aCamera);
};

LightRenderable.prototype.getLight = function(){
	return this.mLight;
};
LightRenderable.prototype.addLight = function(l){
	this.mLight = l;
};