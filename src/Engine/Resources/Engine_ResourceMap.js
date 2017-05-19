var gEngine = gEngine || { };

gEngine.ResourceMap = (function(){

	var MapEntry = function(rName) {
    	this.mAsset = rName;
	};

	// Resource storage, a hashmap container of MapEntry
	var mResourceMap = {};

	var mNumOutstandingLoads = 0;

	// callback when all textures loaded
	var mLoadCompleteCallback = null;

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

	var asyncLoadRequested = function (rName){
		// placeholder for the resource to be loaded
		mResourceMap[rName] = new MapEntry(rName);
		++mNumOutstandingLoads;
	};

	var asyncLoadCompleted = function(rName, loadedAsset){
		if (!isAssetLoaded(rName)){
			alert("gEngine.asyncLoadCompleted: [" + rName + "] not in map!");
			mResourceMap[rName].mAsset = loadedAsset;
			--mNumOutstandingLoads;
			_checkForAllLoadCompleted();
		}
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

    var unloadAsset = function (rName) {
        if (rName in mResourceMap) {
            delete mResourceMap[rName];
        }
    };

    var mPublic = {
 		asyncLoadRequested: asyncLoadRequested,
        asyncLoadCompleted: asyncLoadCompleted,
        setLoadCompleteCallback: setLoadCompleteCallback,

        //<editor-fold desc="resource storage support">
        retrieveAsset: retrieveAsset,
        unloadAsset: unloadAsset,
        isAssetLoaded: isAssetLoaded
       };
    return mPublic;
}());