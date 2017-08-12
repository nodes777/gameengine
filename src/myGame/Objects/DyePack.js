/*
* Dye Pack
*/
/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false,*/
"use strict";
/**
* @constructor
* @classdesc Basic class for GameObjects. Object can be drawn only without any specific behaviors.
*/
function DyePack(spriteTexture){
	this.kRefWidth = 80;
	this.kRefHeight = 130;

	this.mDyePack = new SpriteRenderable(spriteTexture);

	this.mDyePack.setColor([1,1,1,0.1]);
	this.mDyePack.getXform().setPosition(50,33);
	this.mDyePack.getXform().setSize(this.kRefWidth/50, this.kRefHeight/50);
	this.mDyePack.setElementPixelPositions(510, 595, 23, 153);
	GameObject.call(this, this.mDyePack);

}

gEngine.Core.inheritPrototype(DyePack, GameObject);