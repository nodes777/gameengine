/*
* Minion Class
*/
/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false, SpriteAnimateRenderable: false,*/
"use strict";
/**
* @constructor
* @classdesc Class for the minion character. Derived from GameObject and mDye. Has Autonomous Behavior.
*/
function Minion(spriteTexture, atY, atX){
	    this.kDelta = 0.2;
    this.mMinion = new SpriteAnimateRenderable(spriteTexture);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(atX, atY);
    this.mMinion.getXform().setSize(12, 9.6);
    this.mMinion.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,   // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(30);

	// Call the GameObject class, then inheritProtoypes? Why do we do this?
	// Calling game object here gives you the properties of the gameobject class
	// But it does not give you the prototype methods, you must do this manually
	// This is a classic JS issue
	GameObject.call(this, this.mMinion);
}

gEngine.Core.inheritPrototype(Minion, GameObject);

Minion.prototype.update = function(){
	this.mMinion.updateAnimation();

	var xform = this.getXform();
	xform.incXPosBy(-this.kDelta);

	if(xform.getXPos() < 0) {
		xform.setXPos(100);
		xform.setYPos(65* Math.random());
	}
};