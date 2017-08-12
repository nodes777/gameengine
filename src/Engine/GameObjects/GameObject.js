/**
* GameObject - Class for common funcs in GameObjs
*/
/*jslint node: true, vars: true, evil: true*/

"use strict";

/**
* @constructor
* @param {object} renderableObj - A renderable
* @classdesc GameObjects provide a better way to write code for rendered objects.
*/
function GameObject(renderableObj){
	this.mRenderComponent = renderableObj;
}

GameObject.prototype.getXform = function(){
	return this.mRenderComponent.getXform();
};

GameObject.prototype.update = function(){
	// overwrite with subclass code
};

GameObject.prototype.getRenderable = function(){
	return this.mRenderComponent;
};

GameObject.prototype.draw = function(aCamera){
	this.mRenderComponent.draw(aCamera);
};
