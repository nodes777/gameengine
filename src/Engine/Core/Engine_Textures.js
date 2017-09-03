/*
 * File: Engine_Textures.js
 */
/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, alert: false, Image: false*/

"use strict";

/**
* @constructor
* @param {string} name - path to the image file
* @param {number} w - width, pixel resolution
* @param {number} h- height, pixel resolution
* @param {string} id - A reference to the WebGL texture storage
* @classdesc TextureInfo - TextureInfo object description
*/
function TextureInfo(name, w, h, id){
	this.mName = name;
	this.mWidth = w;
	this.mHeight = h;
	this.mGLTexID = id;
	this.mColorArray = null;
}

var gEngine = gEngine || { };

gEngine.Textures = (function(){

	/**
	* Loads a texture so that it can be drawn. If already in the map, will just inc reference count
	* @function
	* @param{string} textureName - Path to resource as a unique identifying name.
	*/
	var loadTexture = function(textureName) {
	    if (!(gEngine.ResourceMap.isAssetLoaded(textureName)))  {
	        // Create new Texture object.
	       var img = new Image();

			// update resources in loading counter
			gEngine.ResourceMap.asyncLoadRequested(textureName);

			img.onload = function(){
				_processLoadedImage(textureName, img);
			};
			img.src = textureName;
	    } else {
	        gEngine.ResourceMap.incAssetRefCount(textureName);
	    }
	};

	var unloadTexture = function(textureName){
		var gl = gEngine.Core.getGL();
		var texInfo = gEngine.ResourceMap.retrieveAsset(textureName);
		// webGL func
		gl.deleteTexture(texInfo.mGLTexID);
		gEngine.ResourceMap.unloadAsset(textureName);
	};
	/**
	* Convert the format of an image and store it in the WebGL context.
	* @function
	* @param{string} textureName - Path as a unique id.
	* @param{object} image - Image object.
	*/
	var _processLoadedImage = function(textureName, image){
		var gl = gEngine.Core.getGL();

		// Create a webGL texture object, returns a unique id
		var textureID = gl.createTexture();

		// bind texture with the current texture functionality in webGL
		gl.bindTexture(gl.TEXTURE_2D, textureID);

		/**
		* load the texture into the texture data structure with descriptive info. Stores the image into the WebGL texture buffer
		* @function
		* @param{GLenum} target - Which "binding point" or target the texture is being loaded to.
		* @param{GLenum} level - Level of detail. Used for mipmapping. 0 is base texture level.
		* @param{GLenum} internalFormat - The composition of each element, i.e. pixels.
		* @param{GLenum} format - Format of texel data. Must match internal format..
		* @param{GLenum} type - The data type of the texel data.
		* @param{const GLvoid * data} data - Texture data, the image
		*/
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		// Create a mipmap for this texture
		gl.generateMipmap(gl.TEXTURE_2D);

		// Tells webGL we are done manipulating data at the mGL.TEXTURE_2D target
		gl.bindTexture(gl.TEXTURE_2D, null);

		// store all this info in the resource map
		var texInfo = new TextureInfo(textureName, image.naturalWidth, image.naturalHeight, textureID);
		gEngine.ResourceMap.asyncLoadCompleted(textureName, texInfo);
	};

	var activateTexture = function(textureName){
		var gl = gEngine.Core.getGL();
		var texInfo = gEngine.ResourceMap.retrieveAsset(textureName);

		// Binds our texture reference to the current webGL texture functionality
		gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);

		// Prevents texture wrappings, S and T are axes in textures
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		// Handles how magnification and minimization filters will work
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

		// For pixel-graphics where you want the texture to look "sharp" //  enable
		// gl.NEAREST: Returns the pixel that is closest to the coordinates,
		// gl.LINEAR: Returns the weighted average of the 4 pixels surrounding the given coordinates.
		// What about the mimap versions of these? Supposed to be "better"
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	};

	var deactivateTexture = function() {
	   var gl = gEngine.Core.getGL();
	   gl.bindTexture(gl.TEXTURE_2D, null);
	};

	var getTextureInfo = function(textureName){
		return gEngine.ResourceMap.retrieveAsset(textureName);
	};

	/**
	* Retrieve the color array from the WebGL context
	* @function
	* @param{string} textureName - The name of the texture to grab the info from
	*/
	var getColorArray = function(textureName){
		var texInfo = getTextureInfo(textureName);
		if(texInfo.mColorArray === null){
			// generate a frame buffer, bind it to the texture and read the color content
			var gl = gEngine.Core.getGL();
			var fb = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texInfo.mGLTexID, 0);

			if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)=== gl.FRAMEBUFFER_COMPLETE){
				// Uint8Array(length)
				// pixels are the width * height * 4 values rgba
				var pixels = new Uint8Array(texInfo.mWidth * texInfo.mHeight * 4);
				//
				gl.readPixels(0,0, texInfo.mWidth, texInfo.mHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
			 texInfo.mColorArray = pixels;
			} else {
				alert("WARNING: Engine.Textures.GetColorArray() failed!");
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.deleteFramebuffer(fb);
		}
		return texInfo.mColorArray;
	};

    var mPublic = {
		loadTexture: loadTexture,
    	unloadTexture: unloadTexture,
    	activateTexture: activateTexture,
    	deactivateTexture: deactivateTexture,
    	getTextureInfo: getTextureInfo,
		getColorArray: getColorArray
	};
    return mPublic;
})();

