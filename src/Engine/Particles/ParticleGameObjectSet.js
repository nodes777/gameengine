/*
 * File: ParticleGameObjectSet.js
 * Supports sets for Particles
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, ParticleRenderable, Particle, vec4 */

"use strict";

/**
* Set for Particles, inherits the GameObjectSet
* @class
*/
function ParticleGameObjectSet() {
    GameObjectSet.call(this);
    this.mEmitterSet = [];
}
gEngine.Core.inheritPrototype(ParticleGameObjectSet, GameObjectSet);

ParticleGameObjectSet.prototype.addEmitterAt = function (p, n, func) {
    var e = new ParticleEmitter(p, n, func);
    this.mEmitterSet.push(e);
};

/**
* Overrides the standard GameObjectSet draw method for addititve blending
* @func
*/
ParticleGameObjectSet.prototype.draw = function(aCamera){
	var gl = gEngine.Core.getGL();
	gl.blendFunc(gl.ONE, gl.ONE); // For additive blending
    GameObjectSet.prototype.draw.call(this, aCamera);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);// Restore alpha blending
}

ParticleGameObjectSet.prototype.update = function () {
    GameObjectSet.prototype.update.call(this);

    // Cleanup Particles
    var i, e, obj;
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        if (obj.hasExpired()) {
            this.removeFromSet(obj);
        }
    }

    // Emit new particles
    for (i=0; i<this.mEmitterSet.length; i++) {
        e = this.mEmitterSet[i];
        e.emitParticles(this);
        if (e.expired()) {
            this.mEmitterSet.splice(i, 1);
        }
    }
};


