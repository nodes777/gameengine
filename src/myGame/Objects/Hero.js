/*
* Hero
*/
/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false, LightRenderable:false*/
"use strict";

/**
* @constructor
* @classdesc Class for the hero character. Derived from GameObject and mDye. Controlled with WASD.
*/
function Hero(spriteTexture){
	this.kDelta = 0.3;
	this.mDye = new LightRenderable(spriteTexture);
	this.mDye.setColor([1,1,1,0]);
	this.mDye.getXform().setPosition(35, 50);
	this.mDye.getXform().setSize(9, 12);
	this.mDye.setElementPixelPositions(0, 120, 0, 180);

	// what is happening here? I'm calling the GameObject and changing the 'this' value to be the mDye class
	GameObject.call(this, this.mDye);
}

gEngine.Core.inheritPrototype(Hero, GameObject);

/** Provides WASD controls */
Hero.prototype.update = function(){
	var xform = this.getXform();

	if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W)){
		xform.incYPosBy(this.kDelta);
	}
	if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S)){
		xform.incYPosBy(-this.kDelta);
	}
	if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A)){
		xform.incXPosBy(-this.kDelta);
	}
	if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D)){
		xform.incXPosBy(this.kDelta);
	}
};