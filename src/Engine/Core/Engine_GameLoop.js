var gEngine = gEngine || {};

gEngine.GameLoop = (function(){
	var kFPS = 60;
	//milleseconds per frame = 16.66
	var kMPF = 1000/kFPS;

	// vars for timing game loop
	var mPreviousTime;
	var mLagTime;
	var mCurrentTime;
	var mElapsedTime;

	// The current loop state
	var mIsLoopRunning = false;

	// Reference to game logic
	var mMyGame = null;

	// this func assumed it's sub-classed from MyGame, set with .call()
	var _runLoop = function () {
	    if(mIsLoopRunning) {
	        // Step A: set up for next call to _runLoop and update input
			// call sets the this to mMyGame
	        requestAnimationFrame( function(){_runLoop.call(mMyGame);} );

	        // Step B: compute elapsed time since last RunLoop was executed
	        mCurrentTime = Date.now();
	        mElapsedTime = mCurrentTime - mPreviousTime;
	        mPreviousTime = mCurrentTime;
	        mLagTime += mElapsedTime;

	        // Step C: update the game the appropriate number of times.
	        // Update only every Milliseconds per frame.
	        // If lag larger then update frames, update until caught up.
	        while ((mLagTime >= kMPF) && mIsLoopRunning) {
				gEngine.Input.update();
				// call MyGame.update()
	            this.update();      
				// decrease lag by (lag minus frames per millisec)
	            mLagTime -= kMPF;
	        }

	        // Step D: call MyGame.draw()
	        this.draw();    
	     }
	};

	var start = function(myGame) {
	    mMyGame = myGame;

	   gEngine.ResourceMap.setLoadCompleteCallback(
            function() {
                mMyGame.initialize();
                _startLoop();
            });
	};

	var _startLoop = function(){
		// Step A: reset frame time
	    mPreviousTime = Date.now();
	    mLagTime = 0.0;
	    // Step B: remember that loop is now running
		mIsLoopRunning = true;
	    // Step C: request _runLoop to start when loading is done
	    requestAnimationFrame(function(){_runLoop.call(mMyGame);});
	};

	var mPublic = {
		start: start,
	};
	return mPublic;
})();


