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

function SimpleShader(vertexShaderID, fragmentShaderID) {
    // instance variables (Convention: all instance variables: mVariables)
	// reference to the compiled shader in webgl context
    this.mCompiledShader = null;
	//reference to pixelColor uniform in fragment shader
	this.mPixelColor = null;
    // reference to SquareVertexPosition in shader
    this.mShaderVertexPositionAttribute = null;

    var gl = gEngine.Core.getGL();

    // Step A: load and compile vertex and fragment shaders
    var vertexShader = this._loadAndCompileShader(vertexShaderID, gl.VERTEX_SHADER);
    var fragmentShader = this._loadAndCompileShader(fragmentShaderID,
        gl.FRAGMENT_SHADER);

    // Step B: Create and link the shaders into a program.
	// native GLSL funcs
    this.mCompiledShader = gl.createProgram();
    gl.attachShader(this.mCompiledShader, vertexShader);
    gl.attachShader(this.mCompiledShader, fragmentShader);
    gl.linkProgram(this.mCompiledShader);

    // Step C: check for error
    if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
        alert("Error linking shader");
        return null;
    }

    // Step D: Gets a reference to the aSquareVertexPosition attribute
	// Is this looking for the aSquareVertexPosition inside the shader program with that string? Yes
    // GLint glGetAttribLocation(GLuint program, const GLchar *name);
    // name Points to a null terminated string containing the name of the attribute variable whose location is to be queried
    // aSquareVertexPosition: is defined in the VertexShader (in the index.html file)
    this.mShaderVertexPositionAttribute = gl.getAttribLocation(this.mCompiledShader,"aSquareVertexPosition");

    // Step E: Activates the vertex buffer loaded in Engine.Core_VertexBuffer
	// gSquareVertexBuffer: is defined in VertexBuffer.js and
    // initialized by the InitSquareBuffer() function.
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLVertexRef());

    /// Step F: Describe the characteristic of the vertex position attribute
    gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
        3,              // each element is a 3-float (x,y.z)
        gl.FLOAT,       // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);             // offsets to the first element

	this.mPixelColor = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
}

// Returns a complied shader from a shader in the dom.
// The id is the id of the script in the html tag.
SimpleShader.prototype._loadAndCompileShader = function(filepath, shaderType) {
    var shaderText, shaderSource, compiledShader;
    var gl = gEngine.Core.getGL();

    // Step A: Get the shader source from the folder
    var xmlReq = new XMLHttpRequest();
	xmlReq.open('GET', filepath, false);

	try {
		xmlReq.send();
	} catch (error){
		alert("Failed to Load shader: "+ filepath);
		return null;
	}
    shaderSource = xmlReq.responseText;

	if (shaderSource === null) {
	    alert("WARNING: Loading of:" + filePath + " Failed!");
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

SimpleShader.prototype.activateShader = function(pixelColor) {
    var gl = gEngine.Core.getGL();
    gl.useProgram(this.mCompiledShader);
    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
	//uniform4fv (A WebGLUniformLocation object containing the location of the uniform, newVal for uniform)
	gl.uniform4fv(this.mPixelColor, pixelColor);
};

SimpleShader.prototype.getShader = function() { return this.mCompiledShader; };