/*
 * File: ShaderSupport.js
 * Support the loading, compiling, and linking of shader code
 *
 * Notice:  although in a different file, we have access to
 *          global variables defined in WebGL.js: gGL
 *
 *          In the same way, the global variable gSimpleShader defined in this
 *          file will be accessible to any other javascript source code in
 *          our project.
 */
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, alert: false, loadAndCompileShader: false,
    gSquareVertexBuffer: false, document: false */
 /* find out more about jslint: http://www.jslint.com/help.html */

"use strict";
// Reference to the shader program stored in gGL context.
var gSimpleShader = null;

 // gGL reference to the attribute to be used by the VertexShader
var gShaderVertexPositionAttribute = null;

// Loads/compiles/links shader programs to gGL context
function initSimpleShader(vertexShaderID, fragmentShaderID) {
    // Step A: load and compile vertex and fragment shaders
    var vertexShader = loadAndCompileShader(vertexShaderID, gGL.VERTEX_SHADER);
    var fragmentShader = loadAndCompileShader(fragmentShaderID, gGL.FRAGMENT_SHADER);

    // Step B: Create and link the shaders into a program.
    // native GLSL funcs
    gSimpleShader = gGL.createProgram();
    gGL.attachShader(gSimpleShader, vertexShader);
    gGL.attachShader(gSimpleShader, fragmentShader);
    gGL.linkProgram(gSimpleShader);

    // Step C: check for error
    if (!gGL.getProgramParameter(gSimpleShader, gGL.LINK_STATUS)) {
        alert("Error linking shader");
    }

    // Step D: Gets a reference to the SquareVertexPosition variable within the shaders.
    // Is this looking for the aSquareVertexPosition inside the shader program with that string? Yes
    // GLint glGetAttribLocation(GLuint program, const GLchar *name);
    // name Points to a null terminated string containing the name of the attribute variable whose location is to be queried
    // aSquareVertexPosition: is defined in the VertexShader (in the index.html file)
    gShaderVertexPositionAttribute = gGL.getAttribLocation(gSimpleShader, "aSquareVertexPosition");


    // Step E: Activates the vertex buffer loaded in VertexBuffer.js
    // gSquareVertexBuffer: is defined in VertexBuffer.js and
    // initialized by the InitSquareBuffer() function.
    gGL.bindBuffer(gGL.ARRAY_BUFFER, gSquareVertexBuffer);


    // Step F: Describe the characteristic of the vertex position attribute
    gGL.vertexAttribPointer(gShaderVertexPositionAttribute, // variable initialized above
        3,          // each vertex element is a 3-float (x,y,z)
        gGL.FLOAT,  // data type is FLOAT
        false,      // if the content is normalized vectors
        0,          // number of bytes to skip in between elements
        0);         // offsets to the first element
}

// Returns a compiled shader from a shader in the dom.
function loadAndCompileShader(id, shaderType) {
    var shaderText, shaderSource, compiledShader;

    // Step A: Get the shader source from index.html
    // The id is the id of the script in the html tag.
    //why would you do this this way? putting the shader program in html. Dumb as hell
    shaderText = document.getElementById(id);
    shaderSource = shaderText.firstChild.textContent;

    // Step B: Create the shader based on the shader type: vertex or fragment
    //remember,gGL is the canvas context
    compiledShader = gGL.createShader(shaderType);

    // Step C: Compile the created shader
    gGL.shaderSource(compiledShader, shaderSource);
    gGL.compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    if (!gGL.getShaderParameter(compiledShader, gGL.COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + gGL.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
}