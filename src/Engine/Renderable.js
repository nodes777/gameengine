/*
* Renderable Constructor
*/

//A renderable contructor, that takes a SimpleShader from ShaderSupport.js
"use strict";
function Renderable (shader){
	this.mShader = shader;
	// Color for fragment shader
	this.mColor = [1, 1, 1, 1];  
}

Renderable.prototype.draw = function(){
	//gets the web context
	var gl = gEngine.Core.getGL();
	//activate it before you draw
	this.mShader.activateShader(this.mColor);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0 , 4);
};

Renderable.prototype.setColor = function(color){this.mColor = color;};
Renderable.prototype.getColor = function(){return this.mColor;};

