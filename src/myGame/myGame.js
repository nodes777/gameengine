/*
 * File: MyGame.js
 * This is the logic of our game.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, SpriteRenderable: false, Camera: false, vec2: false,
  TextureRenderable: false, Renderable: false, SpriteAnimateRenderable: false, GameOver: false,
  FontRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kMinionSprite = "assets/minion_sprite.png";
    // The camera to view the scene
    this.mCamera = null;

    // For echo message
    this.mMsg = null;

    // the hero and the support objects
    this.mHero = null;
    this.mMinionSet = null;
    this.mDyePack = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    // Step A: loads the textures
    gEngine.Textures.loadTexture(this.kMinionSprite);

    // Step B: loads all the fonts
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);

    // Step B: starts the next level
    var nextLevel = new GameOver();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 37.5),   // position of the camera
        100,                       // width of camera
        [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.5, 0.5, 0.5, 1]);
            // sets the background to gray

    // Step B: The dye pack: simply another GameObject
    this.mDyePack = new DyePack(this.kMinionSprite);

    this.mMinionSet = new GameObjectSet();
    var i = 0, randomY, aMinion;
    // create 5 minions at random Y values
    for (i = 0; i <  5; i++) {
        randomY = Math.random() * 65;
        aMinion = new Minion(this.kMinionSprite, randomY);
        this.mMinionSet.addToSet(aMinion);
    }

// Step D: Create the hero object
    this.mHero = new Hero(this.kMinionSprite);

    // Step E: Create and initialize message output
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(1, 2);
    this.mMsg.setTextHeight(3);
};

MyGame.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  C: draw everything
    this.mHero.draw(this.mCamera);
    this.mMinionSet.draw(this.mCamera);
    this.mDyePack.draw(this.mCamera);
    this.mMsg.draw(this.mCamera);

};

//  updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
  this.mHero.update();
    this.mMinionSet.update();
    this.mDyePack.update();
};