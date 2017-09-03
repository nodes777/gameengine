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

	// reference to aTextureCoordinate from the shader
	var gl = gEngine.Core.getGL();
	this.mShaderTextureCoordAttribute = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
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
    * @param{number} size - each element is a 2-float (x,y.z)
    * @param{gl.magic} type - data type is FLOAT
    * @param{boolean} normalized - if the content is normalized vectors
    * @param{number} stride - number of bytes to skip in between elements
    * @param{number} offset - offsets to the first element
    */
	gl.vertexAttribPointer(this.mShaderTextureCoordAttribute, 2, gl.FLOAT, false,0,0);
};