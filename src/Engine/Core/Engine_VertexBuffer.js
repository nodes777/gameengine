/*jslint node: true, vars: true, evil: true */
/*global initSquareBuffer: false, initSimpleShader: false, document: false,
  gSimpleShader: false, gShaderVertexPositionAttribute: false*/

"use strict";  // Operate in Strict mode

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

    var mSquareVertexBuffer = null;

    var getGLVertexRef = function() { return mSquareVertexBuffer; };

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
    };

    var mPublic = {
        initialize: initialize,
        getGLVertexRef: getGLVertexRef
    };
    return mPublic;
}());