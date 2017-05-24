/*
 * File: MyGame.js
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, Camera: false, mat4: false, vec3: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

function MyGame(htmlCanvasID) {
    // scene file name
    this.kSceneFile = "assets/scene.xml";
    // all squares as Renderables
    this.mSqSet = new Array();

    // The camera to view the scene
    this.mCamera = null;
}

MyGame.prototype.initialize = function() {

    var sceneParser = new SceneFileParser(this.kSceneFile);
    // Step A: parse the camera
    this.mCamera = sceneParser.parseCamera();

    // Step  B: parse for all the squares
    sceneParser.parseSquares(this.mSqSet);

    
    this.mConstColorShader = gEngine.DefaultResources.getConstColorShader();

    // Step  C: Create the renderable objects:
    this.mWhiteSq = new Renderable(this.mConstColorShader);
    this.mWhiteSq.setColor([1, 1, 1, 1]);
    this.mRedSq = new Renderable(this.mConstColorShader);
    this.mRedSq.setColor([1, 0, 0, 1]);

    // Step  D: Initialize the white renderable object: centred, 5x5, rotated
    this.mWhiteSq.getXform().setPosition(20, 60);
    this.mWhiteSq.getXform().setRotationInRad(0.2); // In Radian
    this.mWhiteSq.getXform().setSize(5, 5);

    // Step  E: Initialize the red renderable object: centered 2x2
    this.mRedSq.getXform().setPosition(20, 60);
    this.mRedSq.getXform().setSize(2, 2);

    // Step F: Start the game loop running
    //
    gEngine.GameLoop.start(this);
};

MyGame.prototype.update = function() {
    // For this very simple game, let’s move the white square and pulse the red
    var whiteXform = this.mSqSet[0].getXform();
    var deltaX = 0.05;

    // Step A: test for white square movement
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (whiteXform.getXPos() > 30)  // the right-bound of the window
            whiteXform.setPosition(10, 60);
        whiteXform.incXPosBy(deltaX);
    }

    // Step  B: test for white square rotation
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up))
        whiteXform.incRotationByDegree(1);

    var redXform = this.mSqSet[1].getXform();
    // Step  C: test for pulsing the red square
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (redXform.getWidth() > 5)
            redXform.setSize(2, 2);
        redXform.incSizeBy(0.05);
    }
};

MyGame.prototype.draw = function() {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  C: draw all the squares
    for (var i = 0; i<this.mSqSet.length; i++) {
        this.mSqSet[i].draw(this.mCamera.getVPMatrix());
    }
};

MyGame.prototype.loadScene = function(){
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile);
};

/**@function - delete mResourceMap[rName]*/
MyGame.prototype.unloadScene = function(){
    gEngine.TextFileLoader.unloadScene(this.kSceneFile);
}