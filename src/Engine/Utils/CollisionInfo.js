/* 
 * File: CollisionInfo.js
 *      normal: vector upon which collision interpenetrates
 *      depth: how much penetration
 */

/*jslint node: true, vars: true, white: true */
/*global vec2 */

"use strict"; 
/**
* Class used to describe information about a specific collision, including depth and normal.
* @class
*/
function CollisionInfo() {
    this.mDepth = 0;
    this.mNormal = vec2.fromValues(0, 0);
}

CollisionInfo.prototype.setDepth = function (s) { this.mDepth = s; };
CollisionInfo.prototype.setNormal = function (s) { this.mNormal = s; };

CollisionInfo.prototype.getDepth = function () { return this.mDepth; };
CollisionInfo.prototype.getNormal = function () { return this.mNormal; };