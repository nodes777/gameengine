/*
* Sprite Shader Constructor
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false, gSquareVertexBuffer: false, document: false, gEngine: false,
  * Transform: false, TextureShader: false, SimpleShader: false*/
"use strict";
/**
* @constructor
* @param {string} vertexShaderPath - unique id path to vertex shader
* @param {string} fragmentShaderPath - unique id path to fragment shader
* @classdesc a subclass of Texture Shader, defines coord system on a sprite sheet.
*/
function SpriteShader(vertexShaderPath, fragmentShaderPath){
	// call the super class constructor
	TextureShader.call(this, vertexShaderPath, fragmentShaderPath);

	//gl buffer containing texture coordinate
	this.mTexCoordBuffer = null;

	var initTexCoord = [
	  1.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      0.0, 0.0
	];

	var gl = gEngine.Core.getGL();

	this.mTexCoordBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);

}
	// inherit the TextureShader properties
	gEngine.Core.inheritPrototype(SpriteShader, TextureShader);
	/**
    * Describe the characteristic of the vertex position attribute
    * @function
    * @param{array} texCoord - array of 8 floating point numbers that identify four corners of a subregioan in Texture Space, AKA 4 corners of a sprite sheet
    */
SpriteShader.prototype.setTextureCoordinate = function(texCoord){
	var gl = gEngine.Core.getGL();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);

	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
};
	/**
    * Activate sprite shader, calls SimpleShader.
    * @function
    * @param{array} texCoord - pixel color
    * @param{matrix} vpMatrix - view projection matrix
    */
SpriteShader.prototype.activateShader = function(pixelColor, aCamera){
	// call superclass activate
	//Simple Shader is used instead to avoid TextureShader's activating system's default texture coord buffer for rendering
	SimpleShader.prototype.activateShader.call(this, pixelColor, aCamera);

	// bind the proper texture coordinate buffer
	var gl = gEngine.Core.getGL();

	gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
	gl.vertexAttribPointer(this.mShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
};

SpriteShader.prototype.cleanUp = function(){
	var gl = gEngine.Core.getGL();
	gl.deleteBuffer(this.mTexCoordBuffer);

	SimpleShader.prototype.cleanUp.call(this);
};

// will be override by LightShader
SpriteShader.prototype.setLights = function (l) { };

// will be override by IllumShader
SpriteShader.prototype.setMaterialAndCameraPos = function(m, p) { };
