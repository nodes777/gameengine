/*
 * File: RigidShapeBehavior.js
 * Defines rigid shape behavior for collisions
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, LineRenderable, RigidShape */


/**
* Updates physics objects using symplectic Euler
* @func
*/
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

RigidShape.prototype.getInvMass = function(){ return this.mInvMass;}
RigidShape.prototype.setMass = function(m){
	if(m>0){
		this.mInvMass = 1/m; // Inverse the mass. Why?
	} else {
		this.mInvMass = 0;
	}
}

RigidShape.prototype.getVelocity = function () { return this.mVelocity; };
RigidShape.prototype.setVelocity = function (v) { this.mVelocity = v; };
RigidShape.prototype.getRestitution = function () { return this.mRestitution; };
RigidShape.prototype.setRestitution = function (r) { this.mRestitution = r; };
RigidShape.prototype.getFriction = function () { return this.mFriction; };
RigidShape.prototype.setFriction = function (f) { this.mFriction = f; };
RigidShape.prototype.getAcceleration = function () { return this.mAcceleration; };
RigidShape.prototype.setAcceleration = function (g) { this.mAcceleration = g; };