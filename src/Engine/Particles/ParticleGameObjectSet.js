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
}
gEngine.Core.inheritPrototype(ParticleGameObjectSet, GameObjectSet);


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
    var i, obj;
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        if (obj.hasExpired()) {
            this.removeFromSet(obj);
        }
    }
};