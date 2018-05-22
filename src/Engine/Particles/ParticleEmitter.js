/*
 * File: ParticleEmitter.js
 * Programmactically create particles
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, ParticleGameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

/**
* Creates an emitter, more like an event listener, the actual particles are created in the callback function.
* @param {vec2} pos - Position for particle emitter, can be a reference to xform.mPosition
* @param {num} num - Number of particles left to be emitted
* @param {func} creatorFunc - callback function for actual particles creation
* @class
*/
function ParticleEmitter(pos, num, creatorFunc){
	this.kMinToEmit = 5; // Defaule/Smallest number of particle emitted per cycle
	this.mEmitPosition = pos;
	this.mNumRemains = num; // Number of particles left to be emitted
	this.mParticleCreator = creatorFunc;
}

ParticleEmitter.prototype.expired = function(){
	return (this.mNumRemains <= 0);
};

ParticleEmitter.prototype.emitParticles = function (pSet){
	var numToEmit = 0;
	if(this.mNumRemains < this.kMinToEmit){
		// If only a few are left, emits all of them
        numToEmit = this.mNumRemains;
	} else {
		// Otherwise emit about 20% of whats left
		numToEmit = Math.random() * 0.2 * this.mNumRemains;
	}
	// Left for future emitting.
    this.mNumRemains -= numToEmit;
    var i, p;
    for (i = 0; i < numToEmit; i++) {
        p = this.mParticleCreator(this.mEmitPosition[0], this.mEmitPosition[1]);
        pSet.addToSet(p);
	}
}