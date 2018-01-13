/*
 * File: MyGame_Shadow: Initializes and sets up shadow, called at end of MyGame initialize() function, all GameObject instances have been properly created
 */
/*jslint node: true, vars: true */
/*global gEngine, MyGame, ShadowReceiver */

"use strict"

/**
* Initializes and sets up shadow, called at end of MyGame initialize() function, all GameObject instances have been properly created.
* 3 kinds of renderables can receive: IllumRenderable, SpriteAnimateRenderable, and LightRenderable, respectively
* @func
*/
MyGame.prototype._setupShadow = function () {
    this.mBgShadow = new ShadowReceiver(this.mBg);
    this.mBgShadow.addShadowCaster(this.mLgtHero);
    this.mBgShadow.addShadowCaster(this.mIllumMinion);
    this.mBgShadow.addShadowCaster(this.mLgtMinion);

    this.mMinionShadow = new ShadowReceiver(this.mIllumMinion);
    this.mMinionShadow.addShadowCaster(this.mIllumHero);
    this.mMinionShadow.addShadowCaster(this.mLgtHero);
    this.mMinionShadow.addShadowCaster(this.mLgtMinion);

    this.mLgtMinionShadow = new ShadowReceiver(this.mLgtMinion);
    this.mLgtMinionShadow.addShadowCaster(this.mIllumHero);
    this.mLgtMinionShadow.addShadowCaster(this.mLgtHero);
};
