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
            mGL = WebGLDebugUtils.makeDebugContext(mGL);

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