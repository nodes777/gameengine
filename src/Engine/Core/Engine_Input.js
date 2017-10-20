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

