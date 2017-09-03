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
        var otherBbox = otherObj.getBBox();
        // First check bounding boxes
        if (otherBbox.intersectsBound(this.getBBox())) {
            myRen.setColorArray();
            otherRen.setColorArray();
            pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
        }
    }
    return pixelTouch;
};