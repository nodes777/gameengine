/*
 * File: RigidShapeBehavior.js
 * Defines rigid shape behavior for collisions
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, LineRenderable, RigidShape */

RigidShape.prototype.update = function() {
	var dt = gEngine.GameLoop.getUpdateIntervalInSeconds();

	// Symplectic Euler
    //    v += (1/m * a) * dt
    //    x += v * dt
    var v = this.getVelocity();
    vec2.scaleAndAdd(v, v, this.mAcceleration, (this.getInvMass() * dt ));

    var pos = this.getPosition();
    vec2.scaleAndAdd(pos, pos, v, dt);
};