/*
 * File: ParticleRenderable.js
 *
 * ParticleRenderable specifically for particles (additive blending)
 */
/*jslint node: true, vars: true, white: true */
/*global gEngine, TextureRenderable, Renderable */

// Constructor and object definition
"use strict";

/**
* Particle Renderable derived from TextureRenderale
* @class
*/
function ParticleRenderable(myTexture) {
    TextureRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getParticleShader());
}
gEngine.Core.inheritPrototype(ParticleRenderable, TextureRenderable);