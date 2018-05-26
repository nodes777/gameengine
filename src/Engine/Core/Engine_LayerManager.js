/*
 * File: Engine_LayerManager.js
 * Central storage for all elements that would be drawn
 */
/*jslint node: true, vars: true, white: true*/
/*global GameObjectSet */

// Global variable EngineCore
"use strict";

var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

gEngine.eLayer = Object.freeze({
    eBackground: 0,
    eShadowReceiver: 1,
    eActors: 2,
    eFront: 3,
    eHUD: 4
});

gEngine.LayerManager = (function(){

	var kNumLayers = 5;
	var mAllLayers = [];

	var initialize = function(){
		mAllLayers[gEngine.eLayer.eBackground] = new GameObjectSet();
		mAllLayers[gEngine.eLayer.eShadowReceiver] = new GameObjectSet();
	    mAllLayers[gEngine.eLayer.eActors] = new GameObjectSet();
	    mAllLayers[gEngine.eLayer.eFront] = new GameObjectSet();
	    mAllLayers[gEngine.eLayer.eHUD] = new GameObjectSet();
	}

	var cleanUp = function(){
		initialize();
	}

	var addToLayer = function(layerEnum, obj){
		mAllLayers[layerEnum].addToSet(obj);
	}

	var removeFromLayer = function(layerEnum, obj){
		mAllLayers[layerEnum].removeFromSet(obj);
	}

	var layerSize = function(layerEnum) {
     	mAllLayers[layerEnum].size();
	};

	/**
	* Assumes shadowReciever objs are already inserted in eShadowReciever Layer,
	* Adds the casting object to all recievers in layer
	* @func
	*/
	var addAsShadowCaster = function (obj){
		var i;
		for(i = 0; i<mAllLayers[gEngine.eLayer.eShadowReceiver].size(); i++){
			mAllLayers[gEngine.eLayer.eShadowReceiver].getObjectAt(i).
            addShadowCaster(obj);
		}
	}

	var drawLayer = function(layerEnum, aCamera) {
	    mAllLayers[layerEnum].draw(aCamera);
	};

	var drawAllLayers = function(aCamera) {
	    var i;
	    for (i=0; i<kNumLayers; i++)
	        mAllLayers[i].draw(aCamera);
	};

	var moveToLayerFront = function(layerEnum, obj){
		mAllLayers[layerEnum].moveToLast(obj);
	}

	var updateLayer = function(layerEnum) {
	    mAllLayers[layerEnum].update();
	};

	var updateAllLayers = function() {
	    var i;
	    for (i=0; i<kNumLayers; i++)
	        mAllLayers[i].update();
	};

	var mPublic = {
		initialize: initialize,
	  	drawAllLayers: drawAllLayers,
	  	updateAllLayers: updateAllLayers,
	  	cleanUp: cleanUp,

	  	drawLayer: drawLayer,
	  	updateLayer: updateLayer,
	  	addToLayer: addToLayer,
	  	addAsShadowCaster: addAsShadowCaster,
	   	removeFromLayer: removeFromLayer,
	  	moveToLayerFront: moveToLayerFront,
	  	layerSize: layerSize

	};

	return mPublic;
}());