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