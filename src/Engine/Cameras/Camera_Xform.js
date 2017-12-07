/*
 * File: Camera_Xform.js
 * Defines the functions that supports camera to pixel space transforms (mainly for illumination support)
 */

/*jslint node: true, vars: true, bitwise: true */
/*global Camera, vec3*/

Camera.prototype.fakeZInPixelSpace = function(z){
	return z * this.mRenderCache.mWCToPixelRatio;
};

/**
* Converts from WC to pixel space for a vec3. This is accomplished by subtracting the camera origin followed by scaling with the mWCToPixelRatio. 
* The 0.5 offset at the end of the x and y conversion ensure that you are working with the center of the pixel rather than a corner.
* @param {vec3} p - Position, vec3, xyz, fake z
*/
Camera.prototype.wcPosToPixel = function(p){
	var x = this.mViewport[Camera.eViewport.eOrgX] + ((p[0] - this.mRenderCache.mCameraOrgX) * this.mRenderCache.mWCToPixelRatio) + 0.5;
	var y = this.mViewport[Camera.eViewport.eOrgY] + ((p[1] - this.mRenderCache.mCameraOrgY) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    var z = this.fakeZInPixelSpace(p[2]);
    return vec3.fromValues(x, y, z);
};

Camera.prototype.wcSizeToPixel = function(s) {
    return (s * this.mRenderCache.mWCToPixelRatio) + 0.5;
};

Camera.prototype.wcDirToPixel = function(d) {
    var x = d[0] * this.mRenderCache.mWCToPixelRatio;
	var y = d[1] * this.mRenderCache.mWCToPixelRatio;
	var z = d[2];
	return vec3.fromValues(x, y, z);
};