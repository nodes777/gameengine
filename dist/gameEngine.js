/*jslint node: true, vars: true, evil: true */
/*global initSquareBuffer: false, initSimpleShader: false, document: false,
  gSimpleShader: false, gShaderVertexPositionAttribute: false*/
"use strict";

var gEngine = gEngine || {};

gEngine.Core = (function() {
    //instance var: the graphical context for drawing
    var mGL = null;

    //Accessor of the webgl context
    var getGL = function() {
        return mGL;
    };

    // initialize the WebGL, the vertex buffer and compile the shaders
    var _initializeWebGL = function (htmlCanvasID) {
            var canvas = document.getElementById(htmlCanvasID);

            // Get the standard or experimental webgl and binds to the Canvas area
            // store the results to the instance variable mGL
            // alpha object informs browser that canvas should be opaque, speeding up drawing of transparent content
            mGL = canvas.getContext("webgl", {alpha: false, depth: true, stencil: true}) ||
                    canvas.getContext("experimental-webgl", {alpha: false, depth: true, stencil: true});
            // for webgl debugging
           // mGL = WebGLDebugUtils.makeDebugContext(mGL);

            // Allows transparency with textures
            mGL.blendFunc(mGL.SRC_ALPHA, mGL.ONE_MINUS_SRC_ALPHA);
            mGL.enable(mGL.BLEND);

            //sets images to flip the y axis to match the texture coordinate space
            mGL.pixelStorei(mGL.UNPACK_FLIP_Y_WEBGL, true);

            // Enable Depth Testing
            mGL.enable(mGL.DEPTH_TEST);
            mGL.depthFunc(mGL.LEQUAL);

            if (mGL === null) {
                document.write("<br><b>WebGL is not supported!</b>");
                return;
            }
        };


    var startScene = function(myGame) {
        // Called in this way to keep correct context
        myGame.loadScene.call(myGame);

        // start the game loop after initialization
        gEngine.GameLoop.start(myGame);
    };
    var initializeEngineCore = function (htmlCanvasID, myGame) {
            _initializeWebGL(htmlCanvasID);
            gEngine.VertexBuffer.initialize();
            gEngine.Input.initialize(htmlCanvasID);
            gEngine.AudioClips.initAudioContext();
            gEngine.Physics.initialize();
            gEngine.LayerManager.initialize();
            // init default resources, when done do this callback
            gEngine.DefaultResources.initialize(function() { 
                // myGame defined in index.html
                startScene(myGame);
            });
    };

    // Clears the draw area and draws one square
    var clearCanvas = function(color) {
    	// set the color to be cleared
        mGL.clearColor(color[0], color[1], color[2], color[3]);

        // clear to the color, stencil bit, and depth buffer bits
        mGL.clear(mGL.COLOR_BUFFER_BIT | mGL.STENCIL_BUFFER_BIT | mGL.DEPTH_BUFFER_BIT);     
    };

    /**
    * inheritPrototype passes a reference to the prototype of one object to another. Allows subclass to inherit superclass's prototype functions
    * @function
    * @param {class} subClass - Class to gain prototype
    * @param {class} superClass - Class to model prototype from
    */
    var inheritPrototype = function(subClass, superClass){
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

    var cleanUp = function(){
        gEngine.VertexBuffer.cleanUp();
        gEngine.DefaultResources.cleanUp();
    };

    //Contains the functions and variables that will be accessible
    var mPublic = {
        getGL: getGL,
        initializeEngineCore: initializeEngineCore,
        clearCanvas: clearCanvas,
        inheritPrototype: inheritPrototype,
        startScene: startScene,
        cleanUp: cleanUp
    };

    return mPublic;
})();
/*jslint node: true, vars: true, evil: true */
/*global initSquareBuffer: false, initSimpleShader: false, document: false,
  gSimpleShader: false, gShaderVertexPositionAttribute: false*/

"use strict";

var gEngine = gEngine || { };

// The VertexBuffer object
gEngine.VertexBuffer = (function() {
    // First: define the vertices for a square
	//x,y,z
    //z is 0, because 2d
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

	// Second: define the corresponding texture cooridnates
	var textureCoordinates = [
	    1.0, 1.0,
	    0.0, 1.0,
	    1.0, 0.0,
	    0.0, 0.0
	];
	// this is to support the debugging of physics engine
	var verticesOfLine = [
        0.5, 0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    // reference to the texture positions for the square vertices in the gl context
    var mLineVertexBuffer = null;

    var mSquareVertexBuffer = null;
	// reference to the texture positions for the square vertices in the gl context
	var mTextureCoordBuffer = null;

    var getGLVertexRef = function() { return mSquareVertexBuffer; };
	var getGLTexCoordRef = function() { return mTextureCoordBuffer; };
	var getGLLineVertexRef = function () { return mLineVertexBuffer; };

    var initialize = function() {
        var gl = gEngine.Core.getGL();

        // Step A: Create a buffer on the gGL context for our vertex positions
		//stores the reference for the GPU
        mSquareVertexBuffer = gl.createBuffer();

        // Step B: Activate vertexBuffer
    	//gl is canvas context
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
		// Copy the vertices data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare),gl.STATIC_DRAW);

		// Step D: Allocate and store texture coordinates
	    // Create a buffer on the gGL context for our vertex positions
	    mTextureCoordBuffer = gl.createBuffer();

	    // Activate vertexBuffer
	    gl.bindBuffer(gl.ARRAY_BUFFER, mTextureCoordBuffer);

	    // Loads verticesOfSquare into the vertexBuffer
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

	 	// Create a buffer on the gGL context for our vertex positions
        mLineVertexBuffer = gl.createBuffer();

        // Connect the vertexBuffer to the ARRAY_BUFFER global gl binding point.
        gl.bindBuffer(gl.ARRAY_BUFFER, mLineVertexBuffer);
		// Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfLine), gl.STATIC_DRAW);
	};

	var cleanUp = function(){
		var gl = gEngine.Core.getGL();
		gl.deleteBuffer(mSquareVertexBuffer);
		gl.deleteBuffer(mTextureCoordBuffer);
		gl.deleteBuffer(mLineVertexBuffer);
	};

    var mPublic = {
        initialize: initialize,
        getGLVertexRef: getGLVertexRef,
		getGLTexCoordRef: getGLTexCoordRef,
		getGLLineVertexRef: getGLLineVertexRef,
		cleanUp: cleanUp
    };
    return mPublic;
}());
var gEngine = gEngine || {};

gEngine.Input = (function () {
	// Key code constants
	var kKeys = {
	    // arrows
	    Left: 37,
	    Up: 38,
	    Right: 39,
	    Down: 40,

	    // space bar
	    Space: 32,

	    // numbers
	    Zero: 48,
	    One: 49,
	    Two: 50,
	    Three: 51,
	    Four: 52,
	    Five : 53,
	    Six : 54,
	    Seven : 55,
	    Eight : 56,
	    Nine : 57,

	    // Alphabets
		A : 65,
        B : 66,
        C : 67,
        D : 68,
        E : 69,
        F : 70,
        G : 71,
        H : 72,
        I : 73,
        J : 74,
        K : 75,
        L : 76,
        M : 77,
        N : 78,
        O : 79,
        P : 80,
        Q : 81,
        R : 82,
        S : 83,
        T : 84,
        U : 85,
        V : 86,
        W : 87,
        X : 88,
        Y : 89,
        Z : 90,

	    LastKeyCode : 222
	};

	var kMouseButton = {
    	Left: 0,
    	Middle: 1,
    	Right: 2
	};

	var mCanvas = null;
	var mButtonPreviousState = [];
	var mIsButtonPressed = [];
	var mIsButtonClicked = [];
	var mMousePosX = -1;
	var mMousePosY = -1;

	/**
	* Checks whether the mouse is within bounds of the canvas. Flips Y so the displacement is measured against lower left corner.
	* @func
	* @param {object} event - Mouse event from client
	* @returns Boolean
	*/
	var _onMouseMove = function (event){
		var inside = false;
		var bBox = mCanvas.getBoundingClientRect();

		// In canvas space now. Convert via ratio from canvas to client
		var x = Math.round((event.clientX - bBox.left) * (mCanvas.width / bBox.width));
		var y = Math.round((event.clientY - bBox.top) * (mCanvas.width / bBox.width));

		// if you're within the canvas
		if((x >= 0) && (x < mCanvas.width) && (y >= 0) && (y < mCanvas.height)){
			mMousePosX = x;
			mMousePosY = mCanvas.height - 1 - y;
			inside = true;
		}
		return inside;
	};
	/**
	* Calls _onMouseMove, which checks whether the mouse is on canvas, if so, the mIsButtonPressed[event.button] is set to true
	* @func
	*/
	var _onMouseDown = function(event){
		if (_onMouseMove(event)){
			mIsButtonPressed[event.button] = true;
		}
	};
	var _onMouseUp = function(event){
		_onMouseMove(event);
    	mIsButtonPressed[event.button] = false;
	};

	// Previous key state
	var mKeyPreviousState = [];

	// The pressed keys.
	var mIsKeyPressed = [];

	// Click events: once an event is set, it will remain there until polled
	var mIsKeyClicked = [];

	// Event service functions
	var _onKeyDown = function (event) {
    mIsKeyPressed[event.keyCode] = true;  };
	var _onKeyUp = function (event)  {
    mIsKeyPressed[event.keyCode] = false; };

	var initialize = function (canvasID) {
		//for all the keys, set their initial states to false
	    for (var i = 0; i<kKeys.LastKeyCode; i++) {
	        mIsKeyPressed[i] = false;
	        mKeyPreviousState[i] = false;
	        mIsKeyClicked[i] = false;
	    }

	    // register handlers with the browser
		// when the broswer registers a keyup run _onKeyUp
	    window.addEventListener('keyup', _onKeyUp);
	    window.addEventListener('keydown', _onKeyDown);

		// Mouse Support
		for(var j = 0; j< 3; j++){
			mButtonPreviousState[j] = false;
			mIsButtonPressed[j] = false;
			mIsButtonClicked[j] = false;
		}

		window.addEventListener('mousedown', _onMouseDown);
		window.addEventListener('mouseup', _onMouseUp);
    	window.addEventListener('mousemove', _onMouseMove);
		mCanvas = document.getElementById(canvasID);
	};

	var update = function () {
        var i;
        // Keys
        for (i = 0; i < kKeys.LastKeyCode; i++) {
            mIsKeyClicked[i] = (!mKeyPreviousState[i]) && mIsKeyPressed[i];
            mKeyPreviousState[i] = mIsKeyPressed[i];
        }
        // Mouse Buttons
        for (i = 0; i < 3; i++) {
        	mIsButtonClicked[i] = (!mButtonPreviousState[i]) && mIsButtonPressed[i];
        	mButtonPreviousState[i] = mIsButtonPressed[i];
    	}
    };

    var isButtonPressed = function(button){
    	return mIsButtonPressed[button];
    };

    var isButtonClicked = function(button){
    	return mIsButtonClicked[button];
    };

    var getMousePosX = function () { return mMousePosX; };
	var getMousePosY = function () { return mMousePosY; };

	// Function for GameEngine programmer to test if a key is pressed down
	var isKeyPressed = function (keyCode) {
	    return mIsKeyPressed[keyCode]; };
	var isKeyClicked = function(keyCode) {
	    return (mIsKeyClicked[keyCode]);
	};

	var mPublic = {
		initialize: initialize,
	    update: update,
	    isKeyPressed: isKeyPressed,
	    isKeyClicked: isKeyClicked,
	    keys: kKeys,

        // Mouse support
        isButtonPressed: isButtonPressed,
        isButtonClicked: isButtonClicked,
        getMousePosX: getMousePosX,       // invalid if no corresponding buttonPressed or buttonClicked
        getMousePosY: getMousePosY,
        mouseButton: kMouseButton
	};
	return mPublic;
}());


var gEngine = gEngine || {};

gEngine.GameLoop = (function(){
	var kFPS = 60;
	//milleseconds per frame = 16.66
	var kMPF = 1000/kFPS;

	// Used for getting delta time in physics calculations
	var kFrameTime = 1 / kFPS;
	var kMPF = 1000 * kFrameTime; // Milliseconds per frame.

	var getUpdateIntervalInSeconds = function () {
	    return kFrameTime;
	};

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
	     } else {
			//the game loop has stopped, unload the current scene
			mMyGame.unloadScene();
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

	var stop = function(){
		mIsLoopRunning = false;
	};

	var mPublic = {
		start: start,
		stop: stop,
		getUpdateIntervalInSeconds: getUpdateIntervalInSeconds
	};
	return mPublic;
})();



/*
 * File: EngineCore_Physics.js
 * Physics engine supporting projection and impulse collision resolution.
 */
/*jslint node: true, vars: true, white: true */
/*global vec2, CollisionInfo */

"use strict";

var gEngine = gEngine || { };

gEngine.Physics = (function(){
	var mRelaxationCount = 15; // number of relaxtion iteration
	var mRelaxationOffset = 1/mRelaxationCount; //proportion to apply when scaling friction
	var mPosCorrectionRate = 0.8; // percentage of seperation to project objects
	var mSystemAcceleration = [0,-50]; //System wide acceleration


	var mRelaxationLoopCount = 0; // the current relaxation count
	var mHasOneCollision = false; // detect the first collision

	var mCollisionInfo = null;   // information of the current collision

	var initialize = function() {
	    mCollisionInfo = new CollisionInfo();   // to avoid allocating this constantly
	};

	/**
	* @param {object} s1 - The first colliding object
	* @param {object} s2 - The second colliding object
	* @param {object} collisionInfo - Information about the collision
	* Finds the new correct position for colliding objects, by scaling and adding vectors
	* @func
	*/
	var _positionalCorrection = function(s1, s2, collisionInfo){
		var s1InvMass = s1.getInvMass();
		var s2InvMass = s2.getInvMass();

		var num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * mPosCorrectionRate;
		var correctionAmount = [0,0];
		vec2.scale(correctionAmount, collisionInfo.getNormal(), num);

		var ca = [0, 0];
	    vec2.scale(ca, correctionAmount, s1InvMass);
	    var s1Pos = s1.getPosition();
	    vec2.subtract(s1Pos, s1Pos, ca);

	    vec2.scale(ca, correctionAmount, s2InvMass);
	    var s2Pos = s2.getPosition();
	    vec2.add(s2Pos, s2Pos, ca);

	};

	/**
	* @param {vec2} n - collision normal
	* @param {vec2} v - velocity
	* @param {num} f - friction
	* @param {num} m - invMass
	* Applies friction to colliding rigidshapes. Figure 9-8, friction is simulated by applying a deceleration in the tangent direction of the collision.
	* @func
	*/
	var _applyFriction = function(n, v, f, m) {
	    var tangent = vec2.fromValues(n[1], -n[0]);  // perpendicular to n
	    var tComponent = vec2.dot(v, tangent);
	    if (Math.abs(tComponent) < 0.01)
	        return;

	    f *= m * mRelaxationOffset;
	    if (tComponent < 0) {
	        vec2.scale(tangent, tangent, -f);
	    } else {
	        vec2.scale(tangent, tangent, f);
	    }
	    vec2.sub(v, v, tangent);
	};

	/**
	* @param {object} s1 - The first colliding object
	* @param {object} s2 - The second colliding object
	* @param {object} collisionInfo - Information about the collision
	* Resolves the collision of two rigidshapes
	* @func
	*/
	var resolveCollision = function (s1, s2, collisionInfo){
		// Step A: one collision has been found
        mHasOneCollision = true;

        // Step B: correct positions
        _positionalCorrection(s1, s2, collisionInfo);

        // Step C: apply friction
        var s1V = s1.getVelocity();  // collision normal direction is _against_ s2
        var s2V = s2.getVelocity();
        var n = collisionInfo.getNormal();
        _applyFriction(n, s1V, s1.getFriction(), s1.getInvMass());
        _applyFriction(n, s2V, -s2.getFriction(), s2.getInvMass());

		// Step D: Compute the relative velocity of the colliding objects: important for computing the impulse that pushes the objects apart
		var relativeVelocity = [0,0];
		vec2.sub(relativeVelocity, s2V, s1V);

		// Step E: examine the component in the normal direction
		var rVelocityInNormal = vec2.dot(relativeVelocity, n);
        if (rVelocityInNormal > 0) { //if objects moving apart ignore
            return;
        }

		// Step F: compute and apply response impulses for each object
		var newRestituion = Math.min(s1.getRestitution(), s2.getRestitution())
		var j = -(1+newRestituion) * rVelocityInNormal;
		j = j / (s1.getInvMass() + s2.getInvMass());

		var impulse = [0, 0];
		vec2.scale(impulse, collisionInfo.getNormal(), j);

		var newImpulse = [0, 0];
        vec2.scale(newImpulse, impulse, s1.getInvMass());
        vec2.sub(s1V, s1V, newImpulse);

        vec2.scale(newImpulse, impulse, s2.getInvMass());
        vec2.add(s2V, s2V, newImpulse);
	};

	var beginRelaxation = function() {
		mRelaxationLoopCount = mRelaxationCount;
		mHasOneCollision = true;
	};

	var continueRelaxation = function() {
		var oneCollision = mHasOneCollision;
		mHasOneCollision = false;
		mRelaxationLoopCount = mRelaxationLoopCount - 1;
		return ((mRelaxationLoopCount > 0) && oneCollision);
	}

	// Relaxation of resolving the collision between two individual GameObject instances
	var processObjObj = function(obj1, obj2){
		var s1 = obj1.getPhysicsComponent();
		var s2 = obj2.getPhysicsComponent();

		if( s1 === s2) {
			return;
		}

		beginRelaxation();
		while(continueRelaxation()){
			if(s1.collided(s2, mCollisionInfo)){
				resolveCollision(s1, s2, mCollisionInfo);
			}
		}
	};

	//process the collision resolution between a GameObject instance and a GameObjectSet
	var processObjSet = function (obj, set){
		var s1 = obj.getPhysicsComponent();
		var i, s2;
		beginRelaxation();
		while(continueRelaxation()){
			for(i=0; i<set.size(); i++){
				s2 = set.getObjectAt(i).getPhysicsComponent();
				if((s1 !== s2) && (s1.collided(s2, mCollisionInfo))){
					resolveCollision(s1, s2, mCollisionInfo);
				}
			}
		}
	};

	// Process the collision resolution between two GameObjectSets
	var processSetSet = function(set1, set2) {
	    var i, j, s1, s2;
	    beginRelaxation();
	    while (continueRelaxation()) {
	        for (i=0; i<set1.size(); i++) {
	            s1 = set1.getObjectAt(i).getPhysicsComponent();
	            for (j=0; j<set2.size(); j++) {
	                s2 = set2.getObjectAt(j).getPhysicsComponent();
	                if ((s1 !== s2) && (s1.collided(s2, mCollisionInfo))) {
	                    resolveCollision(s1, s2, mCollisionInfo);
	                }
	            }
	        }
	    }
	};

    // Rigid Shape interactions: a set against itself
    var processSelfSet = function(set) {
        var i, j, s1, s2;
        beginRelaxation();
        while (continueRelaxation()) {
            for (i=0; i<set.size(); i++) {
                s1 = set.getObjectAt(i).getPhysicsComponent();
                for (j=i+1; j<set.size(); j++) {
                    s2 = set.getObjectAt(j).getPhysicsComponent();
                    if ((s1 !== s2) && (s1.collided(s2, mCollisionInfo))) {
                        resolveCollision(s1, s2, mCollisionInfo);
                    }
                }
            }
        }
    };
	// Setters and Getters
	var getSystemAcceleration = function() { return mSystemAcceleration; };
	var setSystemAcceleration = function(g) { mSystemAcceleration = g; };
	var getRelaxationCorrectionRate = function() { return mPosCorrectionRate; };
	var setRelaxationCorrectionRate = function(r) {
	    if ((r <= 0) || (r>=1)) {
	        r = 0.8;
	    }
	    mPosCorrectionRate = r;
	};
	var getRelaxationLoopCount = function() { return mRelaxationCount; };
	var setRelaxationLoopCount = function(c) {
	    if (c <= 0)
	        c = 1;
	    mRelaxationCount = c;
	    mRelaxationOffset = 1/mRelaxationCount;
	};

	var mPublic = {
		initialize: initialize,
	    resolveCollision: resolveCollision,
	    beginRelaxation: beginRelaxation,
	    continueRelaxation: continueRelaxation,
	    getSystemAcceleration: getSystemAcceleration,
	    setSystemAcceleration: setSystemAcceleration,
	    getRelaxationCorrectionRate: getRelaxationCorrectionRate,
	    setRelaxationCorrectionRate: setRelaxationCorrectionRate,
	    getRelaxationLoopCount: getRelaxationLoopCount,
	    setRelaxationLoopCount: setRelaxationLoopCount,
	    processObjObj: processObjObj,
	    processObjSet: processObjSet,
	    processSetSet: processSetSet,
		processSelfSet: processSelfSet
	 };
	return mPublic;
}());
/*
 * File: Engine_Particle.js 
 * Particle System support
 */
/*jslint node: true, vars: true, white: true */
/*global vec2 */

"use strict"; 

var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

gEngine.Particle = (function () {
	var mSystemAcceleration = [0, -50.0];

	// the folllowing is scratch workspace for vec2
	var mFrom1to2 = [0,0];
	var mVec = [0, 0];
	var mNormal = [0, 0];

	/**
	* Resolves circle and particle collisions. 
	* Particles inside a circle are projected out. In this case, with a zero-area particle, collision resolution does not need relaxation.
	* @func
	*/
	var resolveCirclePos = function (circShape, particle){
		var collided = false;
		var pos = particle.getPosition();
		var cPos = circShape.getPosition();
		vec2.subtract(mFrom1to2, pos, cPos);
		var dist = vec2.length(mFrom1to2);

        if (dist < circShape.getRadius()) {
	        vec2.scale(mFrom1to2, mFrom1to2, 1/dist);
	        vec2.scaleAndAdd(pos, cPos, mFrom1to2, circShape.getRadius());
			collided = true;
		}
		return collided;
	}

	// Resolve for rectangle collisions
	var resolveRectPos = function (rectShape, particle) {
	    var collided = false;
	    var alongX = rectShape.getWidth() / 2;
	    var alongY = rectShape.getHeight() / 2;

	    var pos = particle.getPosition();
	    var rPos = rectShape.getPosition();

	    var rMinX = rPos[0] - alongX;
	    var rMaxX = rPos[0] + alongX;
	    var rMinY = rPos[1] - alongY;
	    var rMaxY = rPos[1] + alongY;

	    collided = ((rMinX<pos[0]) && (rMinY<pos[1]) &&
	                (rMaxX>pos[0]) && (rMaxY>pos[1]));

	    if (collided) {
	        vec2.subtract(mFrom1to2, pos, rPos);
	        mVec[0] = mFrom1to2[0];
	        mVec[1] = mFrom1to2[1];

	        // Find closest axis
	        if (Math.abs(mFrom1to2[0] - alongX) < Math.abs(mFrom1to2[1] - alongY))  {
	            // Clamp to closest side
	            mNormal[0] = 0;
	            mNormal[1] = 1;
	            if (mVec[0] > 0) {
	                mVec[0] = alongX;
	            } else {
	                mVec[0] = -alongX;
	            }
	        } else { // y axis is shorter
	            mNormal[0] = 1;
	            mNormal[1] = 0;
	            // Clamp to closest side
	            if (mVec[1] > 0) {
	                mVec[1] = alongY;
	            } else {
	                mVec[1] = -alongY;
	            }
	        }

	        vec2.subtract(mVec, mVec, mFrom1to2);
	        vec2.add(pos, pos, mVec);  // remember pos is particle position
        }
        return collided;
	};

	// Rigid Shape interactions: a game object and a set of particle game objects
	var processObjSet = function(obj, pSet) {
	    var s1 = obj.getPhysicsComponent();  // a RigidShape
	    var i, p;
	    for (i=0; i<pSet.size(); i++) {
	        p = pSet.getObjectAt(i).getPhysicsComponent();  // a Particle
	        s1.resolveParticleCollision(p);
	    }
	};

	// Rigid Shape interactions: game object set and a set of particle game objects
	var processSetSet = function(objSet, pSet) {
	    var i;
	    for (i=0; i<objSet.size(); i++) {
	        processObjSet(objSet.getObjectAt(i), pSet);
	    }
	};


    var getSystemAcceleration = function() { return mSystemAcceleration; };
    var setSystemAcceleration = function(g) { mSystemAcceleration = g; };

	var mPublic = {
		getSystemAcceleration: getSystemAcceleration,
	    setSystemAcceleration: setSystemAcceleration,
	    resolveCirclePos: resolveCirclePos,
	    resolveRectPos: resolveRectPos,
	    processObjSet: processObjSet,
	    processSetSet: processSetSet
	};
	return mPublic;
}());
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
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false,
XMLHttpRequest: false, alert: false, DOMParser: false, vec2: false */
"use strict";

var gEngine = gEngine || {};

gEngine.TextFileLoader = (function(){

	// Object.freese disables modification, makes it immutable
	var eTextFileType = Object.freeze({
	    eXMLFile: 0,
	    eTextFile: 1
	});

	/**
	 * Load a text file
	 * @param {string} fileName - path to the resource
	 * @param {string} fileType - xml or text
	 * @param {string} callback - func to call when load is complete
	 */
    var loadTextFile = function (fileName, fileType, callbackFunction) {
        /** check if asset is already loaded*/
        if (!(gEngine.ResourceMap.isAssetLoaded(fileName))) {
            // Update resources in load counter.
            gEngine.ResourceMap.asyncLoadRequested(fileName);

            // Async request the data from server.
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                /** readyState 4 is request complete and returned */
                if ((req.readyState === 4) && (req.status !== 200)) {
                    alert(fileName + ": loading failed! [Hint: you cannot double click index.html to run this project. " +
                        "The index.html file must be loaded by a web-server.]");
                }
            };
            req.open('GET', fileName, true);
            req.setRequestHeader('Content-Type', 'text/xml');

            req.onload = function () {
                var fileContent = null;
                if (fileType === eTextFileType.eXMLFile) {
                    var parser = new DOMParser();
                    fileContent = parser.parseFromString(req.responseText, "text/xml");
                } else {
                    fileContent = req.responseText;
                }
                gEngine.ResourceMap.asyncLoadCompleted(fileName, fileContent);
                if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                    callbackFunction(fileName);
                }
            };
            req.send();
        } else {
            if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                callbackFunction(fileName);
            }
        }
    };

	var unloadTextFile = function (fileName){
		gEngine.ResourceMap.unloadAsset(fileName);
	};

	var mPublic = {
		loadTextFile: loadTextFile,
	    unloadTextFile: unloadTextFile,
	    eTextFileType: eTextFileType
	};
	return mPublic;
}());
/*jslint node: true, vars: true, evil: true*/
/*global SimpleShader: false, TextureShader: false, SpriteShader: false, vec4:false, LightShader: false, IllumShader: false*/
"use strict";

var gEngine = gEngine || { };
/**
 * Default Resources Module.
 * @module Core/Resources/Engine_DefaultResources
 */
gEngine.DefaultResources = (function() {

	// Global Ambient color
	var mGlobalAmbientColor = [0.3, 0.3, 0.3, 1];
	var mGlobalAmbientIntensity = 1;

	var getGlobalAmbientIntensity = function() { return mGlobalAmbientIntensity; };
	var setGlobalAmbientIntensity = function(v) { mGlobalAmbientIntensity = v; };
	var getGlobalAmbientColor = function() { return mGlobalAmbientColor; };
	var setGlobalAmbientColor = function(v) {
        mGlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]);
	};

	/** @constant Simple Shader GLSL Shader file paths*/
	var kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";
	var kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";

		// Texture Shader
	var kTextureVS = "src/GLSLShaders/TextureVS.glsl";  // Path to VertexShader
	var kTextureFS = "src/GLSLShaders/TextureFS.glsl";  // Path to FragmentShader
	var mTextureShader = null;

	// Illumination Shader
	var kIllumFS = "src/GLSLShaders/IllumFS.glsl";      // Path to the Illumination FragmentShader
	var mIllumShader = null;
	var getIllumShader = function(){ return mIllumShader; };

	/** @constant Particle Shader GLSL Shader file paths*/
	var kParticleFS = "src/GLSLShaders/ParticleFS.glsl";
	var mParticleShader = null;
	var getParticleShader = function () { return mParticleShader };

	var mSpriteShader = null;
	var getSpriteShader = function(){
		return mSpriteShader;
	};

	var mConstColorShader = null;
	var _getConstColorShader = function(){
		return mConstColorShader;
	};

	var kLightFS = "src/GLSLShaders/LightFS.glsl";
	var mLightShader = null;

	var kLineFS = "src/GLSLShaders/LineFS.glsl";        // Path to the Line FragmentShader
    var mLineShader = null;

	// Shadow Shaders
	var kShadowReceiverFS = "src/GLSLShaders/ShadowReceiverFS.glsl"
	var mShadowReceiverShader = null;
	var kShadowCasterFS = "src/GLSLShaders/ShadowCasterFS.glsl";  // Path to the FragmentShader
	var mShadowCasterShader = null;

	// Fonts
	var kDefaultFont = "assets/fonts/system-default-font";
	var getDefaultFont = function() { return kDefaultFont; };


	/** @callback func after loading is done*/
	var _createShaders = function(callbackFunction){
		gEngine.ResourceMap.setLoadCompleteCallback(null);
		mConstColorShader = new SimpleShader(kSimpleVS,kSimpleFS);
		mTextureShader = new TextureShader(kTextureVS, kTextureFS);
		mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
		mLineShader =  new LineShader(kSimpleVS, kLineFS);
		mLightShader = new LightShader(kTextureVS, kLightFS);
		mIllumShader = new IllumShader(kTextureVS, kIllumFS);
		mShadowReceiverShader = new SpriteShader(kTextureVS, kShadowReceiverFS);
		mShadowCasterShader = new ShadowCasterShader(kTextureVS, kShadowCasterFS);
		mParticleShader = new TextureShader(kTextureVS, kParticleFS);
		callbackFunction();
	};

	var getTextureShader = function() { return mTextureShader; };
	var getShadowReceiverShader = function () { return mShadowReceiverShader; };
    var getShadowCasterShader = function () { return mShadowCasterShader; };

    var getLineShader = function () { return mLineShader; };

	/** initiate async loading of GLSL Shader files*/
	var initialize = function(callbackFunction){
		// constant color shader: SimpleVS, and SimpleFS
	    gEngine.TextFileLoader.loadTextFile(kSimpleVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
	    gEngine.TextFileLoader.loadTextFile(kSimpleFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
		// texture shader:
	    gEngine.TextFileLoader.loadTextFile(kTextureVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
	    gEngine.TextFileLoader.loadTextFile(kTextureFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		// Line Shader:
        gEngine.TextFileLoader.loadTextFile(kLineFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		// Font
		gEngine.Fonts.loadFont(kDefaultFont);
		// Light shader
        gEngine.TextFileLoader.loadTextFile(kLightFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

        // IllumShader
        gEngine.TextFileLoader.loadTextFile(kIllumFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		// Shadow caster and receiver shaders
        gEngine.TextFileLoader.loadTextFile(kShadowReceiverFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.loadTextFile(kShadowCasterFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

        // Particle Shader
        gEngine.TextFileLoader.loadTextFile(kParticleFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		gEngine.ResourceMap.setLoadCompleteCallback(function() {
			_createShaders(callbackFunction);
		});
	};

	/** @function Removes resources from memory by deleting associated buffers from webGL and detaching shaders. And unloading text and font files. */
	var cleanUp = function(){
		mConstColorShader.cleanUp();
		mTextureShader.cleanUp();
		mSpriteShader.cleanUp();
		mLineShader.cleanUp();
        mIllumShader.cleanUp();
        mShadowReceiverShader.cleanUp();
        mShadowCasterShader.cleanUp();

		gEngine.TextFileLoader.unloadTextFile(kSimpleVS);
		gEngine.TextFileLoader.unloadTextFile(kSimpleFS);

		gEngine.TextFileLoader.unloadTextFile(kTextureVS);
		gEngine.TextFileLoader.unloadTextFile(kTextureFS);

		gEngine.Fonts.unloadFont(kDefaultFont);

        gEngine.TextFileLoader.unloadTextFile(kLightFS);

	    gEngine.TextFileLoader.unloadTextFile(kIllumFS);

        gEngine.TextFileLoader.unloadTextFile(kShadowReceiverFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.unloadTextFile(kShadowCasterFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

		gEngine.TextFileLoader.unloadTextFile(kParticleFS);
	};

	var getLightShader = function() {return mLightShader;};

    var mPublic = {
        initialize: initialize,
        getConstColorShader: _getConstColorShader,
        getTextureShader: getTextureShader,
        getSpriteShader: getSpriteShader,
        getLineShader: getLineShader,
        getLightShader: getLightShader,
        getIllumShader: getIllumShader,
        getShadowReceiverShader: getShadowReceiverShader,
        getShadowCasterShader: getShadowCasterShader,
        getDefaultFont: getDefaultFont,
        getGlobalAmbientColor: getGlobalAmbientColor,
        setGlobalAmbientColor: setGlobalAmbientColor,
        getGlobalAmbientIntensity: getGlobalAmbientIntensity,
        setGlobalAmbientIntensity: setGlobalAmbientIntensity,
        getParticleShader: getParticleShader,
        cleanUp: cleanUp
	};
    return mPublic;
}());
/*
 * File: EngineCore_Audio.js
 * Provides support for loading and unloading of Audio clips
 */

/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, SimpleShader: false, window: false, alert: false, XMLHttpRequest: false */

"use strict";

var gEngine = gEngine || { };
gEngine.AudioClips = (function(){

	var mAudioContext = null;
	var mBgAudioNode = null;

	var initAudioContext = function(){
		try {
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			mAudioContext = new AudioContext();
		} catch(e){
			alert("Web Audio not supported!");
		}
	};

	var loadAudio = function(clipName){
		if(!(gEngine.ResourceMap.isAssetLoaded(clipName))){
			// Update resources in load counter
			gEngine.ResourceMap.asyncLoadRequested(clipName);
			// Async request data from server
			var req = new XMLHttpRequest();
			req.onreadystatechange = function(){
				if ((req.readyState === 4)&&(req.status !== 200)) {
					alert(clipName + ": loading failed! Hint: the index.html must beloaded by a webserver");
				}
			};
			/**
			* Initializes the request
			* @function
			* @param {method} GET - Make a GET request
			* @param {url} clipName - The location/name of the clip to get
			* @param {async} true - Make this request asynchronous
			*/
			req.open('GET', clipName, true);
			// Specify that the request retrieves binary data.
			req.responseType = "arraybuffer";

			req.onload = function(){
				/**
				* Decode the binary audio data
				* @function
				* @param {object} response - Response from the XMLHttprequest
				* @param {function} anonymous - Callback for when the decoding is done
				*/
				mAudioContext.decodeAudioData(req.response, function(buffer){
					gEngine.ResourceMap.asyncLoadCompleted(clipName, buffer);
				});
			};
			req.send();
		} else {
			gEngine.ResourceMap.incAssetRefCount(clipName);
		}
	};

	var unloadAudio = function(clipName){
		gEngine.ResourceMap.unloadAsset(clipName);
	};

	/**
	* Play a full audio clip. No reference to the source node is kept. Cannot be paused.
	* @function
	* @param {path} clipName - Audio file path to resource
	*/
	var playACue = function(clipName){
		var clipInfo = gEngine.ResourceMap.retrieveAsset(clipName);
		if(clipInfo !== null){
			// Source nodes are one use only
			var sourceNode = mAudioContext.createBufferSource();
			sourceNode.buffer = clipInfo;
			sourceNode.connect(mAudioContext.destination);
			sourceNode.start(0);
		}
	};

	var playBackgroundAudio = function(clipName){
		var clipInfo = gEngine.ResourceMap.retrieveAsset(clipName);
		if(clipInfo !== null){
			stopBackgroundAudio();
			mBgAudioNode = mAudioContext.createBufferSource();
			mBgAudioNode.buffer = clipInfo;
			mBgAudioNode.connect(mAudioContext.destination);
			mBgAudioNode.loop = true;
			mBgAudioNode.start(0);
		}
	};

    var stopBackgroundAudio = function () {
        // Check if the audio is  playing.
        if (mBgAudioNode !== null) {
            mBgAudioNode.stop(0);
            mBgAudioNode = null;
        }
    };

	var isBackgroundAudioPlaying = function() {
    return (mBgAudioNode !== null);
	};

    var mPublic = {
		initAudioContext: initAudioContext,
	    loadAudio: loadAudio,
	    unloadAudio: unloadAudio,
	    playACue: playACue,
	    playBackgroundAudio: playBackgroundAudio,
	    stopBackgroundAudio: stopBackgroundAudio,
	    isBackgroundAudioPlaying: isBackgroundAudioPlaying
	};
    return mPublic;
}());
/*
 * File: Engine_Textures.js
 */
/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, alert: false, Image: false*/

"use strict";

/**
* @constructor
* @param {string} name - path to the image file
* @param {number} w - width, pixel resolution
* @param {number} h- height, pixel resolution
* @param {string} id - A reference to the WebGL texture storage
* @classdesc TextureInfo - TextureInfo object description
*/
function TextureInfo(name, w, h, id){
	this.mName = name;
	this.mWidth = w;
	this.mHeight = h;
	this.mGLTexID = id;
	this.mColorArray = null;
}

var gEngine = gEngine || { };

gEngine.Textures = (function(){

	/**
	* Loads a texture so that it can be drawn. If already in the map, will just inc reference count
	* @function
	* @param{string} textureName - Path to resource as a unique identifying name.
	*/
	var loadTexture = function(textureName) {
	    if (!(gEngine.ResourceMap.isAssetLoaded(textureName)))  {
	        // Create new Texture object.
	       var img = new Image();

			// update resources in loading counter
			gEngine.ResourceMap.asyncLoadRequested(textureName);

			img.onload = function(){
				_processLoadedImage(textureName, img);
			};
			img.src = textureName;
	    } else {
	        gEngine.ResourceMap.incAssetRefCount(textureName);
	    }
	};

	var unloadTexture = function(textureName){
		var gl = gEngine.Core.getGL();
		var texInfo = gEngine.ResourceMap.retrieveAsset(textureName);
		// webGL func
		gl.deleteTexture(texInfo.mGLTexID);
		gEngine.ResourceMap.unloadAsset(textureName);
	};
	/**
	* Convert the format of an image and store it in the WebGL context.
	* @function
	* @param{string} textureName - Path as a unique id.
	* @param{object} image - Image object.
	*/
	var _processLoadedImage = function(textureName, image){
		var gl = gEngine.Core.getGL();

		// Create a webGL texture object, returns a unique id
		var textureID = gl.createTexture();

		// bind texture with the current texture functionality in webGL
		gl.bindTexture(gl.TEXTURE_2D, textureID);

		/**
		* load the texture into the texture data structure with descriptive info. Stores the image into the WebGL texture buffer
		* @function
		* @param{GLenum} target - Which "binding point" or target the texture is being loaded to.
		* @param{GLenum} level - Level of detail. Used for mipmapping. 0 is base texture level.
		* @param{GLenum} internalFormat - The composition of each element, i.e. pixels.
		* @param{GLenum} format - Format of texel data. Must match internal format..
		* @param{GLenum} type - The data type of the texel data.
		* @param{const GLvoid * data} data - Texture data, the image
		*/
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		// Create a mipmap for this texture
		gl.generateMipmap(gl.TEXTURE_2D);

		// Tells webGL we are done manipulating data at the mGL.TEXTURE_2D target
		gl.bindTexture(gl.TEXTURE_2D, null);

		// store all this info in the resource map
		var texInfo = new TextureInfo(textureName, image.naturalWidth, image.naturalHeight, textureID);
		gEngine.ResourceMap.asyncLoadCompleted(textureName, texInfo);
	};

	var activateTexture = function(textureName){
		var gl = gEngine.Core.getGL();
		var texInfo = gEngine.ResourceMap.retrieveAsset(textureName);

		// Bind Color to texture unit 0
		gl.activeTexture(gl.TEXTURE0);
		// Binds our texture reference to the current webGL texture functionality
		gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);

		// Prevents texture wrappings, S and T are axes in textures
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		// Handles how magnification and minimization filters will work
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

		// For pixel-graphics where you want the texture to look "sharp" //  enable
		// gl.NEAREST: Returns the pixel that is closest to the coordinates,
		// gl.LINEAR: Returns the weighted average of the 4 pixels surrounding the given coordinates.
		// What about the mimap versions of these? Supposed to be "better"
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	};

	var activateNormalMap = function(textureName){
		var gl = gEngine.Core.getGL();
		var texInfo = gEngine.ResourceMap.retrieveAsset(textureName);

		// Bind reference to WebGL texture functionality
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);

		// To prevent texture wrappings
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	    // Handles how magnification and minimization filters will work.
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	};

	var deactivateTexture = function() {
	   var gl = gEngine.Core.getGL();
	   gl.bindTexture(gl.TEXTURE_2D, null);
	};

	var getTextureInfo = function(textureName){
		return gEngine.ResourceMap.retrieveAsset(textureName);
	};

	/**
	* Retrieve the color array from the WebGL context
	* @function
	* @param{string} textureName - The name of the texture to grab the info from
	*/
	var getColorArray = function(textureName){
		var texInfo = getTextureInfo(textureName);
		if(texInfo.mColorArray === null){
			// generate a frame buffer, bind it to the texture and read the color content
			var gl = gEngine.Core.getGL();
			var fb = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texInfo.mGLTexID, 0);

			if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)=== gl.FRAMEBUFFER_COMPLETE){
				// Uint8Array(length)
				// pixels are the width * height * 4 values rgba
				var pixels = new Uint8Array(texInfo.mWidth * texInfo.mHeight * 4);
				//
				gl.readPixels(0,0, texInfo.mWidth, texInfo.mHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
			 texInfo.mColorArray = pixels;
			} else {
				alert("WARNING: Engine.Textures.GetColorArray() failed!");
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.deleteFramebuffer(fb);
		}
		return texInfo.mColorArray;
	};

    var mPublic = {
		loadTexture: loadTexture,
    	unloadTexture: unloadTexture,
    	activateTexture: activateTexture,
		activateNormalMap: activateNormalMap,
    	deactivateTexture: deactivateTexture,
    	getTextureInfo: getTextureInfo,
		getColorArray: getColorArray
	};
    return mPublic;
})();


/*
 * File: EngineCore_Fonts.js
 * Provides support for loading and unloading of font image and font description
 */

/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, XMLHttpRequest: false, DOMParser: false, alert: false, XPathResult: false */

"use strict";

var gEngine = gEngine || { };

/**
* @class
* @classdesc An object for storing pixel location and display information associated with the characters.
* In texture/ uv coords (0 to 1). Maps to entire image.
* UV coord and char info can be computed from .fnt file
*/
function CharacterInfo() {
	this.mTexCoordLeft = 0;
	this.mTexCoordRight = 1;
	this.mTexCoordBottom = 0;
	this.mTexCoordTop = 1;

	// nominal character size, 1 is "standard width/height" of a char
	this.mCharWidth = 1;
	this.mCharHeight = 1;
	this.mCharWidthOffset = 0;
	this.mCharHeightOffset = 0;

	// Reference to width/height ratio
	this.mCharAspectRatio = 1;
}

gEngine.Fonts = (function(){
	var loadFont = function(fontName){
		if(!gEngine.ResourceMap.isAssetLoaded(fontName)){
			var fontInfoSourceString = fontName + ".fnt";
			var textureSourceString = fontName + ".png";

			//register and entry in the map
			gEngine.ResourceMap.asyncLoadRequested(fontName);
			gEngine.Textures.loadTexture(textureSourceString);
			// params: filename, filetype, callback
			gEngine.TextFileLoader.loadTextFile(fontInfoSourceString,
				gEngine.TextFileLoader.eTextFileType.eXMLFile,
				_storeLoadedFont);
	    } else {
	        gEngine.ResourceMap.incAssetRefCount(fontName);
	    }
	};
	/** @params fontInfoSourceString - Path to .fnt file. Since the callback in loadTextFile only passes one param (fileName), additional massaging is used to get all data. */
	var _storeLoadedFont = function(fontInfoSourceString){
		var fontName = fontInfoSourceString.slice(0,-4);
		var fontInfo = gEngine.ResourceMap.retrieveAsset(fontInfoSourceString);
		fontInfo.fontImage = fontName + ".png";
		gEngine.ResourceMap.asyncLoadCompleted(fontName, fontInfo);
	};

	var unloadFont = function(fontName){
		gEngine.ResourceMap.unloadAsset(fontName);
		if(!(gEngine.ResourceMap.isAssetLoaded(fontName))){
			var fontInfoSourceString = fontName + ".fnt";
			var textureSourceString = fontName + ".png";

			gEngine.Textures.unloadTexture(textureSourceString);
			gEngine.TextFileLoader.unloadTextFile(fontInfoSourceString);
		}

	};

	/** @function Uses the fnt file to determine which character to pull from map. Not covered in book*/
	var getCharInfo = function(fontName, aChar){
		var returnInfo = null;
        var fontInfo = gEngine.ResourceMap.retrieveAsset(fontName);
        var commonPath = "font/common";
        var commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        commonInfo = commonInfo.iterateNext();
        if (commonInfo === null) {
            return returnInfo;
        }
        var charHeight = commonInfo.getAttribute("base");

        var charPath = "font/chars/char[@id=" + aChar + "]";
        var charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        charInfo = charInfo.iterateNext();

        if (charInfo === null) {
            return returnInfo;
        }

        returnInfo = new CharacterInfo();
        var texInfo = gEngine.Textures.getTextureInfo(fontInfo.fontImage);
        var leftPixel = Number(charInfo.getAttribute("x"));
        var rightPixel = leftPixel + Number(charInfo.getAttribute("width")) - 1;
        var topPixel = (texInfo.mHeight - 1) - Number(charInfo.getAttribute("y"));
        var bottomPixel = topPixel - Number(charInfo.getAttribute("height")) + 1;

        // texture coordinate information
        returnInfo.mTexCoordLeft = leftPixel / (texInfo.mWidth - 1);
        returnInfo.mTexCoordTop = topPixel / (texInfo.mHeight - 1);
        returnInfo.mTexCoordRight = rightPixel / (texInfo.mWidth - 1);
        returnInfo.mTexCoordBottom = bottomPixel / (texInfo.mHeight - 1);

        // relative character size
        var charWidth = charInfo.getAttribute("xadvance");
        returnInfo.mCharWidth = charInfo.getAttribute("width") / charWidth;
        returnInfo.mCharHeight = charInfo.getAttribute("height") / charHeight;
        returnInfo.mCharWidthOffset = charInfo.getAttribute("xoffset") / charWidth;
        returnInfo.mCharHeightOffset = charInfo.getAttribute("yoffset") / charHeight;
        returnInfo.mCharAspectRatio = charWidth / charHeight;

        return returnInfo;
	};

	var mPublic = {
		loadFont: loadFont,
        unloadFont: unloadFont,
        getCharInfo: getCharInfo
	};
    return mPublic;
}());


/*
 * File: Scene.js
 */
/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, alert: false */

/** testing
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
/*
 * File: Material.js
 * Simple Phong illumination model material: Ka, Kd, KS, and Shininess.
 */

/*jslint node: true, vars: true */
/*global gEngine, vec4 */

"use strict";

/**
* Allows for material lighting, specular, diffuse, and ambient all together. Talks to ShaderMaterial.js and then IllumShader.glsl
* @class
*/
function Material(){
	this.mKa = vec4.fromValues(0.0, 0.0, 0.0, 0);
	this.mKs = vec4.fromValues(0.2, 0.2, 0.2, 1);
	this.mKd = vec4.fromValues(1.0, 1.0, 1.0, 1);
	this.mShininess = 20;
}

Material.prototype.setAmbient = function(a){this.mKa = vec4.clone(a);};
Material.prototype.getAmbient = function(){return this.mKa;};

Material.prototype.setDiffuse = function(d) { this.mKd = vec4.clone(d); };
Material.prototype.getDiffuse = function() { return this.mKd; };

Material.prototype.setSpecular = function(s) { this.mKs = vec4.clone(s); };
Material.prototype.getSpecular = function() { return this.mKs; };

Material.prototype.setShininess = function(s) { this.mShininess= s; };
Material.prototype.getShininess = function() { return this.mShininess; };

/*
 * File: Light.js
 * Defines a simple light source
 */

/*jslint node: true, vars: true, bitwise: true */
/*global vec3, vec4 */

"use strict";

// Constructor
function Light() {
    this.mColor = vec4.fromValues(0.1, 0.1, 0.1, 1);  // light color
    this.mPosition = vec3.fromValues(0, 0, 5); // light position in WC
    this.mDirection = vec3.fromValues(0, 0, -1); // in WC
    this.mNear = 5;  // effective distance in WC
    this.mFar = 10;  // within near is full on, outside far is off
    this.mInner = 0.1; // in radians
    this.mOuter = 0.3;
    this.mIntensity = 1;
    this.mDropOff = 1;
    this.mLightType = Light.eLightType.ePointLight;
    this.mIsOn = true;
    this.mCastShadow = false;
}

//<editor-fold desc="public functions">
// simple setters and getters
Light.prototype.setColor = function (c) { this.mColor = vec4.clone(c); };
Light.prototype.getColor = function () { return this.mColor; };

Light.prototype.set2DPosition = function (p) { this.mPosition = vec3.fromValues(p[0], p[1], this.mPosition[2]); };
Light.prototype.setXPos = function (x) { this.mPosition[0] = x; };
Light.prototype.setYPos = function (y) { this.mPosition[1] = y; };
Light.prototype.setZPos = function (z) { this.mPosition[2] = z; };
Light.prototype.getPosition = function () { return this.mPosition; };

Light.prototype.setDirection = function (d) { this.mDirection = vec3.clone(d); };
Light.prototype.getDirection = function () { return this.mDirection; };

Light.prototype.setNear = function (n) { this.mNear = n; };
Light.prototype.getNear = function () { return this.mNear; };

Light.prototype.setFar = function (f) { this.mFar = f; };
Light.prototype.getFar = function () { return this.mFar; };

Light.prototype.setInner = function (r) { this.mInner = r; };
Light.prototype.getInner = function () { return this.mInner; };

Light.prototype.setOuter = function (r) { this.mOuter = r; };
Light.prototype.getOuter = function () { return this.mOuter; };

Light.prototype.setIntensity = function (i) { this.mIntensity = i; };
Light.prototype.getIntensity = function () { return this.mIntensity; };

Light.prototype.setDropOff = function (d) { this.mDropOff = d; };
Light.prototype.getDropOff = function () { return this.mDropOff; };

Light.prototype.setLightType = function (t) { this.mLightType = t; };
Light.prototype.getLightType = function () { return this.mLightType; };

Light.prototype.isLightOn = function () { return this.mIsOn; };
Light.prototype.setLightTo = function (on) { this.mIsOn = on; };

Light.prototype.isLightCastShadow = function () { return this.mCastShadow; };
Light.prototype.setLightCastShadowTo = function (on) { this.mCastShadow = on; };

// **** WARNING: The following enumerate values must be identical to
// the values of ePointLight, eDirectionalLight, eSpotLight
// defined in LightFS.glsl and IllumFS.glsl
Light.eLightType = Object.freeze({
    ePointLight: 0,
    eDirectionalLight: 1,
    eSpotLight: 2
});
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
/*
* Transform Object
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false,
    gSquareVertexBuffer: false, document: false, gEngine: false,*/
"use strict";

 function Transform(){
 	//vec.fromValues(), create a vector from these 2 values
 	// Translation
 	this.mPosition = vec2.fromValues(0,0);
 	//Scaling
 	this.mScale = vec2.fromValues(1,1);
 	//Rotation in radians
 	this.mRotationInRad = 0.0;

    this.mZ = 0.0;
 }

 // Position getters and setters
Transform.prototype.setPosition = function(xPos,yPos) {
	this.setXPos(xPos); 
	this.setYPos(yPos);
};
Transform.prototype.setXPos = function(xPos){
	this.mPosition[0] = xPos;
};

Transform.prototype.setYPos = function(yPos) {
	this.mPosition[1] = yPos;
};

Transform.prototype.incXPosBy = function(delta){
	this.mPosition[0] += delta;
};

Transform.prototype.incYPosBy = function(delta){
	this.mPosition[1] += delta;
};

Transform.prototype.getPosition = function() { 
	return this.mPosition;
};

Transform.prototype.getXPos = function (){
	return this.mPosition[0];
};

Transform.prototype.getYPos = function (){
	return this.mPosition[1];
};

//Scale setters and getters
Transform.prototype.setSize = function(width,height){
	this.setWidth(width);
	this.setHeight(height);
};

Transform.prototype.getSize = function () { return this.mScale; };

Transform.prototype.setWidth = function(width) {
	this.mScale[0] = width;
};

Transform.prototype.setHeight = function(height){
	this.mScale[1] = height;
};

Transform.prototype.incSizeBy = function (delta) {
    this.incWidthBy(delta);
    this.incHeightBy(delta);
};

Transform.prototype.getWidth = function () { return this.mScale[0]; };
Transform.prototype.getHeight = function () { return this.mScale[1]; };
Transform.prototype.incWidthBy = function (delta) { this.mScale[0] += delta; };
Transform.prototype.incHeightBy = function (delta) { this.mScale[1] += delta; };

//Rotation setters and getters
Transform.prototype.setRotationInRad = function (rotationInRadians) {
	this.mRotationInRad = rotationInRadians;
	// Flip it around if you're rotating more than 360
	while (this.mRotationInRad > (2 * Math.PI)) {
        this.mRotationInRad -= (2 * Math.PI);
    }
};

Transform.prototype.setRotationInDegree = function (rotationInDegree) {
    this.setRotationInRad(rotationInDegree * Math.PI / 180.0);
};
Transform.prototype.incRotationByDegree = function (deltaDegree) {
    this.incRotationByRad(deltaDegree * Math.PI / 180.0);
};
Transform.prototype.incRotationByRad = function (deltaRad) {
    this.setRotationInRad(this.mRotationInRad + deltaRad);
};
Transform.prototype.getRotationInRad = function () {  return this.mRotationInRad; };
Transform.prototype.getRotationInDegree = function () { return this.mRotationInRad * 180.0 / Math.PI; };

//Return a TRS matrix
Transform.prototype.getXform = function () {
    // Creates a blank identity matrix
    var matrix = mat4.create();

    // The matrices that WebGL uses are transposed, thus the typical matrix
    // operations must be in reverse.

    // Step A: compute translation, for now z is the mHeight
    mat4.translate(matrix, matrix, this.get3DPosition());
    // Step B: concatenate with rotation.
    mat4.rotateZ(matrix, matrix, this.getRotationInRad());
    // Step C: concatenate with scaling
    mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));

    return matrix;
};

Transform.prototype.get3DPosition = function () {
    return vec3.fromValues(this.getXPos(), this.getYPos(), this.getZPos());
};

Transform.prototype.setZPos = function (d) { this.mZ = d; };
Transform.prototype.getZPos = function () { return this.mZ; };
Transform.prototype.incZPosBy = function (delta) { this.mZ += delta; };

Transform.prototype.cloneTo = function (aXform) {
    aXform.mPosition = vec2.clone(this.mPosition);
    aXform.mScale = vec2.clone(this.mScale);
    aXform.mZ = this.mZ;
    aXform.mRotationInRad = this.mRotationInRad;
};

/*
 * File: BoundingBox.js
 * Provides Axis Aligned Bounding Boxes
 */
/*jslint node: true, vars: true,  */
/*global gEngine: false, window: false, vec2: false */

"use strict";

/**
* @constructor
* @param {array} centerPos - Center of bounding box, length of 2.
* @param {number} w - Width of bounding box.
* @param {number} h - Height of bounding box.
*/
function BoundingBox(centerPos, w, h) {
	this.mLL = vec2.fromValues(0,0); // Lower left corner
	this.setBounds(centerPos, w, h);
}

BoundingBox.prototype.setBounds = function(centerPos, w, h){
	this.mWidth = w;
	this.mHeight = h;
	this.mLL[0] = centerPos[0] - (w/2);
	this.mLL[1] = centerPos[1] - (h/2);
};

/**
*	@enum eboundCollideStatus- Enumerated data type with values that identify the collision sides of a bounding box
*	@desc Each has only one non-zero bit. This allows enumerated values to be combined with the bitwise-or operator to represent a multisided collision.
* 	For example: if an object collides with both the top and left sides of a bounding box, the collision status will be eCollideLeft | eCollideTop = 4 | 1 = 5.
*/
BoundingBox.eboundCollideStatus = Object.freeze({
    eCollideLeft: 1,
    eCollideRight: 2,
    eCollideTop: 4,
    eCollideBottom: 8,
    eInside : 16,
    eOutside: 0
});

/**
* @function	Determines if the point given is inside the bounding box.
* @param {number} x - The point to compare to.
* @returns {boolean}
*/
BoundingBox.prototype.containsPoint = function (x, y) {
	return ((x > this.minX()) && (x<this.maxX()) && (y > this.minY()) && (y < this.maxY()));
};

/**
* @function	Determines if the other bounding box overlaps this one.
* @param {obj} otherBound - The other bounding box to compare to.
* @returns {boolean}
*/
BoundingBox.prototype.intersectsBound = function(otherBound){
	return ((this.minX() < otherBound.maxX()) &&
			(this.maxX() > otherBound.minX()) &&
			(this.minY() < otherBound.maxY()) &&
			(this.maxY() > otherBound.minY()));
};

/**
* @function Determines what sides the other bound box is overlapping on. Uses bitwise OR operator to evaluate status
* @param {obj} otherBound - The other bounding box to compare to.
* @returns {status} enum
*/
BoundingBox.prototype.boundCollideStatus = function(otherBound){
	var status = BoundingBox.eboundCollideStatus.eOutside;
	if (this.intersectsBound(otherBound)){
		if(otherBound.minX() < this.minX()){
			// Bitwise Or assignment
			status |= BoundingBox.eboundCollideStatus.eCollideLeft; // status = status or left
		}
		if (otherBound.maxX() > this.maxX())
            status |= BoundingBox.eboundCollideStatus.eCollideRight;
        if (otherBound.minY() < this.minY())
            status |= BoundingBox.eboundCollideStatus.eCollideBottom;
        if (otherBound.maxY() > this.maxY())
            status |= BoundingBox.eboundCollideStatus.eCollideTop;
        // if the bounds intersects and yet none of the sides overlaps
        // otherBound is completely inside thisBound
        if (status === BoundingBox.eboundCollideStatus.eOutside)
            status = BoundingBox.eboundCollideStatus.eInside;
	}
	return status;
};

BoundingBox.prototype.minX = function () { return this.mLL[0]; };
BoundingBox.prototype.maxX = function () { return this.mLL[0] + this.mWidth; };
BoundingBox.prototype.minY = function () { return this.mLL[1]; };
BoundingBox.prototype.maxY = function () { return this.mLL[1] + this.mHeight;};
/*
 * File: Interpolate.js
 * Provides functionality to interpolate values
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec3: false, BoundingBox: false, */

"use strict";

/**
* Class for interpolating values. During each update, the results are computed based on the rate.
* @constructor
* @param {number} value - Target for interpolation. Why is this both the current and final value?
* @param {number} cycles - Duration, how many cycles it should take for a value to change to final
* @param {number} rate - Stiffness of the change per update. The rate at which the value should change at each cycle
*/
function Interpolate(value, cycles, rate){
	this.mCurrentValue = value;
	this.mFinalValue = value;
	this.mCycles = cycles;
	this.mRate = rate;

	// If there is a new value to interpolate to, number of cycles left for interpolation
	this.mCyclesLeft = 0;
}

/**
* The current value is the currentValue plus the rate, times the difference between the final and current value.
* The subclass will overwrite this for non-scalar values.
* @func
*/
Interpolate.prototype._interpolateValue = function() {
	this.mCurrentValue = this.mCurrentValue + this.mRate * (this.mFinalValue - this.mCurrentValue);
};

Interpolate.prototype.getValue = function(){ return this.mCurrentValue;};

/**
* Change how interpolation occurs each update.
* @func
* @param {number} stiffness - Changes the rate the value is changed each cycle, between 0 and 1.
* @param {number} duration - Changes the number of cycles.
*/
Interpolate.prototype.configInterpolation = function(stiffness, duration){
	this.mRate = stiffness;
	this.mCycles = duration;
};

Interpolate.prototype.setFinalValue = function(v){
	this.mFinalValue = v;
	this.mCyclesLeft = this.mCycles;
};

/**
* If the cyclesLeft are less than 0, exit.
* Else, decrement the cyclesLeft, if its 0 set the currentValue to the finalValue
* Else, interpolate the value
* @func
*/
Interpolate.prototype.updateInterpolation = function(){
	if(this.mCyclesLeft <= 0){
		return;
	}
	this.mCyclesLeft--;

	if(this.mCyclesLeft === 0){
		this.mCurrentValue = this.mFinalValue;
	} else {
		this._interpolateValue();
	}
};
/*
 * File: InterpolateVec2.js
 * Provides functionality to interpolate vec2 values, as many camera params are vec2
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec2: false, Interpolate: false, */

"use strict";

/**
* Class for interpolating vec2 values. Calls Interpolate.js
* @constructor
* @param {number} value - Target for interpolation. Why is this both the current and final value?
* @param {number} cycles - Duration, how many cycles it should take for a value to change to final
* @param {number} rate - Stiffness of the change per update. The rate at which the value should change at each cycle
*/
function InterpolateVec2(value, cycle, rate) {
	Interpolate.call(this, value, cycle, rate);
}
gEngine.Core.inheritPrototype(InterpolateVec2, Interpolate);

/**
* Computes for each of the x and y components of vec2 with identical calculations as the _interpolateValue() function in the Interpolate object
* @func
*/
InterpolateVec2.prototype._interpolateValue = function() {
	vec2.lerp(this.mCurrentValue, this.mCurrentValue, this.mFinalValue, this.mRate);
};
/*
 * File: ShakePosition.js
 * Abstracts shaking of positions
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec3: false, BoundingBox: false, */

"use strict";

/**
* Shaking is in relation to the camera center position
* @constructor
* @param {number} xDelta - Severity of the shake in x direction
* @param {number} yDelta - Severity of the shake in the y direction
* @param {number} shakeFrequency - How rapidly the camera shakes
* @param {number} shakeDuration - How long the shake lasts, number of cycles to complete the shake
*/
function ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration){
	this.mXMag = xDelta;
	this.mYMag = yDelta;
	this.mCycles = shakeDuration;
	this.mOmega = shakeFrequency * 2 * Math.PI; // converts to radians
	this.mNumCyclesLeft = shakeDuration;
}

/**
* The frac variable is a ratio of the number of cycles left in the shake (mNumCyclesLeft) to the total number of cycles the camera should shake (mCycles). 
* This value decreases from 1 to 0 as mNumCyclesLeft decreases from mCycles to 0.
* @func
*/
ShakePosition.prototype._nextDampedHarmonic = function() {
	var frac = this.mNumCyclesLeft / this.mCycles;
	return frac * frac * Math.cos((1-frac) * this.mOmega);
};

ShakePosition.prototype.shakeDone = function() {
	return (this.mNumCyclesLeft <= 0);
};

/**
* For the same mNumCyclesLeft, the call to the _nextDampedHarmonic() will return the same value.
* @func
*/
ShakePosition.prototype.getShakeResults = function(){
	this.mNumCyclesLeft--;
	var c = [];
	var fx = 0;
	var fy = 0;
	if(!this.shakeDone()){
		var v = this._nextDampedHarmonic();
		fx = (Math.random() > 0.5) ? -v : v;
		fy = (Math.random() > 0.5) ? -v : v;
	}
	c[0] = this.mXMag * fx;
	c[1] = this.mYMag * fy;
	return c;
};
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
/*
* Renderable Constructor
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false,
    gSquareVertexBuffer: false, document: false, gEngine: false,
    Transform: false,*/
"use strict";
/**
* @constructor
* @param {shader} shader - OLD - Compiled shader from SimpleShader.js
* @classdesc mShader - refers to default constColorShader by default
*/
function Renderable (){
	this.mShader = gEngine.DefaultResources.getConstColorShader();
	/**
	* Transform operator for the Renderable
	*/
	this.mXform = new Transform(); 
	/**
	* Color for fragment shader
	*/
	this.mColor = [1, 1, 1, 1]; 
}
/**
* Get the canvas, activate the shader, load the transforms, and then draw on canvas
* @function
* @param {object} aCamera - a Camera object to be passed to the shader. The getVPMatrix() will be called there. //OLD: vpMatrix - View Projection Matrix
*/
Renderable.prototype.draw = function(aCamera){
	//gets the web context
	var gl = gEngine.Core.getGL();
	//activate the shader before you draw
	this.mShader.activateShader(this.mColor, aCamera);
	// vertices of the unit square are processed by the vertex shader
	// Get the transforms from the Renderable's Transform first
	this.mShader.loadObjectTransform(this.mXform.getXform());
	//(typeOfDrawing, offset, count)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0 , 4);
};

Renderable.prototype.getXform = function(){return this.mXform;};
Renderable.prototype.setColor = function(color){this.mColor = color;};
Renderable.prototype.getColor = function(){return this.mColor;};
Renderable.prototype._setShader = function(s){ this.mShader = s;};

/**
* Allows Renderables to swap their shaders, used in ShadowCaster and ShadowReceiver
* @function
* @param {shader} shader - The shader that will be swapped in. Returns the old shader.
*/
Renderable.prototype.swapShader = function (s) {
    var out = this.mShader;
    this.mShader = s;
    return out;
};

Renderable.prototype.update = function () {};



/*
* Texture Renderable Constructor
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false,
    gSquareVertexBuffer: false, document: false, gEngine: false,
    Transform: false, Renderable: false*/
"use strict";
/**
* @constructor
* @param {path} myTexture - path to the file that contains the texture image
* @classdesc A subclass of Renderable.
*/
function TextureRenderable(myTexture){
	// calls the superclass, sets the default shader,transform, and color
	Renderable.call(this);
    Renderable.prototype.setColor.call(this, [1, 1, 1, 0]);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getTextureShader());
    this.mTexture = null;
    // these two instance variables are to cache texture information
    // for supporting per-pixel accurate collision
    this.mTextureInfo = null;
    this.mColorArray = null;
    // defined for subclass to override
    this.mTexWidth = 0;
    this.mTexHeight = 0;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
    this.setTexture(myTexture);
}

gEngine.Core.inheritPrototype(TextureRenderable, Renderable);

TextureRenderable.prototype.draw = function(aCamera){
	gEngine.Textures.activateTexture(this.mTexture);
	Renderable.prototype.draw.call(this, aCamera);
};

TextureRenderable.prototype.getTexture = function(){return this.mTexture;};
TextureRenderable.prototype.setTexture = function (newTexture) {
    this.mTexture = newTexture;
    this.mTextureInfo = gEngine.Textures.getTextureInfo(newTexture);
    this.mColorArray = null;
    this.mTexWidth = this.mTextureInfo.mWidth;
    this.mTexHeight = this.mTextureInfo.mHeight;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
};


/* File: TextureRenderable_PixelCollision.js
 *
 * Implements the pixelTouches() and related supporting functions of TextureRenderable
 */

/*jslint node: true, vars: true */
/*global gEngine, TextureRenderable, vec2 */

"use strict";

TextureRenderable.prototype.setColorArray = function () {
    if (this.mColorArray === null)
        this.mColorArray = gEngine.Textures.getColorArray(this.mTexture);
};
/**
* Private method for getting the alpha value of a given pixel coord. In Texture space.
* @func
* @param{number} x - x position of pixel in texture
* @param{number} y - y position of pixel in texture
*/
TextureRenderable.prototype._pixelAlphaValue = function(x,y){
	// offset by the current element in the sprite sheet
	y += this.mTexBottomIndex;
    x += this.mTexLeftIndex;
	x = x * 4;
	y = y * 4;
	// mColorArray is a one-dimensional array where colors of pixels are stored as four floats and organized by rows
	return this.mColorArray[(y*this.mTextureInfo.mWidth) + x + 3];
};
/**
* Given a pixel (i,j) compute the world coordinate position of that pixel.
* The returned value of returnWCPos is a displacement from the object’s center position along the xDirDisp and yDirDisp vectors, the scaled xDir and yDir vectors.
* @func
* @param{array} returnWCPos - The world position of that pixel, an array.
* @param{number} i - x position of pixel in texture
* @param{number} j - y position of pixel in texture
* @param{vec2} xDir - Normalized vector component
* @param{vec2} yDir - Normalized vector component
*/
TextureRenderable.prototype._indexToWCPosition = function(returnWCPos, i, j, xDir, yDir){
	var x = i * this.mXform.getWidth() / (this.mTexWidth - 1);
	var y = j * this.mXform.getHeight() / (this.mTexHeight - 1);
	var xDisp = x - (this.mXform.getWidth() * 0.5);
    var yDisp = y - (this.mXform.getHeight() * 0.5);
    var xDirDisp = [];
    var yDirDisp = [];

    vec2.scale(xDirDisp, xDir, xDisp);
    vec2.scale(yDirDisp, yDir, yDisp);
    vec2.add(returnWCPos, this.mXform.getPosition(), xDirDisp);
    vec2.add(returnWCPos, returnWCPos, yDirDisp);
};

/**
* Private method for converting from WC position to texture pixel indices
* @function
* @param{array} returnIndex - Array of the index we're changing
* @param{array} wcPos - The world coordinate position we're taking from
* @param{vec2} xDir - Rotated normalized vector component
* @param{vec2} yDir - Rotated normalized vector component
*/
TextureRenderable.prototype._wcPositionToIndex = function (returnIndex, wcPos, xDir, yDir) {
    // use wcPos to compute the corresponding returnIndex[0 and 1]
    var delta = [];
    vec2.sub(delta, wcPos, this.mXform.getPosition());
	var xDisp = vec2.dot(delta, xDir);
    var yDisp = vec2.dot(delta, yDir);
    returnIndex[0] = this.mTexWidth  * (xDisp / this.mXform.getWidth());
    returnIndex[1] = this.mTexHeight * (yDisp / this.mXform.getHeight());
    // recall that xForm.getPosition() returns center, yet Texture origin is at lower-left corner!
    returnIndex[0] += this.mTexWidth / 2;
    returnIndex[1] += this.mTexHeight / 2;

    returnIndex[0] = Math.floor(returnIndex[0]);
    returnIndex[1] = Math.floor(returnIndex[1]);
};

/**
* Determines if 2 Textures are touching on the non-alpha pixels. Note wcTouchPos is only one of potentialy many colliding points.
* @function
* @param{array} other - The other texture renderable, This one (the one calling this func) is the smaller one.
* @param{array} wcTouchPos - The world coordinate position we're taking from
*/
TextureRenderable.prototype.pixelTouches = function(other, wcTouchPos) {
    var pixelTouch = false;
    var xIndex = 0, yIndex;
    var otherIndex = [0, 0];

	var xDir = [1, 0];
    var yDir = [0, 1];
    var otherXDir = [1, 0];
    var otherYDir = [0, 1];
    vec2.rotate(xDir, xDir, this.mXform.getRotationInRad());
    vec2.rotate(yDir, yDir, this.mXform.getRotationInRad());
    vec2.rotate(otherXDir, otherXDir, other.mXform.getRotationInRad());
    vec2.rotate(otherYDir, otherYDir, other.mXform.getRotationInRad())

	// go across the width of the texture
    while ((!pixelTouch) && (xIndex < this.mTexWidth)) {
        yIndex = 0;
		// go up the height of the texture
        while ((!pixelTouch) && (yIndex < this.mTexHeight)) {
			// if the pixel there is opaque
            if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
				// Get the World Coord position for that pixel, this changes wcTouchPos
                this._indexToWCPosition(wcTouchPos, xIndex, yIndex, xDir, yDir);
				// Get the index from the wcTouchPos, this changes otherIndex
                other._wcPositionToIndex(otherIndex, wcTouchPos, otherXDir, otherYDir);
				// if the other index is inside the texture of the other
                if ((otherIndex[0] > 0) && (otherIndex[0] < other.mTexWidth) &&
                    (otherIndex[1] > 0) && (otherIndex[1] < other.mTexHeight)) {
					// set pixelTouch to the boolean of value of if the alpha of the other index is greater than 0.
					// if this is true, exits the loop because of the (!pixelTouch checks)
                    pixelTouch = other._pixelAlphaValue(otherIndex[0], otherIndex[1]) > 0;
                }
            }
            yIndex++;
        }
        xIndex++;
    }
    return pixelTouch;
};
/*
* SpriteRenderable Renderable Constructor
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false,
    gSquareVertexBuffer: false, document: false, gEngine: false,
    TextureRenderable: false, Renderable: false*/
"use strict";
/**
* @constructor
* @param {path} myTexture - path to the file that contains the texture image
* @classdesc A subclass of TextureRenderable.
*/
function SpriteRenderable(myTexture){
	TextureRenderable.call(this, myTexture);
	Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getSpriteShader());

	this.mTexLeft = 0.0;   // bounds of texture coord (0 is left, 1 is right)
    this.mTexRight = 1.0;  //
    this.mTexTop = 1.0;    // 1 is top and 0 is bottom of image
    this.mTexBottom = 0.0; //

    this._setTexInfo(); // Defines the dimension of the sprite element
}
gEngine.Core.inheritPrototype(SpriteRenderable, TextureRenderable);

// The expected texture coordinate array is an array of 8 floats where:
/*
* [0][1]: is u/v coordinate of Top-Right
* [2] [3]: is u/v coordinate of Top-Left
* [4] [5]: is u/v coordinate of Bottom-Right
* [6] [7]: is u/v coordinate of Bottom-Left
*/
/**
* Define an enumerated data type with values that identify corresponding offset positions of a WebGL texture coordinate specification array.
* @namespace
* @property {number}  eLeft - [0][1]: is u/v coordinate of Top-Right
* @property {number}  eRight - [2] [3]: is u/v coordinate of Top-Left
* @property {number}  eTop - [4] [5]: is u/v coordinate of Bottom-Right
* @property {number}  eBottom - [6] [7]: is u/v coordinate of Bottom-Left
*/
SpriteRenderable.eTexCoordArray = Object.freeze({
	eLeft: 2,
	eRight: 0,
	eTop: 1,
	eBottom: 5
});

/**
* Specifies a sprite sheet element’s uv values in UV/texture coordinate space (normalized between 0 to 1)
* @function
* @param{number} left - left bound
* @param{number} right - right bound
* @param{number} bottom - bottom bound
* @param{number} top - top bound
*/
SpriteRenderable.prototype.setElementUVCoordinate = function (left, right, bottom, top) {
    this.mTexLeft = left;
    this.mTexRight = right;
    this.mTexBottom = bottom;
    this.mTexTop = top;
    this._setTexInfo(); // Defines the dimension of the sprite element for the new
};
/**
* Specifies a sprite sheet element’s uv values with pixel positions (which is converted to uv values/texture coordinates).
* @function
* @param{number} left - left bound
* @param{number} right - right bound
* @param{number} bottom - bottom bound
* @param{number} top - top bound
*/
SpriteRenderable.prototype.setElementPixelPositions = function (left, right, bottom, top) {
    var texInfo = gEngine.ResourceMap.retrieveAsset(this.mTexture);
    // entire image width, height
    var imageW = texInfo.mWidth;
    var imageH = texInfo.mHeight;

    this.mTexLeft = left / imageW;
    this.mTexRight = right / imageW;
    this.mTexBottom = bottom / imageH;
    this.mTexTop = top / imageH;
    this._setTexInfo(); // Defines the dimension of the sprite element for the new
};

SpriteRenderable.prototype.getElementUVCoordinateArray = function () {
    return [
        this.mTexRight,  this.mTexTop, // x,y of top-right
        this.mTexLeft,   this.mTexTop,
        this.mTexRight,  this.mTexBottom,
        this.mTexLeft,   this.mTexBottom
    ];
};
/**
* Override the draw() function to load the specific texture coordinates values into WebGL context before the actual drawing.
* Sets then activates the current texture
* @function
* @param{color} pixelColor - color to draw
* @param{matrix} vpMatrix - View Projection Matrix
*/
SpriteRenderable.prototype.draw = function(pixelColor, aCamera){
	this.mShader.setTextureCoordinate(this.getElementUVCoordinateArray());
	TextureRenderable.prototype.draw.call(this, pixelColor, aCamera);
};
/* File: SpriteRenderable_PixelCollision.js
 *
 * implements the _setTexInfo() function to support per-pixel collision for
 * sprite elements
 */

/*jslint node: true, vars: true */
/*global gEngine, SpriteRenderable */

"use strict";
/**
* @func
* Overrides the current texture vars in TextureRenderable, to associate these vars with the current sprite element.
*/
SpriteRenderable.prototype._setTexInfo = function () {
    var imageW = this.mTextureInfo.mWidth;
    var imageH = this.mTextureInfo.mHeight;
		// Gets the left and bottom indices for the current sprite element
    this.mTexLeftIndex = this.mTexLeft * imageW;
    this.mTexBottomIndex = this.mTexBottom * imageH;
		// Sets the texture width and height to be the w and height of the current sprite element
    this.mTexWidth = ((this.mTexRight - this.mTexLeft) * imageW) + 1;
    this.mTexHeight = ((this.mTexTop - this.mTexBottom) * imageH) + 1;
};
/*
* SpriteAnimateRenderable Class
*/
/*jslint node: true, vars: true, evil: true*/
/*global SimpleShader: false, Renderable: false, SpriteRenderable: false, gEngine: false
*
*/
"use strict";
/**
* Derived from SpriteRenderable, specifies animation of a sprite. All coordinates are in texture coordinate (UV between 0 to 1).
* The first set, including mFirstElmLeft, mElmTop, and so on, defines the location and dimensions of each sprite element and the number of elements in the animation. This information can be used to accurately compute the texture coordinates for each sprite element when the elements are ordered by rows and columns. Note that all coordinates are in Texture Space (0 to 1).
* The second set stores information on how to animate: the mAnimationType of left, right, or swing; and how many mUpdateInterval time to wait before advancing to the next sprite element to control the speed of the animation. This information can be changed during runtime to reverse a character’s movement, loop the character’s movement, or speed up or slow down the movement.
* The third set, mCurrentAnimAdvance and mCurrentElm, describes the current animation state, which frame, and the direction of the animation. Both of these variables are in units of element counts, are not accessible by the game programmer, and are used internally to compute the next sprite element for display.
* @class
* @param {texture} myTexture - Path to sprite sheet
*/
function SpriteAnimateRenderable(myTexture){
	SpriteRenderable.call(this, myTexture);
	Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getSpriteShader());

	// Info on the sprite element:
	/** Left corner of the image*/
	this.mFirstElmLeft = 0.0;
	/** Top corner of the image*/
	this.mElmTop = 1.0;
	/** Default sprite element size is the entire image*/
	this.mElmWidth = 1.0;
	this.mElmHeight = 1.0;
	this.mWidthPadding = 0.0;
	/** Number of elements in an animation*/
	this.mNumsElems = 1;

	this.mAnimationType = SpriteAnimateRenderable.eAnimationType.eAnimateRight;
	/** How often to advance */
	this.mUpdateInterval = 1;

	/** Current animation state */
    this.mCurrentAnimAdvance = -1;
    this.mCurrentElm = 0;

    this._initAnimation();
}

gEngine.Core.inheritPrototype(SpriteAnimateRenderable, SpriteRenderable);

SpriteAnimateRenderable.prototype.setAnimationType = function(animationType){
	this.mAnimationType = animationType;
	this.mCurrentAnimAdvance = -1;
	this.mCurrentElm = 0;
	this._initAnimation();
};

SpriteAnimateRenderable.prototype._initAnimation = function(){
	this.mCurrentTick = 0;
	switch(this.mAnimationType){
		case SpriteAnimateRenderable.eAnimationType.eAnimateRight:
            this.mCurrentElm = 0;
            this.mCurrentAnimAdvance = 1; // either 1 or -1
            break;
		case SpriteAnimateRenderable.eAnimationType.eAnimateSwing:
			this.mCurrentAnimAdvance = -1 * this.mCurrentAnimAdvance;
			this.mCurrentElm += 2 * this.mCurrentAnimAdvance;
			break;
		case SpriteAnimateRenderable.eAnimationType.eAnimateLeft:
			this.mCurrentElm = this.mNumElem - 1;
			this.mCurrentAnimAdvance = -1; // either 1 or -1
			break;
	}
	this._setSpriteElement();
};
/**
* Sets the sprite element in the sheet by computing the left (u value) from the current element factoring in width and padding.
* From this, the right, bottom and top uv values can be determined. The function then calls setElementUVCoordinate from SpriteRenderable
* @function
*/
SpriteAnimateRenderable.prototype._setSpriteElement = function() {
	var left = this.mFirstElmLeft + (this.mCurrentElm * (this.mElmWidth + this.mWidthPadding));
	var right = left + this.mElmWidth;
	var bottom = this.mElmTop - this.mElmHeight;
	var top = this.mElmTop;

	SpriteRenderable.prototype.setElementUVCoordinate.call(this, left, left+this.mElmWidth,
		this.mElmTop-this.mElmHeight, this.mElmTop);
};

/**
* Assumption: first sprite in an animation is always the left-most element.
* Animations are always organized along the same row.
* @namespace
* @property {number}  eAnimateRight - Animate from left to right, then restart to left
* @property {number}  eAnimateLeft - Animate from right to left, then restart to right
* @property {number}  eAnimateSwing - Animate left to right then animate backwards
*/
SpriteAnimateRenderable.eAnimationType = Object.freeze({
	eAnimateRight: 0, // Animate from left to right, then restart to left
	eAnimateLeft: 1, // Animate from right to left, then restart to right
	eAnimateSwing: 2 // Animate left to right then animate backwards
});
/**
* The inputs of the setSpriteSequence() function are in pixels and are converted to texture (uv) coordinates by dividing by the width and height of the image.
* @function
* @param {pixels} topPixel - Offset from top
* @param {pixels} leftPixel - offset from left?? Named leftPixel in code example, rightPixel in book. DISCREPANCY
* @param {pixels} mElmWidthInPixel - Width of the element in pixels.
* @param {pixels} mElmHeightInPixel - Height of the element in pixels.
* @param {pixels} numElements - Number of elements in the animation/sequence.
* @param {pixels} wPaddingInPixel - Left/Right padding in pixels.
*/
SpriteAnimateRenderable.prototype.setSpriteSequence = function(topPixel, leftPixel, elmWidthInPixel, elmHeightInPixel, numElements, wPaddingInPixel){
	var texInfo = gEngine.ResourceMap.retrieveAsset(this.mTexture);
	// entire image width and height
	var imageW = texInfo.mWidth;
	var imageH = texInfo.mHeight;

	this.mNumElems = numElements;
	this.mFirstElmLeft = leftPixel / imageW;
	this.mElmTop = topPixel / imageH;
	this.mElmWidth = elmWidthInPixel / imageW;
	this.mElmHeight = elmHeightInPixel / imageH;
	this.mWidthPadding = wPaddingInPixel / imageW;

	this._initAnimation();
};
/**
* Set the speed of the animation, how often the next frame will appear.
* @function
* @param {number} tickInterval - number of update calls before advancing animation
*/
SpriteAnimateRenderable.prototype.setAnimationSpeed = function(tickInterval){
	// number of update calls before advancing animation
	this.mUpdateInterval = tickInterval;
};

SpriteAnimateRenderable.prototype.incAnimationSpeed = function(deltaInterval) {
    // number of update calls before advancing animation
    this.mUpdateInterval += deltaInterval;   // how often to advance
};
/**
* Advances the animation for each game loop update. The mCurrentTick counter is incremented on each call, when the number of ticks reaches
* the mUpdateInterval value, the animation is reinitialized with _initAnimation(). The game engine architecture ensures the updateAnimation() function calls are kMPF millisecond apart.
* @function
*/
SpriteAnimateRenderable.prototype.updateAnimation = function(){
	this.mCurrentTick++;
	if(this.mCurrentTick >= this.mUpdateInterval){
		this.mCurrentTick = 0;
		this.mCurrentElm += this.mCurrentAnimAdvance;
		if((this.mCurrentElm >= 0) && (this.mCurrentElm < this.mNumElems)){
			this._setSpriteElement();
		} else {
			this._initAnimation();
		}
	}
};
/*
 * File: FontRenderable.js
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false, SpriteRenderable: false */

"use strict";
/**
* @class
* @params{string} aString - String to render in the game.
* @classdesc gets the default font, creates a new SpriteRenderable and a new Transform.
*/
function FontRenderable(aString) {
    this.mFont = gEngine.DefaultResources.getDefaultFont();
    this.mOneChar = new SpriteRenderable(this.mFont + ".png");
    this.mXform = new Transform(); // transform that moves this object around
    this.mText = aString;
}

/** @function Parses and draws each character in string via the mOneChar variable */
FontRenderable.prototype.draw = function(vpMatrix){
	var widthOfOneChar = this.mXform.getWidth() / this.mText.length;
	var heightOfOneChar = this.mXform.getHeight();
	var yPos = this.mXform.getYPos();

	// center position of first char
	var xPos = this.mXform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);
	var charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
	for(charIndex = 0; charIndex < this.mText.length; charIndex++){
		aChar = this.mText.charCodeAt(charIndex);
		charInfo = gEngine.Fonts.getCharInfo(this.mFont, aChar);

		// set the texture coordinate
		this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft, charInfo.mTexCoordRight,
			charInfo.mTexCoordBottom, charInfo.mTexCoordTop);

		// now the size of the char
		xSize = widthOfOneChar * charInfo.mCharWidth;
		ySize = heightOfOneChar * charInfo.mCharHeight;
		this.mOneChar.getXform().setSize(xSize, ySize);

		// how much to offset from the center
		xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
		yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;

		this.mOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);

        this.mOneChar.draw(vpMatrix);

        xPos += widthOfOneChar;
	}
};

FontRenderable.prototype.getXform = function() { return this.mXform; };
FontRenderable.prototype.getText = function() { return this.mText; };
FontRenderable.prototype.setText = function(t) {
    this.mText = t;
    this.setTextHeight(this.getXform().getHeight());
};

FontRenderable.prototype.getFont = function() { return this.mFont; };
FontRenderable.prototype.setFont = function(f) {
    this.mFont = f;
    this.mOneChar.setTexture(this.mFont + ".png");
};

FontRenderable.prototype.setColor = function(c){ this.mOneChar.setColor(c); };
FontRenderable.prototype.getColor = function() {
    return this.mOneChar.getColor();
};

/** @function This is setting the size of the Font, which is different than the xForm size.
* Think word doc font size vs distoring image of text.
* The width of the entire message to be drawn is automatically computed based on
* the message string length and maintaining the character width to height aspect ratio.
*/
FontRenderable.prototype.setTextHeight = function(h){
	// this is for "A"
	var charInfo = gEngine.Fonts.getCharInfo(this.mFont, "A".charCodeAt(0));
	var w = h * charInfo.mCharAspectRatio;
	this.getXform().setSize(w * this.mText.length, h);
};

FontRenderable.prototype.update = function () {};
/*
 * File: LineRenderable.js
 * Renderable objects for lines
 */

/*jslint node: true, vars: true */
/*global gEngine, Renderable, vec2*/
"use strict";

// p1, p2: either both there, or none
function LineRenderable(x1, y1, x2, y2) {
    Renderable.call(this);
    Renderable.prototype.setColor.call(this, [0, 0, 0, 1]);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLineShader());

    this.mPointSize = 1;
    this.mDrawVertices = false;
    this.mShowLine = true;

    this.mP1 = vec2.fromValues(0, 0);
    this.mP2 = vec2.fromValues(0, 0);

    if (x1 !== "undefined") {
        this.setVertices(x1, y1, x2, y2);
    }
}
gEngine.Core.inheritPrototype(LineRenderable, Renderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
LineRenderable.prototype.draw = function (aCamera) {
    this.mShader.setPointSize(this.mPointSize);
    // Draw line instead of triangle!
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, aCamera);  // always activate the shader first!

    var sx = this.mP1[0] - this.mP2[0];
    var sy = this.mP1[1] - this.mP2[1];
    var cx = this.mP1[0] - sx / 2;
    var cy = this.mP1[1] - sy / 2;
    var xf = this.getXform();
    xf.setSize(sx, sy);
    xf.setPosition(cx, cy);

    this.mShader.loadObjectTransform(this.mXform.getXform());
    if (this.mShowLine) {
        gl.drawArrays(gl.LINE_STRIP, 0, 2);
    }
    if (!this.mShowLine || this.mDrawVertices) {
        gl.drawArrays(gl.POINTS, 0, 2);
    }
};

LineRenderable.prototype.setDrawVertices = function (s) { this.mDrawVertices = s; };
LineRenderable.prototype.setShowLine = function (s) { this.mShowLine = s; };
LineRenderable.prototype.setPointSize = function (s) { this.mPointSize = s; };

LineRenderable.prototype.setVertices = function (x1, y1, x2, y2) {
    this.setFirstVertex(x1, y1);
    this.setSecondVertex(x2, y2);
};

LineRenderable.prototype.setFirstVertex = function (x, y) {
    this.mP1[0] = x;
    this.mP1[1] = y;
};

LineRenderable.prototype.setSecondVertex = function (x, y) {
    this.mP2[0] = x;
    this.mP2[1] = y;
};

//--- end of Public Methods
//</editor-fold>
/*
 * File: LightRenderable.js
 * Renderable for light
 */
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, aCamera: false, SpriteShader: false,
    vec3: false, vec4: false, gEngine: false,*/
/**
* Subclass from SpriteAnimateRenderable, supporting interaction with lights
* @class
*/
 function LightRenderable(myTexture){
 	SpriteAnimateRenderable.call(this, myTexture);
 	Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLightShader());

 	this.mLights = [];
 }
 gEngine.Core.inheritPrototype(LightRenderable, SpriteAnimateRenderable);

LightRenderable.prototype.draw = function(aCamera){
	this.mShader.setLights(this.mLights);
	SpriteAnimateRenderable.prototype.draw.call(this, aCamera);
};

LightRenderable.prototype.getLight = function(index){
	return this.mLights[index];
};
LightRenderable.prototype.addLight = function(l){
	this.mLights.push(l);
};

LightRenderable.prototype.numLights = function () {
    return this.mLights.length;
};

LightRenderable.prototype.getLightAt = function (index) {
    return this.mLights[index];
};
/*
 * File: IllumRenderable.js
 *
 * LightRenderable with light illumination
 */

/*jslint node: true, vars: true */
/*global gEngine, Renderable, LightRenderable, Material*/

"use strict";

/**
*
* Subclass from LightRenderable, interface for supporting normal maps.
* Normal maps texture coordinates will reporduce the corresponding sprite sheet.
* Normal maps must be based on the sprite sheet.
* @class
*/
function IllumRenderable(myTexture, myNormalMap){
	LightRenderable.call(this, myTexture);
	Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getIllumShader());

	this.mNormalMap = myNormalMap;
	this.mMaterial = new Material();
}
gEngine.Core.inheritPrototype(IllumRenderable, LightRenderable);

/**
*
* Normal map texture coordinates are copied from corresponding sprite sheet.
* @func
*/
IllumRenderable.prototype.draw = function(aCamera){
	gEngine.Textures.activateNormalMap(this.mNormalMap);
	this.mShader.setMaterialAndCameraPos(this.mMaterial, aCamera.getPosInPixelSpace());
	LightRenderable.prototype.draw.call(this, aCamera);
};

IllumRenderable.prototype.getMaterial = function() { return this.mMaterial; };
/*
 * File: ParticleRenderable.js
 *
 * ParticleRenderable specifically for particles (additive blending)
 */
/*jslint node: true, vars: true, white: true */
/*global gEngine, TextureRenderable, Renderable */

// Constructor and object definition
"use strict";

/**
* Particle Renderable derived from TextureRenderale
* @class
*/
function ParticleRenderable(myTexture) {
    TextureRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getParticleShader());
}
gEngine.Core.inheritPrototype(ParticleRenderable, TextureRenderable);
/*
 * File: ShadowCaster.js
 * Renders a colored image representing the shadowCaster on the receiver
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Renderable, SpriteRenderable, Light, Transform, vec3, Math */

"use strict";

/**
* A ShadowCaster object represents a Renderable game object that will cast shadow on a shadow receiver, another Renderable game object.
* @param {GameObject} shadowCaster - must be GameObject referencing at least a LightRenderable
* @param {GameObject} shadowReceiver - must be GameObject referencing at least a SpriteRenderable
* @class
*/
function ShadowCaster(shadowCaster, shadowReceiver){
	this.mShadowCaster = shadowCaster;
	this.mShadowReceiver = shadowReceiver;
	this.mCasterShader = gEngine.DefaultResources.getShadowCasterShader();
	this.mShadowColor = [0, 0, 0, 0.2];
    this.mSaveXform = new Transform();

    this.kCasterMaxScale = 3;// maximum size a caster will be scaled
    this.kVerySmall = 0.001;    //
    this.kDistanceFudge = 0.01; // Ensure shadow caster geometry is not at the exact same depth as receiver
    this.kReceiverDistanceFudge = 0.6; // Reduce the projection size increase of the caster geometry
}

ShadowCaster.prototype.draw = function(aCamera) {
    // loop through each light in this array, if shadow casting on the light is on
    // compute the proper shadow offset
    var casterRenderable = this.mShadowCaster.getRenderable();
    this.mShadowCaster.getXform().cloneTo(this.mSaveXform);
    var s = casterRenderable.swapShader(this.mCasterShader);
    var c = casterRenderable.getColor();
    casterRenderable.setColor(this.mShadowColor);
    // casterRenderable is the Renderable object that is actually casting the shadow.
    var l, lgt;
    for (l = 0; l < casterRenderable.numLights(); l++) {
        lgt = casterRenderable.getLightAt(l);
        if (lgt.isLightOn() && lgt.isLightCastShadow()) {
            this.mSaveXform.cloneTo(this.mShadowCaster.getXform());
            if (this._computeShadowGeometry(lgt)) {
                this.mCasterShader.setLight(lgt);
                SpriteRenderable.prototype.draw.call(casterRenderable, aCamera);
            }
        }
    }
    this.mSaveXform.cloneTo(this.mShadowCaster.getXform());
    casterRenderable.swapShader(s);
    casterRenderable.setColor(c);
};

ShadowCaster.prototype.setShadowColor = function (c) {
    this.mShadowColor = c;
};

/*
* Compute and set the shadow caster geometry transform, cxf, by using aLight to project the shadow caster onto the shadow receiver
* @func
* @param {light} aLight - One of the lights, being looped through
*/
ShadowCaster.prototype._computeShadowGeometry = function(aLight) {
    // Remember that z-value determines front/back
    //      The camera is located a z=some value, looking towards z=0
    //      The larger the z-value (larger height value) the closer to the camera
    //      If z > camera.Z, will not be visile

    // supports casting to the back of a receiver (if receiver is transparent)
    // then you can see shadow from the camera
    // this means, even when:
    //      1. caster is lower than receiver
    //      2. light is lower than the caster
    // it is still possible to cast shadow on receiver

    var cxf = this.mShadowCaster.getXform();
    var rxf = this.mShadowReceiver.getXform();
    // vector from light to caster
    var lgtToCaster = vec3.create();
    var lgtToReceiverZ;
    var receiverToCasterZ;
    var distToCaster, distToReceiver;  // measured along the lgtToCaster vector
    var scale;
    var offset = vec3.fromValues(0, 0, 0);

    // handle directional light
    receiverToCasterZ = rxf.getZPos() - cxf.getZPos();
    if (aLight.getLightType() === Light.eLightType.eDirectionalLight) {
        if (((Math.abs(aLight.getDirection())[2]) < this.kVerySmall) || ((receiverToCasterZ * (aLight.getDirection())[2]) < 0)) {
            return false;   // direction light casting side way or
                            // caster and receiver on different sides of light in Z
        }
        vec3.copy(lgtToCaster, aLight.getDirection());
        vec3.normalize(lgtToCaster, lgtToCaster);

        distToReceiver = Math.abs(receiverToCasterZ / lgtToCaster[2]);  // distance measured along lgtToCaster
        scale = Math.abs(1/lgtToCaster[2]);
    // handle point and spotlight
    } else {
        vec3.sub(lgtToCaster, cxf.get3DPosition(), aLight.getPosition());
        lgtToReceiverZ = rxf.getZPos() - (aLight.getPosition())[2];

        if ((lgtToReceiverZ * lgtToCaster[2]) < 0) {
            return false;  // caster and receiver on different sides of light in Z
        }

        if ((Math.abs(lgtToReceiverZ) < this.kVerySmall) || ((Math.abs(lgtToCaster[2]) < this.kVerySmall))) {
            // almost the same Z, can't see shadow
            return false;
        }

        distToCaster = vec3.length(lgtToCaster);
        vec3.scale(lgtToCaster, lgtToCaster, 1/distToCaster);  // normalize lgtToCaster

        distToReceiver = Math.abs(receiverToCasterZ / lgtToCaster[2]);  // distant measured along lgtToCaster
        scale = (distToCaster + (distToReceiver * this.kReceiverDistanceFudge)) / distToCaster;
    }
    vec3.scaleAndAdd(offset, cxf.get3DPosition(), lgtToCaster, distToReceiver + this.kDistanceFudge);

    // set caster transforms
    cxf.setRotationInRad( cxf.getRotationInRad());
    cxf.setPosition(offset[0], offset[1]);
    cxf.setZPos(offset[2]);
    cxf.setWidth(cxf.getWidth() * scale);
    cxf.setHeight(cxf.getHeight() * scale);

    return true;
};
/*
 * File: ShadowReceiver.js
 * Shadow support
 *
 * Instance variables:
 *     mReceiver: Reference to any GameObject
 *                Treats this target for shadow receiver
 *     mCasters: Reference to an array of Renderables that are at least LightRenderable
 *
 * Draws the mReceiver, and the shadows of mCasters on this mReceiver
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Renderable, SpriteRenderable, ShadowCaster, Transform */

"use strict";

/**
* @param {SpriteRenderable} theReceiverObject - GameObject of SpriteRenderable or higher.
* @class
*/
function ShadowReceiver(theReceiverObject){
	this.kShadowStencilBit = 0x01; // The stencil bit to switch on/off for shadow
	this.kShadowStencilMask = 0xFF; // The stencil mask
	this.mReceiverShader = gEngine.DefaultResources.getShadowReceiverShader();
	this.mReceiver = theReceiverObject;

	//To support shadow drawing
	this.mShadowCaster = []; //Array of shadow casters
}

ShadowReceiver.prototype.addShadowCaster = function (lgtRenderable) {
    var c = new ShadowCaster(lgtRenderable, this.mReceiver);
    this.mShadowCaster.push(c);
};

ShadowReceiver.prototype.draw = function (aCamera) {
    var c;

    // A: draw receiver as a regular renderable
    this.mReceiver.draw(aCamera);

    this._shadowRecieverStencilOn();  // B1
    var s = this.mReceiver.getRenderable().swapShader(this.mReceiverShader);
    this.mReceiver.draw(aCamera);   // B2
    this.mReceiver.getRenderable().swapShader(s);
    this._shadowRecieverStencilOff();  // B3

    // C + D: now draw shadow color to the pixels in the stencil that are switched on
    for (c = 0; c < this.mShadowCaster.length; c++)
        this.mShadowCaster[c].draw(aCamera);

    // switch off stencil checking
    this._shadowRecieverStencilDisable();
};

ShadowReceiver.prototype.update = function () {
    this.mReceiver.update();
};
/*
 * File: ShadowReceiver.js
 * ShadowReceiver support's stencil settings
 */

/*jslint node: true, vars: true, white: true */
/*global ShadowReceiver, gEngine */

"use strict";

/*
* GL Stencil settings to support rendering to and checking of
* the stencil buffer
*/
ShadowReceiver.prototype._shadowRecieverStencilOn = function () {
        var gl = gEngine.Core.getGL();
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.enable(gl.STENCIL_TEST);
        gl.colorMask(false, false, false, false);
        gl.depthMask(false);
        gl.stencilFunc(gl.NEVER, this.kShadowStencilBit, this.kShadowStencilMask);
        gl.stencilOp(gl.REPLACE,gl.KEEP, gl.KEEP);
        gl.stencilMask(this.kShadowStencilMask);
    };

ShadowReceiver.prototype._shadowRecieverStencilOff = function () {
    var gl = gEngine.Core.getGL();
    gl.depthMask(gl.TRUE);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilFunc(gl.EQUAL, this.kShadowStencilBit, this.kShadowStencilMask);
    gl.colorMask( true, true, true, true );
};

ShadowReceiver.prototype._shadowRecieverStencilDisable = function () {
    var gl = gEngine.Core.getGL();
    gl.disable(gl.STENCIL_TEST);
};
/**
* GameObject - Class for common funcs in GameObjs
*/
/*jslint node: true, vars: true, evil: true*/
/*global gEngine: false, vec2: false, vec3: false, BoundingBox: false*/

"use strict";

/**
* @constructor
* @param {object} renderableObj - A renderable
* @classdesc GameObjects provide a better way to write code for rendered objects.
*/
function GameObject(renderableObj){
	this.mRenderComponent = renderableObj;
	this.mVisible = true;
	this.mCurrentFrontDir = vec2.fromValues(0,1);
	this.mSpeed = 0;
	this.mPhysicsComponent = null;
}

GameObject.prototype.getXform = function(){
	return this.mRenderComponent.getXform();
};

GameObject.prototype.update = function(){
	// simple default behavior, overwrite with subclass behavior
    var pos = this.getXform().getPosition();
	//Adds two vec2's after scaling the second operand by a scalar value
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
	if (this.mPhysicsComponent !== null) {
        this.mPhysicsComponent.update();
    }
};

GameObject.prototype.getRenderable = function(){ return this.mRenderComponent; };

GameObject.prototype.draw = function(aCamera){
    if (this.isVisible()) {
        this.mRenderComponent.draw(aCamera);
    }
    if (this.mPhysicsComponent !== null) {
        this.mPhysicsComponent.draw(aCamera);
    }
};
GameObject.prototype.setPhysicsComponent = function (p) { this.mPhysicsComponent = p; };
GameObject.prototype.getPhysicsComponent = function () { return this.mPhysicsComponent; };

GameObject.prototype.setVisibility = function (f) { this.mVisible = f; };
GameObject.prototype.isVisible = function () { return this.mVisible; };

GameObject.prototype.setSpeed = function (s) { this.mSpeed = s; };
GameObject.prototype.getSpeed = function () { return this.mSpeed; };
GameObject.prototype.incSpeedBy = function (delta) { this.mSpeed += delta; };

GameObject.prototype.setCurrentFrontDir = function (f) { vec2.normalize(this.mCurrentFrontDir, f); };
GameObject.prototype.getCurrentFrontDir = function () { return this.mCurrentFrontDir; };

GameObject.prototype.getRenderable = function () { return this.mRenderComponent; };

GameObject.prototype.rotateObjPointTo = function(p, rate){
	/* Determine destination position p */
	var dir = [];
	// determines dir via destination position and this object's position
	vec2.sub(dir, p, this.getXform().getPosition());
	// length is Math.sqrt(x*x + y*y)
	var len = vec2.length(dir);
    if (len < Number.MIN_VALUE)
        return; // we are there.
	// scale dir, as dir, by 1/len
    vec2.scale(dir, dir, 1 / len);

	/* Compute angle to rotate */
	var fdir = this.getCurrentFrontDir();
	var cosTheta = vec2.dot(dir, fdir);
	if (cosTheta > 0.999999) {
		return; // almost exactly the same direction
	}

	/* Clamp cosTheta to -1 to 1 */
    if(cosTheta>1){
		cosTheta = 1;
	} else{
		if(cosTheta < -1){
			cosTheta = -1;
		}
	}

	/* Compute whether to rotate clockwise, or counterclockwise */
	var dir3d = vec3.fromValues(dir[0], dir[1], 0);
	var f3d = vec3.fromValues(fdir[0], fdir[1], 0);

	var r3d = [];
	// recieving vector, operator1, operator2
	vec3.cross(r3d, f3d, dir3d);

	var rad = Math.acos(cosTheta);
	// if the z is negative the rotation is counterclockwise. Right hand rule
	if(r3d[2]<0){
		rad = -rad;
	}

	/* Rotate the facing direction with angle and rate */

	rad *= rate; //apply how quickly to rotate // actual angle need to rotate from Obj’s front
	// rotates current front direction
    vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), rad);
	// set the rotation in the Transform of the Renderable
	this.getXform().incRotationByRad(rad);
};

/**
* @func
* @desc Returns the unrotated Renderable object
*/
GameObject.prototype.getBBox = function() {
	var xform = this.getXform();
	var b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
	return b;
};
/* File: GameObject_PixelCollision.js
 *
 * Implements the pixelTouch() function of GameObject
 */

/*jslint node: true, vars: true */
/*global GameObject */

"use strict";

/**
* Determines if two object's pixels are touching, calls the texture pixel touch function
* @func
* @param {object} otherObj - The other object renderable
* @param {array} wcTouchPos - The coordinate position in the world
* @return {boolean} whether or not the game objects are touching
*/
GameObject.prototype.pixelTouches = function (otherObj, wcTouchPos) {
    // only continue if both objects have GetColorArray defined
    // if defined, should have other texture intersection support!
    var pixelTouch = false;
    var myRen = this.getRenderable();
    var otherRen = otherObj.getRenderable();

    if ((typeof myRen.pixelTouches === "function") && (typeof otherRen.pixelTouches === "function")) {
        if ((myRen.getXform().getRotationInRad() === 0) && (otherRen.getXform().getRotationInRad() === 0)) {
            // no rotation, we can use bbox ...
            var otherBbox = otherObj.getBBox();
	            if (otherBbox.intersectsBound(this.getBBox())) {
	                myRen.setColorArray();
	                otherRen.setColorArray();
	                pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
				}
            } else {
            // One or both are rotated, compute an encompassing circle by using the hypertenuse as radius
            var mySize = myRen.getXform().getSize();
            var otherSize = otherRen.getXform().getSize();
            var myR = Math.sqrt(0.5*mySize[0]*0.5*mySize[0] + 0.5*mySize[1]*0.5*mySize[1]);
            var otherR = Math.sqrt(0.5*otherSize[0]*0.5*otherSize[0] + 0.5*otherSize[1]*0.5*otherSize[1]);
            var d = [];
            vec2.sub(d, myRen.getXform().getPosition(), otherRen.getXform().getPosition());
            if (vec2.length(d) < (myR + otherR)) {
                myRen.setColorArray();
                otherRen.setColorArray();
                pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
            }
        }
	}
	return pixelTouch;
};
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
    if (index > -1) {
        this.mSet.splice(index, 1);
    }
};

/**
* Ensures that this object is drawn last, on top
* @func
*/
GameObjectSet.prototype.moveToLast = function(obj){
	this.removeFromSet(obj);
	this.addToSet(obj);
}

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
	var wcLeft = wcPos[0] - (aCamera.getWCWidth() /2);
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
/* File: ParallexGameObject.js 
 *
 * Represent an GameObject located at some distance D away, thus 
 * resulting in slower movements
 * 
 * Passed in scale: 
 *     ==1: means same as actors
 *     > 1: farther away, slows down inversely (scale==2 slows down twice)
 *     < 1: closer, speeds up inversely (scale==0.5 speeds up twice)
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, TiledGameObject, vec2  */

"use strict"; 

/**
* Creates a parallax scrolleable gameobject, based on the position of one camera
* @param {object} renderableObj - The texture renderable that is being parallaxed
* @param {int} scale - Positive integer value. Numbers greater than 1 represent objects that are farther away from the default distance	
* @param {object} aCamera - Camera object
*/
function ParallaxGameObject(renderableObj, scale, aCamera){
	this.mRefCamera = aCamera;
	this.mCameraWCCenterRef = vec2.clone(this.mRefCamera.getWCCenter());
	this.mParallaxScale = 1;
	this.setParallaxScale(scale);
	TiledGameObject.call(this, renderableObj);
}
gEngine.Core.inheritPrototype(ParallaxGameObject, TiledGameObject);

ParallaxGameObject.prototype.getParallaxScale = function () {
    return this.mParallaxScale;
};

ParallaxGameObject.prototype.setParallaxScale = function(s) {
    if (s <= 0) {
        this.mParallaxScale = 1;
    } else {
        this.mParallaxScale = 1/s;
    }
};

ParallaxGameObject.prototype.update = function() {
	this._refPosUpdate(); // check to see if the camera has moved
	var pos = this.getXform().getPosition(); // self xform
	vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed() * this.mParallaxScale)// move the parallax object
};

/**
* Computes relative displacement based on the ref camera's WC center position.
* vec2.scaleAndAdd() in update() moves the current object at a speed scaled by the mParallaxScale
* @func
*/
ParallaxGameObject.prototype._refPosUpdate = function() {
	// now check for reference movement
	var deltaT = vec2.fromValues(0, 0);
	vec2.sub(deltaT, this.mCameraWCCenterRef, this.mRefCamera.getWCCenter());
	// translate the object
	this.setWCTranslationBy(deltaT);
	// update the WC Center ref position
	vec2.sub(this.mCameraWCCenterRef, this.mCameraWCCenterRef, deltaT)
};

ParallaxGameObject.prototype.setWCTranslationBy = function (delta) {
    var f = (1-this.mParallaxScale);
    this.getXform().incXPosBy(-delta[0] * f);
    this.getXform().incYPosBy(-delta[1] * f);
};
/*
 * File: Particle.js
 * Defines a particle
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, LineRenderable */

"use strict";

/**
*
* @param {vec2} pos - likely to be a reference to xform.mPosition
* @class
*/
function Particle(pos){
	this.kPadding = 0.5;   // for drawing particle bounds

    this.mPosition = pos;  
    this.mVelocity = vec2.fromValues(0, 0);
    this.mAcceleration = gEngine.Particle.getSystemAcceleration();
    this.mDrag = 0.95;

    this.mPositionMark = new LineRenderable();
    this.mDrawBounds = false;
}

Particle.prototype.draw = function(aCamera){
	if(!this.mDrawBounds){
		return;
	}

	// calculation for the X at the particle position
	var x = this.mPosition[0];
	var y = this.mPosition[1];

	this.mPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
    this.mPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT

    this.mPositionMark.draw(aCamera);
    this.mPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);//TOP RIGHT
    this.mPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding);//BOTTOM LEFT
    this.mPositionMark.draw(aCamera);
}

Particle.prototype.update = function(){
	var dt = gEngine.GameLoop.getUpdateIntervalInSeconds();
	// Symplectic Euler
    //    v += a * dt
    //    x += v * dt
    var p = this.getPosition();
    vec2.scaleAndAdd(this.mVelocity, this.mVelocity, this.mAcceleration, dt);
    vec2.scale(this.mVelocity, this.mVelocity, this.mDrag);
    vec2.scaleAndAdd(p, p, this.mVelocity, dt);
}

Particle.prototype.setColor = function (color) {
    this.mPositionMark.setColor(color);
};
Particle.prototype.getColor = function () { return this.mPositionMark1.getColor(); };
Particle.prototype.setDrawBounds = function(d) { this.mDrawBounds = d; };
Particle.prototype.getDrawBounds = function() { return this.mDrawBounds; };

Particle.prototype.setPosition = function (xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); };
Particle.prototype.getPosition = function () { return this.mPosition; };
Particle.prototype.getXPos = function () { return this.mPosition[0]; };
Particle.prototype.setXPos = function (xPos) { this.mPosition[0] = xPos; };
Particle.prototype.getYPos = function () { return this.mPosition[1]; };
Particle.prototype.setYPos = function (yPos) { this.mPosition[1] = yPos; };
Particle.prototype.setVelocity = function (f) { this.mVelocity = f; };
Particle.prototype.getVelocity = function () { return this.mVelocity; };
Particle.prototype.setAcceleration = function (g) { this.mAcceleration = g; };
Particle.prototype.getAcceleration = function () { return this.mAcceleration; };
Particle.prototype.setDrag = function (d) { this.mDrag = d; };
Particle.prototype.getDrag = function () { return this.mDrag; };
/*
 * File: ParticleGameObject.js
 * Supports particle object particulars: color change and expiration
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, ParticleRenderable, Particle, vec4 */

"use strict";

function ParticleGameObject (texture, atX, atY, cyclesToLive) {
	var renderableObj = new ParticleRenderable(texture);

	var xf = renderableObj.getXform();
	xf.setPosition(atX, atY);

	GameObject.call(this, renderableObj);

	var p = new Particle(xf.getPosition());

	this.setPhysicsComponent(p);

	this.mDeltaColor = [0, 0, 0, 0];
	this.mSizeDelta = 0;
	this.mCyclesToLive = cyclesToLive;
}

gEngine.Core.inheritPrototype(ParticleGameObject, GameObject);

ParticleGameObject.prototype.setFinalColor = function(f){
	vec4.sub(this.mDeltaColor, f, this.mRenderComponent.getColor());
	if (this.mCyclesToLive !== 0) {
		vec4.scale(this.mDeltaColor, this.mDeltaColor, 1/this.mCyclesToLive);
	}
}

ParticleGameObject.prototype.setSizeDelta = function(d) {  this.mSizeDelta = d; };
ParticleGameObject.prototype.hasExpired = function() { return (this.mCyclesToLive < 0); };

/**
* Reduces cycles to live, changes color, position and size
* @func
*/
ParticleGameObject.prototype.update = function () {
    GameObject.prototype.update.call(this);

    this.mCyclesToLive--;
    var c = this.mRenderComponent.getColor();
    vec4.add(c, c, this.mDeltaColor);

    var xf = this.getXform();
    var s = xf.getWidth() * this.mSizeDelta;
    xf.setSize(s, s);
};
/*
 * File: ParticleGameObjectSet.js
 * Supports sets for Particles
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, ParticleRenderable, Particle, vec4 */

"use strict";

/**
* Set for Particles, inherits the GameObjectSet
* @class
*/
function ParticleGameObjectSet() {
    GameObjectSet.call(this);
    this.mEmitterSet = [];
}
gEngine.Core.inheritPrototype(ParticleGameObjectSet, GameObjectSet);

ParticleGameObjectSet.prototype.addEmitterAt = function (p, n, func) {
    var e = new ParticleEmitter(p, n, func);
    this.mEmitterSet.push(e);
};

/**
* Overrides the standard GameObjectSet draw method for addititve blending
* @func
*/
ParticleGameObjectSet.prototype.draw = function(aCamera){
	var gl = gEngine.Core.getGL();
	gl.blendFunc(gl.ONE, gl.ONE); // For additive blending
    GameObjectSet.prototype.draw.call(this, aCamera);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);// Restore alpha blending
}

ParticleGameObjectSet.prototype.update = function () {
    GameObjectSet.prototype.update.call(this);

    // Cleanup Particles
    var i, e, obj;
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        if (obj.hasExpired()) {
            this.removeFromSet(obj);
        }
    }

    // Emit new particles
    for (i=0; i<this.mEmitterSet.length; i++) {
        e = this.mEmitterSet[i];
        e.emitParticles(this);
        if (e.expired()) {
            this.mEmitterSet.splice(i, 1);
        }
    }
};



/*
 * File: ParticleEmitter.js
 * Programmactically create particles
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, ParticleGameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

/**
* Creates an emitter, more like an event listener, the actual particles are created in the callback function.
* @param {vec2} pos - Position for particle emitter, can be a reference to xform.mPosition
* @param {num} num - Number of particles left to be emitted
* @param {func} creatorFunc - callback function for actual particles creation
* @class
*/
function ParticleEmitter(pos, num, creatorFunc){
	this.kMinToEmit = 5; // Defaule/Smallest number of particle emitted per cycle
	this.mEmitPosition = pos;
	this.mNumRemains = num; // Number of particles left to be emitted
	this.mParticleCreator = creatorFunc;
}

ParticleEmitter.prototype.expired = function(){
	return (this.mNumRemains <= 0);
};

ParticleEmitter.prototype.emitParticles = function (pSet){
	var numToEmit = 0;
	if(this.mNumRemains < this.kMinToEmit){
		// If only a few are left, emits all of them
        numToEmit = this.mNumRemains;
	} else {
		// Otherwise emit about 20% of whats left
		numToEmit = Math.random() * 0.2 * this.mNumRemains;
	}
	// Left for future emitting.
    this.mNumRemains -= numToEmit;
    var i, p;
    for (i = 0; i < numToEmit; i++) {
        p = this.mParticleCreator(this.mEmitPosition[0], this.mEmitPosition[1]);
        pSet.addToSet(p);
	}
}
/*
 * File: RigidShape.js
 * Defines a simple rigid shape
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, LineRenderable */

"use strict";

RigidShape.eRigidType = Object.freeze({
	eRigidAbstract: 0,
	eRigidCircle: 1,
	eRigidRectange: 2
});

/**
* Adds physics rigidbody to the transform,
* @constructor
* @param {xform} xform - Transform to have a rigidbody, typically from a game object
*/
function RigidShape(xform){
	this.mXform = xform;
	this.kPadding = 0.25; // size of position mark
	this.mPositionMark = new LineRenderable();
	this.mDrawBounds = false; // defines whether the bounds should be drawn

	// Physics properties
	this.mInvMass = 1; //mass?
	this.mRestitution = 0.8; //Bounciness
	this.mVelocity = vec2.fromValues(0,0);
	this.mFriction = 0.3;
	this.mAcceleration = gEngine.Physics.getSystemAcceleration();
}

RigidShape.prototype.draw = function (aCamera){
	if(!this.mDrawBounds){
		return;
	}

	// calculation for the X at center of shape
	var x = this.mXform.getXPos();
	var y = this.mXform.getYPos();

	this.mPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
    this.mPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT
    this.mPositionMark.draw(aCamera);

    this.mPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);  //TOP RIGHT
    this.mPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding); //BOTTOM LEFT
    this.mPositionMark.draw(aCamera);
}

RigidShape.prototype.update = function () {};

RigidShape.prototype.getPosition = function() {
    return this.mXform.getPosition();
};

RigidShape.prototype.setPosition = function(x, y ) {
    this.mXform.setPosition(x, y);
};
RigidShape.prototype.getXform = function () { return this.mXform; };
RigidShape.prototype.setXform = function (xform) { this.mXform = xform; };
RigidShape.prototype.setColor = function (color) {
    this.mPositionMark.setColor(color);
};
RigidShape.prototype.getColor = function () { return this.mPositionMark1.getColor(); };
RigidShape.prototype.setDrawBounds = function(d) { this.mDrawBounds = d; };
RigidShape.prototype.getDrawBounds = function() { return this.mDrawBounds; };
/*
 * File: RigidShape_Collision.js
 * Detects RigidPoint collisions
 */

/*jslint node: true, vars:true , white: true*/
/*global RigidShape, vec2, LineRenderable */
"use strict";


RigidShape.prototype.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};

RigidShape.prototype.collidedRectCirc = function(rect1Shape, circ2Shape, collisionInfo) {
	var rect1Pos = rect1Shape.getXform().getPosition();
    var circ2Pos = circ2Shape.getXform().getPosition();
    var vFrom1to2 = [0, 0];
    vec2.subtract(vFrom1to2, circ2Pos, rect1Pos);

    var vec = vec2.clone(vFrom1to2);

    var alongX = rect1Shape.getWidth() / 2;
    var alongY = rect1Shape.getHeight() / 2;

    vec[0] = this.clamp(vec[0], -alongX, alongX);
    vec[1] = this.clamp(vec[1], -alongY, alongY);

    var isInside = false;
    if (rect1Shape.containsPos(circ2Pos))  {
        isInside = true;
        // Find closest axis
        if (Math.abs(vFrom1to2[0] - alongX) < Math.abs(vFrom1to2[1] - alongY)) {
            // Clamp to closest side
            if (vec[0] > 0) {
                vec[0] = alongX;
            } else {
                vec[0] = -alongX;
            }
        } else { // y axis is shorter
            // Clamp to closest side
            if (vec[1] > 0) {
                vec[1] = alongY;
            } else {
                vec[1] = -alongY;
            }
        }
    }

    var normal = [0, 0];
    vec2.subtract(normal, vFrom1to2, vec);

    var distSqr = vec2.squaredLength(normal);
    var rSqr = circ2Shape.getRadius() * circ2Shape.getRadius();

    if (distSqr > rSqr && !isInside) {
        return false; //no collision exit before costly square root
    }

    var len = Math.sqrt(distSqr);
    var depth;

    vec2.scale(normal, normal, 1/len); // normalize normal
    if (isInside) { //flip normal if inside the rect
        vec2.scale(normal, normal, -1);
        depth = circ2Shape.getRadius() + len;
    } else {
        depth = circ2Shape.getRadius() - len;
    }

    collisionInfo.setNormal(normal);
    collisionInfo.setDepth(depth);
    return true;
};

RigidShape.prototype.resolveParticleCollision = function(aParticle) {
    var status = false;
    switch (this.rigidType()) {
        case RigidShape.eRigidType.eRigidCircle:
            status = gEngine.Particle.resolveCirclePos(this, aParticle);
            break;
        case RigidShape.eRigidType.eRigidRectangle:
            status = gEngine.Particle.resolveRectPos(this, aParticle);
            break;
    }
    return status;
};
/*
 * File: RigidShapeBehavior.js
 * Defines rigid shape behavior for collisions
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, LineRenderable, RigidShape */


/**
* Updates physics objects using symplectic Euler
* @func
*/
RigidShape.prototype.update = function() {
	var dt = gEngine.GameLoop.getUpdateIntervalInSeconds();

	// Symplectic Euler
    //    v += (1/m * a) * dt
    //    x += v * dt
    var v = this.getVelocity();
    vec2.scaleAndAdd(v, v, this.mAcceleration, (this.getInvMass() * dt ));

    var pos = this.getPosition();
    vec2.scaleAndAdd(pos, pos, v, dt);
};

RigidShape.prototype.getInvMass = function(){ return this.mInvMass;}
RigidShape.prototype.setMass = function(m){
	if(m>0){
		this.mInvMass = 1/m; // Inverse the mass. Why?
	} else {
		this.mInvMass = 0;
	}
}

RigidShape.prototype.getVelocity = function () { return this.mVelocity; };
RigidShape.prototype.setVelocity = function (v) { this.mVelocity = v; };
RigidShape.prototype.getRestitution = function () { return this.mRestitution; };
RigidShape.prototype.setRestitution = function (r) { this.mRestitution = r; };
RigidShape.prototype.getFriction = function () { return this.mFriction; };
RigidShape.prototype.setFriction = function (f) { this.mFriction = f; };
RigidShape.prototype.getAcceleration = function () { return this.mAcceleration; };
RigidShape.prototype.setAcceleration = function (g) { this.mAcceleration = g; };
/*
 * File: RigidCircle.js
 * Defines a rigid circle
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, RigidShape, vec2, LineRenderable */
"use strict";

/**
* Circle collider, drawn as 16 individual line segments
* @constructor
* @param {num} r - Radius, size of the circle
*/
function RigidCircle(xform, r) {
    RigidShape.call(this, xform);
    this.kNumSides = 16;
    this.mSides = new LineRenderable();
    this.mRadius = r;
}
gEngine.Core.inheritPrototype(RigidCircle, RigidShape);

RigidCircle.prototype.rigidType = function () {
    return RigidShape.eRigidType.eRigidCircle;
};
RigidCircle.prototype.getRadius = function () {
    return this.mRadius;
};

RigidCircle.prototype.draw = function (aCamera) {
    if (!this.mDrawBounds) {
        return;
    }
    RigidShape.prototype.draw.call(this, aCamera);

    // kNumSides forms the circle.
    var pos = this.getPosition();
    var prevPoint = vec2.clone(pos);
    var deltaTheta = (Math.PI * 2.0) / this.kNumSides;
    var theta = deltaTheta;
    prevPoint[0] += this.mRadius;
    var i, x, y;
    for (i = 1; i <= this.kNumSides; i++) {
        x = pos[0] + this.mRadius * Math.cos(theta);
        y = pos[1] +  this.mRadius * Math.sin(theta);

        this.mSides.setFirstVertex(prevPoint[0], prevPoint[1]);
        this.mSides.setSecondVertex(x, y);
        this.mSides.draw(aCamera);

        theta = theta + deltaTheta;
        prevPoint[0] = x;
        prevPoint[1] = y;
    }
};

RigidCircle.prototype.setColor = function (color) {
    RigidShape.prototype.setColor.call(this, color);
    this.mSides.setColor(color);
};
RigidCircle.prototype.containsPos = function(pos) {
    var dist = vec2.distance(this.getPosition(), pos);
    return (dist < this.getRadius());
};

RigidCircle.prototype.collidedCircCirc = function(c1, c2, collisionInfo) {
    var vFrom1to2 = [0, 0];
    vec2.sub(vFrom1to2, c2.getPosition(), c1.getPosition());
    var rSum = c1.getRadius() + c2.getRadius();
    var sqLen = vec2.squaredLength(vFrom1to2);
    if (sqLen > (rSum * rSum)) {
        return false;
    }
    var dist = Math.sqrt(sqLen);

    if (dist !== 0) { // overlapping
        vec2.scale(vFrom1to2, vFrom1to2, 1/dist);
        collisionInfo.setNormal(vFrom1to2);
        collisionInfo.setDepth(rSum - dist);
    }
    else //same position
    {
        collisionInfo.setDepth(rSum / 10);
        collisionInfo.setNormal([0, 1]); // sets normal to up y axis
    }
    return true;
};


RigidCircle.prototype.collided = function(otherShape, collisionInfo) {
    var status = false;
    var n;
    collisionInfo.setDepth(0);
    switch (otherShape.rigidType()) {
        case RigidShape.eRigidType.eRigidCircle:
            status = this.collidedCircCirc(this, otherShape, collisionInfo);
            break;
        case RigidShape.eRigidType.eRigidRectangle:
            status = this.collidedRectCirc(otherShape, this, collisionInfo);
            n = collisionInfo.getNormal();
            n[0] = -n[0];
            n[1] = -n[1];
            break;
    }
    return status;
};
/*
 * File: RigidRectangle.js
 * Defines a rigid Rectangle
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, RigidShape, vec2, LineRenderable */
"use strict";

/**
* Rigid Rectangle physics object. Subclass of RigidShape
* @constructor
* @param {xform} xform
* @param {num} w - width
* @param {num} h - height
*/
function RigidRectangle (xform, w, h){
	RigidShape.call(this, xform);
	this.mSides = new LineRenderable();

	this.mWidth = w;
	this.mHeight = h;
}

gEngine.Core.inheritPrototype(RigidRectangle, RigidShape);

RigidRectangle.prototype.draw = function(aCamera){
	if(!this.mDrawBounds){
		return
	}

	RigidShape.prototype.draw.call(this, aCamera);

	var x = this.getPosition()[0];
    var y = this.getPosition()[1];
    var w = this.mWidth/2;
    var h = this.mHeight/2;

	this.mSides.setFirstVertex(x - w, y + h);   //TOP LEFT
    this.mSides.setSecondVertex(x + w, y + h);  //TOP RIGHT
    this.mSides.draw(aCamera);
    this.mSides.setFirstVertex(x + w, y - h);   //BOTTOM RIGHT
    this.mSides.draw(aCamera);
    this.mSides.setSecondVertex(x - w, y - h);  //BOTTOM LEFT
    this.mSides.draw(aCamera);
    this.mSides.setFirstVertex(x - w, y + h);   //TOP LEFT
    this.mSides.draw(aCamera);
}

RigidRectangle.prototype.rigidType = function () {
    return RigidShape.eRigidType.eRigidRectangle;
};
RigidRectangle.prototype.getWidth = function () { return this.mWidth; };
RigidRectangle.prototype.getHeight = function () { return this.mHeight; };
RigidRectangle.prototype.setColor = function (color) {
    RigidShape.prototype.setColor.call(this, color);
    this.mSides.setColor(color);
};
/*
 * File: RigidRectangle_Collision.js
 * Detects RigidRectangle collisions
 */

/*jslint node: true, vars:true , white: true*/
/*global RigidShape, RigidRectangle, vec2, LineRenderable */
"use strict";

RigidRectangle.prototype.containsPos = function (pos) {
    var rPos = this.getPosition();
    var rMinX = rPos[0] - this.getWidth() / 2;
    var rMaxX = rPos[0] + this.getWidth() / 2;
    var rMinY = rPos[1] - this.getHeight() / 2;
    var rMaxY = rPos[1] + this.getHeight() / 2;

    return ((rMinX < pos[0]) && (rMaxX > pos[0]) &&
            (rMinY < pos[1] && rMaxY > pos[1]));
};

RigidRectangle.prototype.collidedRectRect = function(r1, r2, collisionInfo) {
    var vFrom1to2 = vec2.fromValues(0, 0);
    vec2.sub(vFrom1to2, r2.getPosition(), r1.getPosition());
    var xDepth = (r1.getWidth() / 2) + (r2.getWidth() / 2) - Math.abs(vFrom1to2[0]);
    if (xDepth > 0) {
        var yDepth = (r1.getHeight() / 2) + (r2.getHeight() / 2) - Math.abs(vFrom1to2[1]);
        if (yDepth > 0)  {
            //axis of least penetration
            if (xDepth < yDepth) {
                if (vFrom1to2[0] < 0) {
                    collisionInfo.setNormal([-1, 0]);
                } else {
                    collisionInfo.setNormal([1, 0]);
                }
                collisionInfo.setDepth(xDepth);
            } else {
                if (vFrom1to2[1] < 0) {
                    collisionInfo.setNormal([0, -1]);
                } else {
                    collisionInfo.setNormal([0, 1]);
                }
                collisionInfo.setDepth(yDepth);
            }
            return true;
        }
    }
    return false;
};


RigidRectangle.prototype.collided = function(otherShape, collisionInfo) {
    var status = false;
    collisionInfo.setDepth(0);
    switch (otherShape.rigidType()) {
        case RigidShape.eRigidType.eRigidCircle:
            status = this.collidedRectCirc(this, otherShape, collisionInfo);
            break;
        case RigidShape.eRigidType.eRigidRectangle:
            status = this.collidedRectRect(this, otherShape, collisionInfo);
            break;
    }
    return status;
};
/*
 * File: ShaderSupport.js
 * Support the loading, compiling, and linking of shader code
 *
 * Notice:  although in a different file, we have access to
 *          global variables defined in WebGL.js: gGL
 */
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, alert: false, loadAndCompileShader: false,
    gSquareVertexBuffer: false, document: false, gEngine: false,
    XMLHttpRequest */

"use strict";

function SimpleShader(vertexShaderPath, fragmentShaderPath) {
    // instance variables
    // Convention: all instance variables: mVariables
    this.mCompiledShader = null;  // reference to the compiled shader in webgl context  
    this.mShaderVertexPositionAttribute = null; // reference to SquareVertexPosition within the shader
    this.mPixelColor = null;                    // reference to the pixelColor uniform in the fragment shader
    this.mModelTransform = null;                // reference to model transform matrix in vertex shader
    this.mViewProjTransform = null;             // reference to the View/Projection matrix in the vertex shader
    this.mGlobalAmbientColor = null;
    this.mGlobalAmbientIntensity = null;
    var gl = gEngine.Core.getGL();

    // start of constructor code
    // 
    // Step A: load and compile vertex and fragment shaders
    this.mVertexShader = this._compileShader(vertexShaderPath, gl.VERTEX_SHADER);
    this.mFragmentShader = this._compileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);

    // Step B: Create and link the shaders into a program.
    this.mCompiledShader = gl.createProgram();
    gl.attachShader(this.mCompiledShader, this.mVertexShader);
    gl.attachShader(this.mCompiledShader, this.mFragmentShader);
    gl.linkProgram(this.mCompiledShader);

    // Step C: check for error
    if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
        alert("Error linking shader");
        return null;
    }

    // Step D: gets a reference to the aSquareVertexPosition attribute within the shaders.
    this.mShaderVertexPositionAttribute = gl.getAttribLocation(
        this.mCompiledShader,
        "aSquareVertexPosition"
    );

    // Step E: gets references to the uniform variables: uPixelColor, uModelTransform, and uViewProjTransform
    this.mPixelColor = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
    this.mModelTransform = gl.getUniformLocation(this.mCompiledShader, "uModelTransform");
    this.mViewProjTransform = gl.getUniformLocation(this.mCompiledShader, "uViewProjTransform");
    this.mGlobalAmbientColor = gl.getUniformLocation(this.mCompiledShader, "uGlobalAmbientColor");
    this.mGlobalAmbientIntensity = gl.getUniformLocation(this.mCompiledShader, "uGlobalAmbientIntensity");
}

// Returns a complied shader from a shader in the dom.
// The id is the id of the script in the html tag.
SimpleShader.prototype._compileShader = function(filepath, shaderType) {
    var shaderText, shaderSource, compiledShader;
    var gl = gEngine.Core.getGL();

    // Step A: Get the shader source from the folder
    shaderSource = gEngine.ResourceMap.retrieveAsset(filepath);

	if (shaderSource === null) {
	    alert("WARNING: Loading of:" + filepath + " Failed!");
	    return null;
	}

    // Step B: Create the shader based on the shader type: vertex or fragment
    compiledShader = gl.createShader(shaderType);

    // Step C: Compile the created shader
	//remember,gGL is the canvas context
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};

SimpleShader.prototype.activateShader = function (pixelColor, aCamera) {
    var gl = gEngine.Core.getGL();
    gl.useProgram(this.mCompiledShader);
    gl.uniformMatrix4fv(this.mViewProjTransform, false, aCamera.getVPMatrix());
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLVertexRef());
    gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
        3,              // each element is a 3-float (x,y.z)
        gl.FLOAT,       // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);             // offsets to the first element
    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
    gl.uniform4fv(this.mPixelColor, pixelColor);
    gl.uniform4fv(this.mGlobalAmbientColor, gEngine.DefaultResources.getGlobalAmbientColor());
    gl.uniform1f(this.mGlobalAmbientIntensity, gEngine.DefaultResources.getGlobalAmbientIntensity());
};

// Loads a per-object model transform to the shader
SimpleShader.prototype.loadObjectTransform = function(modelTransform){
	var gl = gEngine.Core.getGL();

	// Copy the ModelTransform to the vertex shader location
	// As identified by mModelTransform
	// Or the uModelTransform operator in the vertex shader
	// uniformMatrix4fv(location, transpose(false), value(float32));
	gl.uniformMatrix4fv(this.mModelTransform, false, modelTransform);
};

SimpleShader.prototype.getShader = function() { return this.mCompiledShader; };

SimpleShader.prototype.cleanUp = function() {
    var gl = gEngine.Core.getGL();
    gl.detachShader(this.mCompiledShader, this.mVertexShader);
	gl.detachShader(this.mCompiledShader, this.mFragmentShader);
    gl.deleteShader(this.mVertexShader);
    gl.deleteShader(this.mFragmentShader);
};
/*
* Texture Shader Constructor
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false, gSquareVertexBuffer: false, document: false, gEngine: false,
  * Transform: false, SimpleShader: false*/
"use strict";
/**
* @constructor
* @param {string} vertexShaderPath - unique id path to vertex shader
* @param {string} fragmentShaderPath - unique id path to fragment shader
* @class
*/
function TextureShader(vertexShaderPath, fragmentShaderPath){
	// Call the super class constructor
	SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);

	// reference to aTextureCoordinate within the shader
    this.mShaderTextureCoordAttribute = null;
	// reference to the uSampler, when using only texture this is not necessary,
	this.mSamplerRef = null;

	// reference to aTextureCoordinate from the shader
	var gl = gEngine.Core.getGL();
	this.mShaderTextureCoordAttribute = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
	this.mSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uSampler");
}

// get all the prototype functions from SimpleShader
gEngine.Core.inheritPrototype(TextureShader, SimpleShader);

TextureShader.prototype.activateShader = function(pixelColor, aCamera){
	// first call the superclass activate
	SimpleShader.prototype.activateShader.call(this, pixelColor, aCamera);

	// now implement our own: enable texture coordinate array
	var gl = gEngine.Core.getGL();
	gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLTexCoordRef());
	gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
	/**
    * Describe the characteristic of the vertex position attribute
    * @function
    * @param{shaderCoord} index - mShaderTextureCoordAttribute
    * @param{number} size - each element is a 2-float (x,y,z)
    * @param{gl.magic} type - data type is FLOAT
    * @param{boolean} normalized - if the content is normalized vectors
    * @param{number} stride - number of bytes to skip in between elements
    * @param{number} offset - offsets to the first element
    */
	gl.vertexAttribPointer(this.mShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
	// binds to texture unit 0
	gl.uniform1i(this.mSamplerRef, 0);
};
/*
* Sprite Shader Constructor
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false, gSquareVertexBuffer: false, document: false, gEngine: false,
  * Transform: false, TextureShader: false, SimpleShader: false*/
"use strict";
/**
* @constructor
* @param {string} vertexShaderPath - unique id path to vertex shader
* @param {string} fragmentShaderPath - unique id path to fragment shader
* @classdesc a subclass of Texture Shader, defines coord system on a sprite sheet.
*/
function SpriteShader(vertexShaderPath, fragmentShaderPath){
	// call the super class constructor
	TextureShader.call(this, vertexShaderPath, fragmentShaderPath);

	//gl buffer containing texture coordinate
	this.mTexCoordBuffer = null;

	var initTexCoord = [
	  1.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      0.0, 0.0
	];

	var gl = gEngine.Core.getGL();

	this.mTexCoordBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);

}
	// inherit the TextureShader properties
	gEngine.Core.inheritPrototype(SpriteShader, TextureShader);
	/**
    * Describe the characteristic of the vertex position attribute
    * @function
    * @param{array} texCoord - array of 8 floating point numbers that identify four corners of a subregioan in Texture Space, AKA 4 corners of a sprite sheet
    */
SpriteShader.prototype.setTextureCoordinate = function(texCoord){
	var gl = gEngine.Core.getGL();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);

	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
};
	/**
    * Activate sprite shader, calls SimpleShader.
    * @function
    * @param{array} texCoord - pixel color
    * @param{matrix} vpMatrix - view projection matrix
    */
SpriteShader.prototype.activateShader = function(pixelColor, aCamera){
	// call superclass activate
	//Simple Shader is used instead to avoid TextureShader's activating system's default texture coord buffer for rendering
	SimpleShader.prototype.activateShader.call(this, pixelColor, aCamera);

	// bind the proper texture coordinate buffer
	var gl = gEngine.Core.getGL();

	gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
	gl.vertexAttribPointer(this.mShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
};

SpriteShader.prototype.cleanUp = function(){
	var gl = gEngine.Core.getGL();
	gl.deleteBuffer(this.mTexCoordBuffer);

	SimpleShader.prototype.cleanUp.call(this);
};

// will be override by LightShader
SpriteShader.prototype.setLights = function (l) { };

// will be override by IllumShader
SpriteShader.prototype.setMaterialAndCameraPos = function(m, p) { };

/* 
 * File: LineShader.js
 *          for debugging physics engine
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader */

"use strict";  
//<editor-fold desc="constructor">
// constructor of LineShader object
function LineShader(vertexShaderPath, fragmentShaderPath) {
    // Call super class constructor
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

    this.mPointSizeRef = null;            // reference to the PointSize uniform
    var gl = gEngine.Core.getGL();

    // point size uniform
    this.mPointSizeRef = gl.getUniformLocation(this.mCompiledShader, "uPointSize");

    this.mPointSize = 1;
}
gEngine.Core.inheritPrototype(LineShader, SimpleShader);
//</editor-fold>

// <editor-fold desc="Public Methods">

// Activate the shader for rendering
LineShader.prototype.activateShader = function (pixelColor, aCamera) {
    // first call the super class's activate
    SimpleShader.prototype.activateShader.call(this, pixelColor, aCamera);

    // now our own functionality: enable texture coordinate array
    var gl = gEngine.Core.getGL();
    gl.uniform1f(this.mPointSizeRef, this.mPointSize);
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLLineVertexRef());
    gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
        3,              // each element is a 3-float (x,y.z)
        gl.FLOAT,       // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);

    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
};
LineShader.prototype.setPointSize = function (w) { this.mPointSize = w; };

//-- end of public methods
// </editor-fold>
/* 
 * File: LightShader.js
 * Subclass from SpriteShader
 *          Supports light illumination
 */
/*jslint node: true, vars: true */
/*global gEngine, SpriteShader, ShaderLightAtIndex, vec4 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor 
function LightShader(vertexShaderPath, fragmentShaderPath) {
    // Call super class constructor
    SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

    this.mLights = null;  // lights from the Renderable

    //*******WARNING***************
    // this number MUST correspond to the GLSL uLight[] array size (for LightFS.glsl)
    //*******WARNING********************
    this.kGLSLuLightArraySize = 4;  // <-- make sure this is the same as LightFS.glsl
    this.mShaderLights = [];
    var i, ls;
    for (i = 0; i < this.kGLSLuLightArraySize; i++) {
        ls = new ShaderLightAtIndex(this.mCompiledShader, i);
        this.mShaderLights.push(ls);
    }
}
gEngine.Core.inheritPrototype(LightShader, SpriteShader);
//</editor-fold>

// <editor-fold desc="Public Methods">

// Overriding the Activation of the shader for rendering
LightShader.prototype.activateShader = function (pixelColor, aCamera) {
    // first call the super class's activate
    SpriteShader.prototype.activateShader.call(this, pixelColor, aCamera);

    // now push the light information to the shader
    var numLight = 0;
    if (this.mLights !== null) {
        while (numLight < this.mLights.length) {
            this.mShaderLights[numLight].loadToShader(aCamera, this.mLights[numLight]);
            numLight++;
        }
    }
    // switch off the left over ones.
    while (numLight < this.kGLSLuLightArraySize) {
        this.mShaderLights[numLight].switchOffLight(); // switch off unused lights
        numLight++;
    }
};

LightShader.prototype.setLights = function (l) {
    this.mLights = l;
};
//</editor-fold>
/*
 * File: ShaderLightAtIndex.js
 * support of loading light info to the glsl shader
 *      references are pointing to uLight[index]
 */
/*jslint node: true, vars: true */
/*global gEngine, vec3, vec4, Light */

"use strict";

function ShaderLightAtIndex(shader, index) {
    this._setShaderReferences(shader, index);
}

ShaderLightAtIndex.prototype.loadToShader = function (aCamera, aLight) {
    var gl = gEngine.Core.getGL();
    gl.uniform1i(this.mIsOnRef, aLight.isLightOn());
    if (aLight.isLightOn()) {
        var p = aCamera.wcPosToPixel(aLight.getPosition());
        var n = aCamera.wcSizeToPixel(aLight.getNear());
        var f = aCamera.wcSizeToPixel(aLight.getFar());
        var c = aLight.getColor();
        gl.uniform4fv(this.mColorRef, c);
        gl.uniform3fv(this.mPosRef, vec3.fromValues(p[0], p[1], p[2]));
        gl.uniform1f(this.mNearRef, n);
        gl.uniform1f(this.mFarRef, f);
        gl.uniform1f(this.mInnerRef, 0.0);
        gl.uniform1f(this.mOuterRef, 0.0);
        gl.uniform1f(this.mIntensityRef, aLight.getIntensity());
        gl.uniform1f(this.mDropOffRef, 0);
        gl.uniform1i(this.mLightTypeRef, aLight.getLightType());

        if (aLight.getLightType() === Light.eLightType.ePointLight) {
            gl.uniform3fv(this.mDirRef, vec3.fromValues(0, 0, 0));
        } else {
            // either spot or directional lights: must compute direction
            var d = aCamera.wcDirToPixel(aLight.getDirection());
            gl.uniform3fv(this.mDirRef, vec3.fromValues(d[0], d[1], d[2]));
            if (aLight.getLightType() === Light.eLightType.eSpotLight) {
                gl.uniform1f(this.mInnerRef, Math.cos(0.5 * aLight.getInner())); // stores the cosine of half of inner cone angle
                gl.uniform1f(this.mOuterRef, Math.cos(0.5 * aLight.getOuter())); // stores the cosine of half of outer cone angle
                gl.uniform1f(this.mDropOffRef, aLight.getDropOff());
            }
        }
    }
};

ShaderLightAtIndex.prototype.switchOffLight = function () {
    var gl = gEngine.Core.getGL();
    gl.uniform1i(this.mIsOnRef, false);
};

ShaderLightAtIndex.prototype._setShaderReferences = function (aLightShader, index) {
    var gl = gEngine.Core.getGL();
    this.mColorRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].Color");
    this.mPosRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Position");
    this.mDirRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Direction");
    this.mNearRef = gl.getUniformLocation(aLightShader,      "uLights[" + index + "].Near");
    this.mFarRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Far");
    this.mInnerRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].CosInner");
    this.mOuterRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].CosOuter");
    this.mIntensityRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Intensity");
    this.mDropOffRef = gl.getUniformLocation(aLightShader,   "uLights[" + index + "].DropOff");
    this.mIsOnRef = gl.getUniformLocation(aLightShader,      "uLights[" + index + "].IsOn");
    this.mLightTypeRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].LightType");
};

/*
 * File: IllumShader.js
 * Subclass from LightShader (to take advantage of light sources)
 */
/*jslint node: true, vars: true */
/*global gEngine, SpriteShader, LightShader, ShaderMaterial, ShaderLightAtIndex, vec4 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";
/**
* Subclass from LightShader, provides normal mapping support. Talks to IllumFS.glsl
* @class
*/
function IllumShader (vertexShaderPath, fragmentShaderPath){
	LightShader.call(this, vertexShaderPath, fragmentShaderPath);

	var gl = gEngine.Core.getGL();

	// this is the material property of the renderable
    this.mMaterial = null;
    this.mMaterialLoader = new ShaderMaterial(this.mCompiledShader);

    // Reference to the camera position
    this.mCameraPos = null;  // points to a vec3
    this.mCameraPosRef = gl.getUniformLocation(this.mCompiledShader, "uCameraPosition");

	this.mNormalSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uNormalSampler");
}

gEngine.Core.inheritPrototype(IllumShader, LightShader);

IllumShader.prototype.activateShader = function(pixelColor, aCamera){
	LightShader.prototype.activateShader.call(this, pixelColor, aCamera);
	var gl = gEngine.Core.getGL();

	// bind to texture unit 1
	gl.uniform1i(this.mNormalSamplerRef, 1);
	// Don't need texture coord buffer
	// Will use the ones from the sprite texture
	this.mMaterialLoader.loadToShader(this.mMaterial);
    gl.uniform3fv(this.mCameraPosRef, this.mCameraPos);
};

IllumShader.prototype.setMaterialAndCameraPos = function(m, p){
	this.mMaterial = m;
	this.mCameraPos = p;
};
/*
 * File: ShaderMaterial.js
 * Knows how to load aMaterial into the IllumShader
 * Rederences point to uMaterial.
 */

/*jslint node: true, vars: true */
/*global gEngine, vec4 */

"use strict";
/**
* Allows interfacing with webgl for material class.
* @class
*/
function ShaderMaterial(aIllumShader){
	var gl = gEngine.Core.getGL();
	this.mKaRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ka");
	this.mKdRef = gl.getUniformLocation(aIllumShader, "uMaterial.Kd");
	this.KsRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ks");
	this.mShineRef = gl.getUniformLocation(aIllumShader, "uMaterial.Shininess");
}

ShaderMaterial.prototype.loadToShader = function(aMaterial){
	var gl = gEngine.Core.getGL();
	gl.uniform4fv(this.mKaRef, aMaterial.getAmbient());
	gl.uniform4fv(this.mKdRef, aMaterial.getDiffuse());
	gl.uniform4fv(this.KsRef, aMaterial.getSpecular());
	gl.uniform1f(this.mShineRef, aMaterial.getShininess());
};
/*
 * File: ShadowCasterShader.js
 * Subclass from SpriteShader
 *      a little similar to LightShader, except, only defines
 *      one light: the one that casts the shadow
 */
/*jslint node: true, vars: true */
/*global gEngine, SpriteShader, ShaderLightAtIndex, vec4 */
"use strict";

function ShadowCasterShader(vertexShaderPath, fragmentShaderPath){
	SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);

	this.mLight = null; // the light that casts the shadow

	// **** The GLSL Shader must define uLights[1] <-- as the only light source!!
    this.mShaderLight = new ShaderLightAtIndex(this.mCompiledShader, 0);
}
gEngine.Core.inheritPrototype(ShadowCasterShader, SpriteShader);

ShadowCasterShader.prototype.activateShader = function (pixelColor, aCamera) {
    // first call the super class’s activate
    SpriteShader.prototype.activateShader.call(this, pixelColor, aCamera);
    this.mShaderLight.loadToShader(aCamera, this.mLight);
};

ShadowCasterShader.prototype.setLight = function(l){
	this.mLight = l;
}
/*
 * File: Camera.js
 * Encapsulates the user define WC and Viewport functionality
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec3: false, BoundingBox: false, CameraState:false, vec2:false*/

"use strict";

/**
* By default the bound is empty and the camera draws the entire viewport.
* @constructor
* @param {vec2} wcCenter - Center of the world coordinates
* @param {number} wcWidth -Width of the user defined WC. Height of the user defined WC is implicitly defined by the viewport aspect ratio.  wcHeight = wcWidth * viewport[3]/viewport[2]
* @param {Object[]} viewportRect - An array of 4 elements [x,y,width,height]
* @param{number} bound - Number of pixels surrounding the viewport of the camera left as the background color. A border basically.
*/
function Camera(wcCenter, wcWidth, viewportArray, bound) {
	this.mCameraState = new CameraState(wcCenter, wcWidth);

	this.mCameraShake = null;

	this.mViewport = []; // x,y,width,height
	this.mViewportBound = 0;
	if(bound !== undefined){
		this.mViewportBound = bound;
	}

	this.mScissorBound = [];
	this.setViewport(viewportArray, this.mViewportBound);

	this.mNearPlane = 0;
	this.mFarPlane = 1000;
	this.kCameraZ = 10; // for illumination computation

	// Transformation matrices
	this.mViewMatrix = mat4.create();
	this.mProjMatrix = mat4.create();
	this.mVPMatrix = mat4.create();

	// Background color
	this.mBgColor = [0.8,0.8,0.8,1];

	// per-rendering cached information
    this.mRenderCache = new PerRenderCache();
}

Camera.eViewport = Object.freeze({
    eOrgX: 0,
    eOrgY: 1,
    eWidth: 2,
    eHeight: 3
});

Camera.prototype.setWCCenter = function (xPos, yPos) {
    var p = vec2.fromValues(xPos, yPos);
    this.mCameraState.setCenter(p);
};
// Getters and Setters for instance vars
Camera.prototype.getWCCenter = function () { return this.mCameraState.getCenter(); };
Camera.prototype.setWCWidth = function (width) { this.mCameraState.setWidth(width); };
Camera.prototype.getWCWidth = function () { return this.mCameraState.getWidth(); };
Camera.prototype.getWCHeight = function () { return this.mCameraState.getWidth() * this.mViewport[Camera.eViewport.eHeight] / this.mViewport[Camera.eViewport.eWidth]; };


Camera.prototype.setViewport = function(viewportArray, bound) { 
	if(bound === undefined){
		bound = this.mViewportBound;
	}
	// [x, y, width, height]
    this.mViewport[0] = viewportArray[0] + bound;
    this.mViewport[1] = viewportArray[1] + bound;
    this.mViewport[2] = viewportArray[2] - (2 * bound);
	this.mViewport[3] = viewportArray[3] - (2 * bound);
	this.mScissorBound[0] = viewportArray[0];
    this.mScissorBound[1] = viewportArray[1];
    this.mScissorBound[2] = viewportArray[2];
    this.mScissorBound[3] = viewportArray[3];
};

/**
* Returns the actual bounds reserved for this camera. Includes the scissor bounds.
* @func
*/
Camera.prototype.getViewport = function() { 
	var out = [];
    out[0] = this.mScissorBound[0];
    out[1] = this.mScissorBound[1];
    out[2] = this.mScissorBound[2];
    out[3] = this.mScissorBound[3];
    return out;
};

Camera.prototype.setBackgroundColor = function(newColor) { this.mBgColor = newColor; };
Camera.prototype.getBackgroundColor = function() { return this.mBgColor; };

Camera.prototype.getVPMatrix = function () {
    return this.mVPMatrix;
};

/**
* @func
* @param {object} aXform - A transform
* @param {object} zone - The "walls" from the camera edges. Defines the relative size of WC that should be used in the collision computation
* @returns {boolean} returns the status of a given transform colliding with the camera edge, as adjusted by a zone.
*/
Camera.prototype.collideWCBound = function(aXform, zone){
	var bbox = new BoundingBox(aXform.getPosition(), aXform.getWidth(), aXform.getHeight());
	var w = zone * this.getWCWidth();
	var h = zone * this.getWCHeight();
	var cameraBound = new BoundingBox(this.getWCCenter(), w, h);
	return cameraBound.boundCollideStatus(bbox);
};

// Configures webGL and sets up View-Proj Transform
Camera.prototype.setupViewProjection = function () {
	var gl = gEngine.Core.getGL();
	// Step A: configure viewport
	// Step A1: Set up the viewport: area on canvas to be drawn
	/**
	* Specifies the affine transformation of x and y from normalized device coordinates to window coordinates.
	* @function
	* @param {number} x
 	* @param {number} y
 	* @param {number} width
 	* @param {number} height
 	*/
	gl.viewport(this.mViewport[0], this.mViewport[1], this.mViewport[2], this.mViewport[3]);
	// Step A2: set up the corresponding scissor area to limit clear area
	gl.scissor(this.mScissorBound[0], this.mScissorBound[1], this.mScissorBound[2], this.mScissorBound[3]);
	// Step A3: set the color to be cleared to black
	gl.clearColor(this.mBgColor[0], this.mBgColor[1], this.mBgColor[2], this.mBgColor[3]);
	// Step A4: enable and clear the scissor area
	gl.enable(gl.SCISSOR_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.disable(gl.SCISSOR_TEST);

	// Step B: define the View-Projection matrix

	// Step B1:
	var center = [];
	if(this.mCameraShake !== null){
		center = this.mCameraShake.getCenter();
	} else {
		center = this.getWCCenter();
	}
	/**
	* Define the view matrix, a given func from webGL lib
	* @function lookAt
	* @param {object} viewMatrix - assign the properties to this viewMatrix
 	* @param {array} eye - World Coord center, position of the viewer
 	* @param {number} center - Look At Position, point the viewer is looking at
 	* @param {number} up - Orientation, vec3 pointing up
 	*/
    mat4.lookAt(this.mViewMatrix,
        [center[0], center[1], this.kCameraZ],   // WC center
        [center[0], center[1], 0],    //
        [0, 1, 0]);     // orientation


	// Step B2: define the projection matrix
	var halfWCWidth = 0.5 * this.getWCWidth();
	var halfWCHeight = 0.5 * this.getWCHeight();

	/**
	* Generates a orthogonal projection matrix with the given bounds, a given func from webGL lib
	* @function ortho
	* @param {mat4} defines the dimesion of the WC, out mat4 frustum matrix will be written into
	* @param {number} distant to left of WC, left Left bound of the frustum
	* @param {number} distant to right of WC, right Right bound of the frustum
	* @param {number} distant to bottom of WC, bottom Bottom bound of the frustum
	* @param {number} distant to top of WC, top Top bound of the frustum
	* @param {number} z-distant to near plane, near Near bound of the frustum
	* @param {number} z-distant to far plane, far Far bound of the frustum
	* @returns {mat4} out
 	*/
	mat4.ortho(this.mProjMatrix, //defines the dimesion of the WC
		-halfWCWidth,      // distant to left of WC
         halfWCWidth,      // distant to right of WC
        -halfWCHeight,     // distant to bottom of WC
         halfWCHeight,     // distant to top of WC
         this.mNearPlane,  // z-distant to near plane
         this.mFarPlane    // z-distant to far plane
	);
	/**
	* Applies the matrix transforms
	* @function multiply
	* @param {mat4} view projection matrix
	* @param {mat4} projection matrix
	* @param {mat4} view matrix
	*/
	mat4.multiply(this.mVPMatrix, this.mProjMatrix, this.mViewMatrix);

	// Step B4: compute and cache per-rendering information
	this.mRenderCache.mWCToPixelRatio = this.mViewport[Camera.eViewport.eWidth] / this.getWCWidth();
	this.mRenderCache.mCameraOrgX = center[0] - (this.getWCWidth()/2);
	this.mRenderCache.mCameraOrgY = center[1] - (this.getWCHeight()/2);

	var p = this.wcPosToPixel(this.getWCCenter());
	this.mRenderCache.mCameraPosInPixelSpace[0] = p[0];
	this.mRenderCache.mCameraPosInPixelSpace[1] = p[1];
	this.mRenderCache.mCameraPosInPixelSpace[2] = this.fakeZInPixelSpace(this.kCameraZ);
};

Camera.prototype.getPosInPixelSpace = function(){ return this.mRenderCache.mCameraPosInPixelSpace;};

/**
* Ensure that the bounds of a transform, from a renderable or Game Object, stay within WC bounds.
* The camera will not be changed if the aXform bounds are completely outside the tested WC bounds area
* @func
* @param {object} aXform - A transform
* @param {object} zone - The "walls" from the camera edges. Defines the relative size of WC that should be used in the collision computation
* @returns {boolean} returns the status of a given transform colliding with the camera edge, as adjusted by a zone.
*/
Camera.prototype.clampAtBoundary = function (aXform, zone){
	var status = this.collideWCBound(aXform, zone);
	if( status !== BoundingBox.eboundCollideStatus.eInside){
		var pos = aXform.getPosition();
		if((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0){
			pos[1] = (this.getWCCenter())[1] + (zone* this.getWCHeight()/2) - aXform.getHeight()/2;
		}
		if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0){
			pos[1] = (this.getWCCenter())[1] - (zone * this.getWCHeight() / 2) + (aXform.getHeight() / 2);
		}
		if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0){
			pos[0] = (this.getWCCenter())[0] + (zone * this.getWCWidth() / 2) - (aXform.getWidth() / 2);
		}
        if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0){
			pos[0] = (this.getWCCenter())[0] - (zone * this.getWCWidth() / 2) + (aXform.getWidth() / 2);
		}
	}
	return status;
};
/**
* Since Camera funcs are implemented multiple times while rendering the LightShader object, some values do not need to be recomputed. Efficient.
* This should be used for rendering purposes only. No functionality. These values don't change once a rendering begins. Used in Xform operations.
* Needed for computing transforms for shaders. Updated each time in setupViewProjection()
* @class
*/
function PerRenderCache(){
	this.mWCToPixelRatio = 1; //WC to Pixel transform
	this.mCameraOrgX = 1; //Lower left in WC
	this.mCameraOrgY = 1;
	this.mCameraPosInPixelSpace = vec3.fromValues(0, 0, 0);
}
/*
 * File: Camera_Manipulation.js
 * Provides camera manipulation functionality
 */

/*jslint node: true, vars: true */
/*global Camera: false, vec2: false, gEngine: false, CameraShake: false, Renderable: false, mat4: false, vec3: false, BoundingBox: false, */

"use strict";

/**
* @func
* @param {number} dx - X direction to move camera by
* @param {number} dy - Y direction to move camera by
*/
Camera.prototype.panBy = function(dx, dy){
	var newC = vec2.clone(this.getWCCenter());
	this.mWCCenter[0] += dx;
	this.mWCCenter[1] += dy;
	this.mCameraState.setCenter(newC);
};
/**
* @func
* @param {number} cx - X position to move camera to
* @param {number} cy - Y position to move camera to
*/
Camera.prototype.panTo = function(cx, cy){
	this.setWCCenter(cx, cy);
};
/**
* Keeps the camera on a transform, a Game Object or Renderable, by moving the WCCenter.
* The camera will not be changed if the aXform bounds are completely outside the tested WC bounds area
* @func
* @param {transform} aXform - a Game Object or Renderable
* @param {object} zone - The "walls" from the camera edges. Defines the relative size of WC that should be used in computation
*/
Camera.prototype.panWith = function(aXform, zone){
	 var status = this.collideWCBound(aXform, zone);
	 if (status !== BoundingBox.eboundCollideStatus.eInside){
	 	var pos = aXform.getPosition();
	 	var newC = vec2.clone(this.getWCCenter());
	 	if ((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0){
			newC[1] = pos[1] + (aXform.getHeight() / 2) - (zone * this.getWCHeight() / 2);
	 	}
        if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0){
			newC[1] = pos[1] - (aXform.getHeight() / 2) + (zone * this.getWCHeight() / 2);
		}
        if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0){
			newC[0] = pos[0] + (aXform.getWidth() / 2) - (zone * this.getWCWidth() / 2);
		}
        if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0){
            newC[0] = pos[0] - (aXform.getWidth() / 2) + (zone * this.getWCWidth() / 2);
		}
		this.mCameraState.setCenter(newC);
	 }
};

/**
* If the zoom variable is greater than 1, the WC window size becomes larger.
* You will see more of the world and, thus, zoom out. Zoom < 1
* zoom > 1 ==> zooming out, see more of the world
* zoom < 1 ==> zooming in, see less of the world, more detailed
* @func
* @param {number} zoom - Amount to zoom by, greater than 0
*/
Camera.prototype.zoomBy = function(zoom){
	if(zoom > 0){
		this.setWCWidth(this.getWCWidth() * zoom);
	}
};

/**
* Zooms the camera towards a position
* @func
* @param {array} pos - Position to move camera to
* @param {number} zoom - Amount to zoom by
*/
Camera.prototype.zoomTowards = function (pos, zoom) {
    var delta = [];
    var newC = [];
    vec2.sub(delta, pos, this.getWCCenter());
    vec2.scale(delta, delta, zoom - 1);
    vec2.sub(newC, this.getWCCenter(), delta);
    this.zoomBy(zoom);
    this.mCameraState.setCenter(newC);
};

Camera.prototype.update = function () {
	if (this.mCameraShake !== null){
		if(this.mCameraShake.shakeDone()){
			this.mCameraShake = null;
		} else {
			this.mCameraShake.setRefCenter(this.getWCCenter());
			this.mCameraShake.updateShakeState();
		}
	}
    this.mCameraState.updateCameraState();
};

Camera.prototype.configInterpolation = function (stiffness, duration) {
    this.mCameraState.configInterpolation(stiffness, duration);
};

Camera.prototype.shake = function(xDelta, yDelta, shakeFrequency, duration){
	this.mCameraShake = new CameraShake(this.mCameraState, xDelta, yDelta, shakeFrequency, duration);
};
/*
 * File: Camera_Input.js
 * Defines the functions that supports mouse input coordinate transforms
 */

/*jslint node: true, vars: true, bitwise: true */
/*global gEngine, Camera, BoundingBox, vec2, CameraShake */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

/*
* Transforms mouse positions from canvas coordinates to device coordinate space.
* this.mViewport[Camera.eViewport.eOrgX] -> this.mViewport[0] -> the x coord of where the viewport starts
* @func
*/
Camera.prototype._mouseDCX = function(){				// Camera.eViewport.eOrgX = 0
	return gEngine.Input.getMousePosX() - this.mViewport[Camera.eViewport.eOrgX];
};

Camera.prototype._mouseDCY = function() {				// Camera.eViewport.eOrgY = 1
	return gEngine.Input.getMousePosY() - this.mViewport[Camera.eViewport.eOrgY];
};

/*
* Checks if mouse is within viewport
* @func
* @returns boolean
*/
Camera.prototype.isMouseInViewport = function(){
	var dcX = this._mouseDCX();
	var dcY = this._mouseDCY();
	return ((dcX >= 0) && (dcX < this.mViewport[Camera.eViewport.eWidth]) &&
            (dcY >= 0) && (dcY < this.mViewport[Camera.eViewport.eHeight]));
};

/*
* Returns the mouse X position in world coordinates.
* @func
* @returns number
*/
Camera.prototype.mouseWCX = function(){
	var minWCX = this.getWCCenter()[0] - this.getWCWidth() / 2;
	return minWCX + (this._mouseDCX() * (this.getWCWidth() / this.mViewport[Camera.eViewport.eWidth]));
};

Camera.prototype.mouseWCY = function(){
	var minWCY = this.getWCCenter()[1] - this.getWCHeight() / 2;
	return minWCY + (this._mouseDCY() * (this.getWCHeight()/ this.mViewport[Camera.eViewport.eHeight]));
};
/*
 * File: Camera_Xform.js
 * Defines the functions that supports camera to pixel space transforms (mainly for illumination support)
 */

/*jslint node: true, vars: true, bitwise: true */
/*global Camera, vec3*/

Camera.prototype.fakeZInPixelSpace = function(z){
	return z * this.mRenderCache.mWCToPixelRatio;
};

/**
* Converts from WC to pixel space for a vec3. This is accomplished by subtracting the camera origin followed by scaling with the mWCToPixelRatio. 
* The 0.5 offset at the end of the x and y conversion ensure that you are working with the center of the pixel rather than a corner.
* @param {vec3} p - Position, vec3, xyz, fake z
*/
Camera.prototype.wcPosToPixel = function(p){
	var x = this.mViewport[Camera.eViewport.eOrgX] + ((p[0] - this.mRenderCache.mCameraOrgX) * this.mRenderCache.mWCToPixelRatio) + 0.5;
	var y = this.mViewport[Camera.eViewport.eOrgY] + ((p[1] - this.mRenderCache.mCameraOrgY) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    var z = this.fakeZInPixelSpace(p[2]);
    return vec3.fromValues(x, y, z);
};

Camera.prototype.wcSizeToPixel = function(s) {
    return (s * this.mRenderCache.mWCToPixelRatio) + 0.5;
};

Camera.prototype.wcDirToPixel = function(d) {
    var x = d[0] * this.mRenderCache.mWCToPixelRatio;
	var y = d[1] * this.mRenderCache.mWCToPixelRatio;
	var z = d[2];
	return vec3.fromValues(x, y, z);
};
/*
 * File: CameraState.js
 * Supports gradual changes in the camera.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, InterpolateVec2: false, vec2: false, Interpolate: false, */

"use strict";

/**
* Class for state of the camera. mCenter and mWidth are both InterpolateVec2 objects, a subclass of Interpolate.
* @constructor
* @param {vec2} center - Center to support panning.
* @param {number} width - Width to support zooming.
*/
function CameraState(center, width) {
    this.kCycles = 300;  // number of cycles to complete the transition
    this.kRate = 0.1;    // rate of change for each cycle
    this.mCenter = new InterpolateVec2(center, this.kCycles, this.kRate);
    this.mWidth = new Interpolate(width, this.kCycles, this.kRate);
}

CameraState.prototype.getCenter = function(){ return this.mCenter.getValue();};
CameraState.prototype.getWidth = function (){ return this.mWidth.getValue(); };

CameraState.prototype.setCenter = function (c){ this.mCenter.setFinalValue(c); };
CameraState.prototype.setWidth = function (w){ this.mWidth.setFinalValue(w); };

CameraState.prototype.updateCameraState = function(){
	this.mCenter.updateInterpolation();
	this.mWidth.updateInterpolation();
};

CameraState.prototype.configInterpolation = function (stiffness, duration) {
    this.mCenter.configInterpolation(stiffness, duration);
    this.mWidth.configInterpolation(stiffness, duration);
};
/*
 * File: CameraShake.js
 * Supports camera shake effect.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, ShakePosition: false, InterpolateVec2: false, vec2: false, Interpolate: false, */

"use strict";

/**
* Shaking is in relation to the camera center position
* @constructor
* @param {number} state - Camera state gives the center of a camera.
* @param {number} xDelta - Severity of the shake in x direction
* @param {number} yDelta - Severity of the shake in the y direction
* @param {number} shakeDuration - How rapidly the camera shakes
* @param {number} shakeDuration - How long the shake lasts, number of cycles to complete the shake
*/
function CameraShake(state, xDelta, yDelta, shakeFrequency, shakeDuration){
	this.mOrgCenter = vec2.clone(state.getCenter());
	this.mShakeCenter = vec2.clone(this.mOrgCenter);
	this.mShake = new ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration);
}

/**
* Triggers the displacement computation for the shaking effect
* @func
*/
CameraShake.prototype.updateShakeState = function () {
    var s = this.mShake.getShakeResults();
	// The mShakeCenter is the sum of the original center and the shake results
    vec2.add(this.mShakeCenter, this.mOrgCenter, s);
};

CameraShake.prototype.shakeDone = function () {
    return this.mShake.shakeDone();
};

CameraShake.prototype.getCenter = function () { return this.mShakeCenter; };
CameraShake.prototype.setRefCenter = function (c) {
    this.mOrgCenter[0] = c[0];
    this.mOrgCenter[1] = c[1];
};

