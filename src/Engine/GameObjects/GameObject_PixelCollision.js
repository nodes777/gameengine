/* File: GameObject_PixelCollision.js
 *
 * Implements the pixelTouch() function of GameObject
 */

/*jslint node: true, vars: true */
/*global GameObject */

"use strict";

/**
* Determines if two object's pixels are touching, calls the texture pixel touch function
* @func
* @param {object} otherObj - The other object renderable
* @param {array} wcTouchPos - The coordinate position in the world
* @return {boolean} whether or not the game objects are touching
*/
GameObject.prototype.pixelTouches = function (otherObj, wcTouchPos) {
    // only continue if both objects have GetColorArray defined
    // if defined, should have other texture intersection support!
    var pixelTouch = false;
    var myRen = this.getRenderable();
    var otherRen = otherObj.getRenderable();

    if ((typeof myRen.pixelTouches === "function") && (typeof otherRen.pixelTouches === "function")) {
        if ((myRen.getXform().getRotationInRad() === 0) && (otherRen.getXform().getRotationInRad() === 0)) {
            // no rotation, we can use bbox ...
            var otherBbox = otherObj.getBBox();
	            if (otherBbox.intersectsBound(this.getBBox())) {
	                myRen.setColorArray();
	                otherRen.setColorArray();
	                pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
				}
            } else {
            // One or both are rotated, compute an encompassing circle by using the hypertenuse as radius
            var mySize = myRen.getXform().getSize();
            var otherSize = otherRen.getXform().getSize();
            var myR = Math.sqrt(0.5*mySize[0]*0.5*mySize[0] + 0.5*mySize[1]*0.5*mySize[1]);
            var otherR = Math.sqrt(0.5*otherSize[0]*0.5*otherSize[0] + 0.5*otherSize[1]*0.5*otherSize[1]);
            var d = [];
            vec2.sub(d, myRen.getXform().getPosition(), otherRen.getXform().getPosition());
            if (vec2.length(d) < (myR + otherR)) {
                myRen.setColorArray();
                otherRen.setColorArray();
                pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
            }
        }
	}
	return pixelTouch;
};