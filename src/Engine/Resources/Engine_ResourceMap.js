/*
 * File: Engine_ResourceMap.js
 */
/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, alert: false */

"use strict";

var gEngine = gEngine || { };

gEngine.ResourceMap = (function(){

	var MapEntry = function(rName) {
    	this.mAsset = rName;
		this.mRefCount = 1;
	};

	// Resource storage, a hashmap container of MapEntry
	var mResourceMap = {};

	var mNumOutstandingLoads = 0;

	// callback when all textures loaded
	var mLoadCompleteCallback = null;

	var asyncLoadRequested = function (rName){
		// placeholder for the resource to be loaded
		mResourceMap[rName] = new MapEntry(rName);
		mNumOutstandingLoads++;
	};

	var asyncLoadCompleted = function(rName, loadedAsset){
		if (!isAssetLoaded(rName)){
			alert("gEngine.asyncLoadCompleted: [" + rName + "] not in map!");
		}
			mResourceMap[rName].mAsset = loadedAsset;
			mNumOutstandingLoads--;
			_checkForAllLoadCompleted();
	};

	var _checkForAllLoadCompleted = function(){
		// ensures the loadCompleteCallback only occurs once
		// this isnt being called because the mNumOustandingLoads is still 2
		if ((mNumOutstandingLoads === 0) && (mLoadCompleteCallback !== null)){
			var funcToCall = mLoadCompleteCallback;
        	mLoadCompleteCallback = null;
        	funcToCall();
		}
	};

	// Make sure to set the callback _AFTER_ all load commands are issued
	var setLoadCompleteCallback = function (func) {
	    mLoadCompleteCallback = func;
	    // in case all loading are done
	    _checkForAllLoadCompleted();
	};

	var retrieveAsset = function (rName) {
        var r = null;
        if (rName in mResourceMap) {
            r = mResourceMap[rName].mAsset;
        } else {
            alert("gEngine.retrieveAsset: [" + rName + "] not in map!");
        }
        return r;
    };

    var isAssetLoaded = function (rName) {
        return (rName in mResourceMap);
    };
    /**
    * Unload the asset. If the reference count of the unloading asset reaches zero, then remove it from the resource map. If not, keep the reference in the resource map because it's still being used.
    * @function
    * @param{string} rName - Path to resource as a unique identifying name.
    */

    var unloadAsset = function (rName) {
    	// count. If the reference count reaches zero then delete the reference from the resource map
    	// if it never reaches zero don't delete the reference in the resource map.
    	var c = 0;
        if (rName in mResourceMap) {
        	mResourceMap[rName].mRefCount -= 1;
        	c = mResourceMap[rName].mRefCount;
        	if( c === 0){
        		delete mResourceMap[rName];
        	}
        }
    };

    var incAssetRefCount = function(rName) {
        mResourceMap[rName].mRefCount += 1;
	};

    var mPublic = {
 		asyncLoadRequested: asyncLoadRequested,
        asyncLoadCompleted: asyncLoadCompleted,
        setLoadCompleteCallback: setLoadCompleteCallback,

        incAssetRefCount: incAssetRefCount,
        retrieveAsset: retrieveAsset,
        unloadAsset: unloadAsset,
        isAssetLoaded: isAssetLoaded
       };
    return mPublic;
}());