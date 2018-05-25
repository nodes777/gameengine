/* File: TiledGameObject.js 
 *
 * Infinitely tiled, assume X/Y alignments
 */

/*jslint node: true, vars: true, white: true, bitwise: true */
/*global gEngine, GameObject, vec2, BoundingBox, alert  */

"use strict"; 
/**
* A tileable game object, for repeating backgrounds
* @class
*/
function TiledGameObject(renderableObj){
	this.mShouldTile = true; // can switch off if desired
	GameObject.call(this, renderableObj)
}
gEngine.Core.inheritPrototype(TiledGameObject, GameObject);

TiledGameObject.prototype.setIsTiled = function (t) {
    this.mShouldTile = t;
};

TiledGameObject.prototype.shouldTile = function () {
    return this.mShouldTile;
};

TiledGameObject.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        if (this.shouldTile()) {
            // find out where we should be drawing
            this._drawTile(aCamera);
        } else {
            this.mRenderComponent.draw(aCamera);
        }
    }
};

/**
* Computes and repositions the Renderable object to cover the lower-left corner of the camera WC bounds and tiles the object in the positive x and y directions
* @class
*/
TiledGameObject.prototype._drawTile = function(aCamera){
	// Step A: Compute the positions and dimensions of tiliing object
	var xf = this.getXform();
	var w = xf.getWidth();
	var h = xf.getHeight();
	var pos = xf.getPosition();
	var left = pos[0] - (w/2);
	var right = left + w;
	var top = pos[1] + (h/2);
	var bottom = top -h;

	// Step B: Get the world position and dimensions of the drawing camera
	var wcPos = aCamera.getWCCenter();
	var wcLeft = wcPos[0] - (aCamera.getWidth() /2);
	var wcRight = wcLeft + aCamera.getWCWidth();
    var wcBottom = wcPos[1] - (aCamera.getWCHeight() / 2);
    var wcTop = wcBottom + aCamera.getWCHeight();

	// Step C: Determine the offset to the camera window's lower left corner
	var dx = 0, dy = 0; // offset to the lower left corner
    // left/right boundary?
	if (right < wcLeft) { // left of WC left
        dx = Math.ceil((wcLeft - right)/w) * w;// change in x is that many pixels - to the right
    } else {
        if (left > wcLeft) { // not touching the left side
            dx = -Math.ceil((left-wcLeft)/w) * w;
        }
    }
    // top/bottom boundary
    if (top < wcBottom) { // Lower than the WC bottom
        dy = Math.ceil((wcBottom - top)/h) * h;
    } else {
        if (bottom > wcBottom) {  // not touching the bottom
            dy = -Math.ceil((bottom - wcBottom)/h) * h;
        }
    }

	// Step D: Save the original position of the tiling object.
	var sX = pos[0];
    var sY = pos[1];

	//Step E: Offset the tiling object and modify the related position variables
	xf.incXPosBy(dx);
	xf.incYPosBy(dy);
	right = pos[0] + (w/2);
	top = pos[1] + (h/2);

	//Step F: Determine the number of times to tile in the x and y directions
	var nx = 1, ny = 1; // number of times to draw in the x and y directions
    nx = Math.ceil((wcRight - right) / w);
    ny = Math.ceil((wcTop - top) / h);

	// Step G: Loop through each location to draw a tile.
	var cx = nx;
	var xPos = pos[0];
	while (ny>=0) {
		cx = nx;
		pos[0] = xPos;
		while(cx >= 0){
			this.mRenderComponent.draw(aCamera);
			xf.incXPosBy(w);
			--cx
		}
		xf.incYPosBy(h);
		--ny;
	}
	// Step H: Reset the tiling object to its original position.
    pos[0] = sX;
    pos[1] = sY;
}