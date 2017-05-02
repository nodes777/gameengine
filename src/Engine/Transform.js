/*
* Transform Object
*/
/*jslint node: true, vars: true, evil: true */
/*global gGL: false, loadAndCompileShader: false,
    gSquareVertexBuffer: false, document: false, gEngine: false,*/

 function Transform(){
 	//vec.fromValues()???
 	// Translation
 	this.mPosition = vec2.fromValues(0,0);
 	//Scaling
 	this.mScale = vec2.fromValues(1,1);
 	//Rotation in radians
 	this.mRoatationInRad = 0.0;
 }

 // Position getters and setters
Transform.prototype.setPosition = function(xPos,yPos) {
	this.setXPos(xPos); 
	this.setYPos(yPos);
};
Transform.prototype.setXPos = function(xPos){
	this.mPosition[0] = xPos;
};

Transform.prototype.setYPos = function(yPos) {
	this.mPosition[1] = yPos;
};

Transform.prototype.incXPosBy = function(delta){
	this.mPosition[0] += delta;
};

Transform.prototype.incYPosBy = function(delta){
	this.mPosition[1] += delta;
};

Transform.prototype.getPosition = function() { 
	return this.mPosition;
};

Transform.prototype.getXPos = function (){
	return this.mPosition[0];
};

Transform.prototype.getYPos = function (){
	return this.mPosition[1];
};

//Scale setters and getters
Transform.prototype.setSize = function(width,height){
	this.setWidth(width);
	this.setHeight(height);
};

Transform.prototype.setWidth = function(width) {
	this.mScale[0] = width;
};

Transform.prototype.setHeight = function(height){
	this.mScale[1] = height;
};

Transform.prototype.incSizeBy = function (delta) {
    this.incWidthBy(delta);
    this.incHeightBy(delta);
};

Transform.prototype.getWidth = function () { return this.mScale[0]; };
Transform.prototype.getHeight = function () { return this.mScale[1]; };
Transform.prototype.incWidthBy = function (delta) { this.mScale[0] += delta; };
Transform.prototype.incHeightBy = function (delta) { this.mScale[1] += delta; };

//Rotation setters and getters
Transform.prototype.setRotationInRad = function (rotationInRadians) {
	this.mRotationInRad = rotationInRadians;
	// Flip it around if you're rotating more than 360
	while (this.mRotationInRad > (2 * Math.PI)) {
        this.mRotationInRad -= (2 * Math.PI);
    }
};

Transform.prototype.setRotationInDegree = function (rotationInDegree) {
    this.setRotationInRad(rotationInDegree * Math.PI / 180.0);
};
Transform.prototype.incRotationByDegree = function (deltaDegree) {
    this.incRotationByRad(deltaDegree * Math.PI / 180.0);
};
Transform.prototype.incRotationByRad = function (deltaRad) {
    this.setRotationInRad(this.mRotationInRad + deltaRad);
};
Transform.prototype.getRotationInRad = function () {  return this.mRotationInRad; };
Transform.prototype.getRotationInDegree = function () { return this.mRotationInRad * 180.0 / Math.PI; };

//Return a TRS matrix
Transform.prototype.getXform = function() {
	// Create blank identity matrix
	var matrix = mat4.create();

	// Functions from loaded webgl library
	mat4.translate(matrix, matrix, vec3.fromValues(this.getXPos(), this.getYPos(), 0.0));

	mat4.rotateZ(matrix, matrix, this.getRotationInRad());

	mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));

	return matrix;
};