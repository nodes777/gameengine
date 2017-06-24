/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, console: false, Camera: false, vec2: false, Renderable: false, TextureRenderable: false, */

"use strict";

/**
* @constructor
* @param {string} - Path to file used as unique id to get to the value
* @classdesc The Scene File Parser takes the path of an XML file as a unique id to return an XML file from the resource map.
*/
function SceneFileParser(sceneFilePath) {
	this.mSceneXml = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
}

SceneFileParser.prototype._getElm = function(tagElm) {
	var theElm = this.mSceneXml.getElementsByTagName(tagElm);
		if(theElm.length === 0) {
			console.error("Warning: Level element:[" + tagElm + "]: is not found!"); 
		}
		return theElm;
};

/**
* Get the camera element from XML, get the attributes, ensure background color and viewport are number arrays.
* Construct a new camera from those values and return it.
* @function
*/
SceneFileParser.prototype.parseCamera = function (){
	var camElm = this._getElm("Camera");
	var cx = Number(camElm[0].getAttribute("CenterX"));
	var cy = Number(camElm[0].getAttribute("CenterY"));
    var w = Number(camElm[0].getAttribute("Width"));
    var viewport = camElm[0].getAttribute("Viewport").split(" ");
    var bgColor = camElm[0].getAttribute("BgColor").split(" ");

	// make sure viewport and color are numbers
    for (var j = 0; j<4; j++) {
        bgColor[j] = Number(bgColor[j]);
        viewport[j] = Number(viewport[j]);
    }

var cam = new Camera(
            vec2.fromValues(cx, cy),   // position of the camera
            w,                         // width of camera
            viewport                   // viewport (orgX, orgY, width, height)
            );
    cam.setBackgroundColor(bgColor);
    return cam;
};

/**
* Parses the XML file to create Renderable objects
* sq to be placed in the array that is passed in as a parameter.
* @param {array} sqSet - Array that will hold the Renderables that are created in this function
* @function
*/
SceneFileParser.prototype.parseSquares = function(sqSet) {
	var elm = this._getElm("Square");
	var i, j, x, y, w, h, r, c, sq;
	for(i=0; i<elm.length; i++) {
		x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
        w = Number(elm.item(i).attributes.getNamedItem("Width").value);
        h = Number(elm.item(i).attributes.getNamedItem("Height").value);
        r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
        c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");

	sq = new Renderable (gEngine.DefaultResources.getConstColorShader());

    // make sure color array contains numbers
	for (j = 0; j<3; j++) {
		c[j] = Number(c[j]);
	}
	sq.setColor(c);
	sq.getXform().setPosition(x, y);
	sq.getXform().setRotationInDegree(r); // In Radian
	sq.getXform().setSize(w, h);
	sqSet.push(sq);
	}
};


/**
* Parses the XML file to create Renderable Texture objects
* sq to be placed in the array that is passed in as a parameter.
* @param {array} sqSet - Array that will hold the Texture Renderables that are created in this function
* @function
*/
SceneFileParser.prototype.parseTextureSquares = function (sqSet) {
    var elm = this._getElm("TextureSquare");
    var i, j, x, y, w, h, r, c, t, sq, i;
    for (i = 0; i < elm.length; i++) {
        x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
        w = Number(elm.item(i).attributes.getNamedItem("Width").value);
        h = Number(elm.item(i).attributes.getNamedItem("Height").value);
        r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
        c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
        t = elm.item(i).attributes.getNamedItem("Texture").value;
        sq = new TextureRenderable(t);
        // make sure color array contains numbers
        for (j = 0; j < 4; j++)
            c[j] = Number(c[j]);
        sq.setColor(c);
        sq.getXform().setPosition(x, y);
        sq.getXform().setRotationInDegree(r); // In Degree
        sq.getXform().setSize(w, h);
        sqSet.push(sq);
    }
};