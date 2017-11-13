/* File: LightSet.js
 *
 * Support for working with a set of Lights
 */

/*jslint node: true, vars: true */
/*global gGL: false*/

"use strict";

/**
* Provides a basic interface for a light set that makes the process of working with the light array more convenient
* @class
*/
function LightSet(){
	this.mSet = [];
}

LightSet.prototype.NumLights = function() { return this.mSet.length;};

LightSet.prototype.getLightAt = function(index){
	return this.mSet[index];
};

LightSet.prototype.addToSet = function(light){
	this.mSet.push(light);
};