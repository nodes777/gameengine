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
    // instance variables (Convention: all instance variables: mVariables)
	// reference to the compiled shader in webgl context
    this.mCompiledShader = null;
	//reference to pixelColor uniform in fragment shader
	this.mPixelColor = null;
    // reference to SquareVertexPosition in shader
    this.mShaderVertexPositionAttribute = null;
	// reference to model transform
	this.mModelTransform = null;
	// refence to View-Projection transform operator in SimpleVS.glsl
	this.mViewProjTransform = null;

    var gl = gEngine.Core.getGL();

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

	// Step G: Gets a reference to the uniform variables:
	this.mPixelColor = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
	this.mModelTransform = gl.getUniformLocation(this.mCompiledShader, "uModelTransform");
	this.mViewProjTransform = gl.getUniformLocation(this.mCompiledShader, "uViewProjTransform");
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

SimpleShader.prototype.activateShader = function(pixelColor, aCamera) {
    var gl = gEngine.Core.getGL();
    gl.useProgram(this.mCompiledShader);
	gl.uniformMatrix4fv(this.mViewProjTransform, false, aCamera.getVPMatrix());
    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
	//uniform4fv (A WebGLUniformLocation object containing the location of the uniform, newVal for uniform)
	gl.uniform4fv(this.mPixelColor, pixelColor);
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