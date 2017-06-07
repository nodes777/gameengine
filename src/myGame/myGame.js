/*
 * File: MyGame.js
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, Camera: false, mat4: false, vec3: false, vec2: false */
/* global Array: false, SceneFileParser: false */

"use strict";

function MyGame(htmlCanvasID) {
	this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/MyGame_cue.wav";
    // scene file name
    this.kSceneFile = "assets/scene.xml";
    // all squares as Renderables
    this.mSqSet = [];

    // The camera to view the scene
    this.mCamera = null;
}

gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.initialize = function() {

    var sceneParser = new SceneFileParser(this.kSceneFile);
    // Step A: parse the camera
    this.mCamera = sceneParser.parseCamera();
    // Step  B: parse for all the squares
    sceneParser.parseSquares(this.mSqSet);

    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);

};

MyGame.prototype.update = function() {
    // For this very simple game, let’s move the white square and pulse the red
    var whiteXform = this.mSqSet[0].getXform();
    var deltaX = 0.05;

    // Step A: test for white square movement
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
		gEngine.AudioClips.playACue(this.kCue);
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

	if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
		gEngine.AudioClips.playACue(this.kCue);
        redXform.incXPosBy(-deltaX);
        if (redXform.getXPos() < 11) {  // this is the left-bound
         gEngine.GameLoop.stop();
        }
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
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);
};

/**@function - delete mResourceMap[rName]*/
MyGame.prototype.unloadScene = function(){
    //gEngine.TextFileLoader.unloadScene(this.kSceneFile);

    // stop the background audio before unloading it
    gEngine.AudioClips.stopBackgroundAudio();

    // unload the scene resources
    // gEngine.AudioClips.unloadAudio(this.kBgClip);
	//      The above line is commented out on purpose because
    //      you know this clip will be used elsewhere in the game
    //      so you decide to not unload this clip!!
    gEngine.AudioClips.unloadAudio(this.kCue);

    // starts the next level
    var nextLevel = new BlueLevel();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};