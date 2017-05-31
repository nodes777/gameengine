/*
 * File: Scene.js
 */
/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, alert: false */

/**
* @constructor
* @classdesc Scene is an abstract class that will contain client code. The game engine interfaces with its standardized functions. These functions are empty now and will be overwritten with client code.
*/
function Scene(){

}

/**
* Called from Game Loop after loading is finished
* @function
*/
Scene.prototype.initialize = function(){
	//called from Game Loop after loading is finished
};

/**
* Called from EngineCore.startScene()
* @function
*/
Scene.prototype.loadScene = function() {

};

Scene.prototype.unloadScene = function() { };
Scene.prototype.update = function() { };
Scene.prototype.draw = function() { };