/*
 * File: VertexBuffer.js
 *
 * Support the loading of the buffer that contains vertex positions of a square
 * onto the gGL context
 */

/*jslint node: true, vars: true */
/*global gGL: false, alert: false, loadAndCompileShader: false,
    document: false, Float32Array: false */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gSquareVertexBuffer = null;
// gGL reference to the vertex positions for the square

function initSquareBuffer() {
    // First: define the vertices for a square
    //x,y,z
    //z is 0, because 2d
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    // Step A: Create a buffer on the gGL context for our vertex positions
    //stores the reference for the GPU
    gSquareVertexBuffer = gGL.createBuffer();

    // Step B: Activate vertexBuffer
    //gGL is defined WebGL.js file and initialized by the initializedGL()
    //it's the canvas context
    gGL.bindBuffer(gGL.ARRAY_BUFFER, gSquareVertexBuffer);

    // Step C: Loads verticesOfSquare into the vertexBuffer
    //static draw says it won't be changed
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gGL.STATIC_DRAW);
}