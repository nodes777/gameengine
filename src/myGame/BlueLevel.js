/*
 * File: BlueLevel.js
 * This is the logic of our game.
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, SceneFileParser: false */
"use strict";

function BlueLevel() {
    // scene file name
    this.kSceneFile = "assets/BlueLevel.xml";
    // all squares
    this.mSqSet = [];  // these are the renderable objects
    // The camera to view the scene
    this.mCamera = null;
}
/**
* This takes the Blue level and has it inherit the functions of the Scene class.
* It is important to call the inheritPrototype() function right after the constructor before any new prototype methods are defined for BlueLevel.
* @function
*/
gEngine.Core.inheritPrototype(BlueLevel, Scene);

BlueLevel.prototype.loadScene = function() {
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile);
};
BlueLevel.prototype.initialize = function() {
    // ... identical to MyGame.initialize from previous project ...
    var sceneParser = new SceneFileParser(this.kSceneFile);
    // Step A: parse the camera
    this.mCamera = sceneParser.parseCamera();
    // Step  B: parse for all the squares
    sceneParser.parseSquares(this.mSqSet);
};
BlueLevel.prototype.draw = function() {
    // ... identical to MyGame.draw from previous project ...
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  C: draw all the squares
    for (var i = 0; i<this.mSqSet.length; i++) {
        this.mSqSet[i].draw(this.mCamera.getVPMatrix());
    }
};
BlueLevel.prototype.update = function() {
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
    // ... identical to MyGame.update from previous project ...

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        redXform.incXPosBy(-deltaX);
        if (redXform.getXPos() < 11) { // this is the left-boundary
			//stop the game loop
            gEngine.GameLoop.stop();
        }
    }
};
BlueLevel.prototype.unloadScene = function() {
    // unload the scene flie
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);

    var nextLevel = new MyGame();  // the next level
    gEngine.Core.startScene(nextLevel);
};