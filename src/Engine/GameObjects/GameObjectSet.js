/**
* GameObjectSet - For managing all the GameObjects
*/
/*jslint node: true, vars: true, evil: true*/

"use strict";
/**
* @constructor
* @classdesc GameObjectSet contains all the game objects for easier manips of a set of game objects.
*/
function GameObjectSet(){
	this.mSet = [];
}

GameObjectSet.prototype.size = function() {
	return this.mSet.length;
};

GameObjectSet.prototype.getObjectAt = function (index) {
    return this.mSet[index];
};

GameObjectSet.prototype.addToSet = function(obj){
	this.mSet.push(obj);
};

GameObjectSet.prototype.removeFromSet = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1)
        this.mSet.splice(index, 1);
};

GameObjectSet.prototype.update = function(){
	for(var i = 0; i< this.mSet.length; i++ ){
		this.mSet[i].update();
	}
};

GameObjectSet.prototype.draw = function(aCamera){
	for(var i = 0; i< this.mSet.length; i++ ){
		this.mSet[i].draw(aCamera);
	}
};