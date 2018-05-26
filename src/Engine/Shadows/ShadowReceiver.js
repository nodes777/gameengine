/*
 * File: ShadowReceiver.js
 * Shadow support
 *
 * Instance variables:
 *     mReceiver: Reference to any GameObject
 *                Treats this target for shadow receiver
 *     mCasters: Reference to an array of Renderables that are at least LightRenderable
 *
 * Draws the mReceiver, and the shadows of mCasters on this mReceiver
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Renderable, SpriteRenderable, ShadowCaster, Transform */

"use strict";

/**
* @param {SpriteRenderable} theReceiverObject - GameObject of SpriteRenderable or higher.
* @class
*/
function ShadowReceiver(theReceiverObject){
	this.kShadowStencilBit = 0x01; // The stencil bit to switch on/off for shadow
	this.kShadowStencilMask = 0xFF; // The stencil mask
	this.mReceiverShader = gEngine.DefaultResources.getShadowReceiverShader();
	this.mReceiver = theReceiverObject;

	//To support shadow drawing
	this.mShadowCaster = []; //Array of shadow casters
}

ShadowReceiver.prototype.addShadowCaster = function (lgtRenderable) {
    var c = new ShadowCaster(lgtRenderable, this.mReceiver);
    this.mShadowCaster.push(c);
};

ShadowReceiver.prototype.draw = function (aCamera) {
    var c;

    // A: draw receiver as a regular renderable
    this.mReceiver.draw(aCamera);

    this._shadowRecieverStencilOn();  // B1
    var s = this.mReceiver.getRenderable().swapShader(this.mReceiverShader);
    this.mReceiver.draw(aCamera);   // B2
    this.mReceiver.getRenderable().swapShader(s);
    this._shadowRecieverStencilOff();  // B3

    // C + D: now draw shadow color to the pixels in the stencil that are switched on
    for (c = 0; c < this.mShadowCaster.length; c++)
        this.mShadowCaster[c].draw(aCamera);

    // switch off stencil checking
    this._shadowRecieverStencilDisable();
};

ShadowReceiver.prototype.update = function () {
    this.mReceiver.update();
};