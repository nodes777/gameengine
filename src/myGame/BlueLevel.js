/*
 * File: BlueLevel.js
 * This is the logic of our game.
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, SceneFileParser: false */
"use strict";

function BlueLevel() {
	this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/BlueLevel_cue.wav";
	// textures: jpg does not support transparency
	this.kPortal = "assets/minion_portal.jpg";
	this.kCollector = "assets/minion_collector.jpg";
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
	gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);
	gEngine.Textures.loadTexture(this.kPortal);
	gEngine.Textures.loadTexture(this.kCollector);
};
BlueLevel.prototype.initialize = function() {
    // ... identical to MyGame.initialize from previous project ...
    var sceneParser = new SceneFileParser(this.kSceneFile);
    // Step A: parse the camera
    this.mCamera = sceneParser.parseCamera();
    // Step  B: parse for all the squares
    sceneParser.parseSquares(this.mSqSet);

    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);

    sceneParser.parseTextureSquares(this.mSqSet);
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
    // ... identical to MyGame.update from previous project ...

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
		gEngine.AudioClips.playACue(this.kCue);
        redXform.incXPosBy(-deltaX);
        if (redXform.getXPos() < 11) { // this is the left-boundary
			//stop the game loop
            gEngine.GameLoop.stop();
        }
    }

	//continuosly change texture tinting
	// mSqSet[1} should be jpg but I think its a square that I didnt remove from previous project
	var c = this.mSqSet[1].getColor();
	var ca = c[3]+deltaX;
	if (ca > 1) {
      ca = 0;
    }
    c[3] = ca;
};
BlueLevel.prototype.unloadScene = function() {
	gEngine.AudioClips.stopBackgroundAudio();
    // unload the scene flie
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);

	gEngine.AudioClips.unloadAudio(this.kBgClip);
    gEngine.AudioClips.unloadAudio(this.kCue);

	gEngine.Textures.unloadTexture(this.kPortal);
	gEngine.Textures.unloadTexture(this.kCollector);

    var nextLevel = new MyGame();  // the next level
    gEngine.Core.startScene(nextLevel);
};