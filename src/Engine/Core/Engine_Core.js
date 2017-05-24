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
            mGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
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
            gEngine.Input.initialize();
            gEngine.DefaultResources.initialize(function() { 
                // myGame defined in index.html
                startScene(myGame);
            });
    };

    // Clears the draw area and draws one square
    var clearCanvas = function(color) {
    	// set the color to be cleared
        mGL.clearColor(color[0], color[1], color[2], color[3]);

        // clear to the color previously set
        mGL.clear(mGL.COLOR_BUFFER_BIT);      
    };

    //Contains the functions and variables that will be accessible
    var mPublic = {
        getGL: getGL,
        initializeEngineCore: initializeEngineCore,
        clearCanvas: clearCanvas
    };

    return mPublic;
})();