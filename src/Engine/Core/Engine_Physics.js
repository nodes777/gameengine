/*
 * File: EngineCore_Physics.js 
 * Physics engine supporting projection and impulse collision resolution. 
 */
/*jslint node: true, vars: true, white: true */
/*global vec2, CollisionInfo */

"use strict";

var gEngine = gEngine || { };

gEngine.Physics = (function(){
	var mRelaxationCount = 15; // number of relaxtion iteration
	var mRelaxationOffset = 1/mRelaxationCount; //proportion to apply when scaling friction
	var mPosCorrectionRate = 0.8; // percentage of seperation to project objects
	var mSystemAcceleration = [0,-50]; //System wide acceleration


	var mRelaxationLoopCount = 0; // the current relaxation count
	var mHasOneCollision = false; // detect the first collision

	var mCollisionInfo = null;   // information of the current collision

	var initialize = function() {
	    mCollisionInfo = new CollisionInfo();   // to avoid allocating this constantly
	};

	/**
	* @param {object} s1 - The first colliding object
	* @param {object} s2 - The second colliding object
	* @param {object} collisionInfo - Information about the collision
	* Finds the new correct position for colliding objects, by scaling and adding vectors
	* @func
	*/
	var _positionalCorrection = function(s1, s2, collisionInfo){
		var s1InvMass = s1.getInvMass();
		var s2InvMass = s2.getInvMass();

		var num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * mPosCorrectionRate;
		var correctionAmount = [0,0];
		vec2.scale(correctionAmount, collisionInfo.getNormal(), num);

		var ca = [0, 0];
	    vec2.scale(ca, correctionAmount, s1InvMass);
	    var s1Pos = s1.getPosition();
	    vec2.subtract(s1Pos, s1Pos, ca);

	    vec2.scale(ca, correctionAmount, s2InvMass);
	    var s2Pos = s2.getPosition();
	    vec2.add(s2Pos, s2Pos, ca);

	};

	/**
	* @param {vec2} n - collision normal
	* @param {vec2} v - velocity
	* @param {num} f - friction
	* @param {num} m - invMass
	* Applies friction to colliding rigidshapes. Figure 9-8, friction is simulated by applying a deceleration in the tangent direction of the collision.
	* @func
	*/
	var _applyFriction = function(n, v, f, m) {
	    var tangent = vec2.fromValues(n[1], -n[0]);  // perpendicular to n
	    var tComponent = vec2.dot(v, tangent);
	    if (Math.abs(tComponent) < 0.01)
	        return;

	    f *= m * mRelaxationOffset;
	    if (tComponent < 0) {
	        vec2.scale(tangent, tangent, -f);
	    } else {
	        vec2.scale(tangent, tangent, f);
	    }
	    vec2.sub(v, v, tangent);
	};

	/**
	* @param {object} s1 - The first colliding object
	* @param {object} s2 - The second colliding object
	* @param {object} collisionInfo - Information about the collision
	* Resolves the collision of two rigidshapes
	* @func
	*/
	var resolveCollision = function (s1, s2, collisionInfo){
		// Step A: one collision has been found
        mHasOneCollision = true;

        // Step B: correct positions
        _positionalCorrection(s1, s2, collisionInfo);

        // Step C: apply friction
        var s1V = s1.getVelocity();  // collision normal direction is _against_ s2
        var s2V = s2.getVelocity();
        var n = collisionInfo.getNormal();
        _applyFriction(n, s1V, s1.getFriction(), s1.getInvMass());
        _applyFriction(n, s2V, -s2.getFriction(), s2.getInvMass());

		// Step D: Compute the relative velocity of the colliding objects: important for computing the impulse that pushes the objects apart
		var relativeVelocity = [0,0];
		vec2.sub(relativeVelocity, s2V, s1V);

		// Step E: examine the component in the normal direction
		var rVelocityInNormal = vec2.dot(relativeVelocity, n);
        if (rVelocityInNormal > 0) { //if objects moving apart ignore
            return;
        }

		// Step F: compute and apply response impulses for each object
		var newRestituion = Math.min(s1.getRestitution(), s2.getRestitution())
		var j = -(1+newRestituion) * rVelocityInNormal;
		j = j / (s1.getInvMass() + s2.getInvMass());

		var impulse = [0, 0];
		vec2.scale(impulse, collisionInfo.getNormal(), j);
		
		var newImpulse = [0, 0];
        vec2.scale(newImpulse, impulse, s1.getInvMass());
        vec2.sub(s1V, s1V, newImpulse);

        vec2.scale(newImpulse, impulse, s2.getInvMass());
        vec2.add(s2V, s2V, newImpulse);
	};

	var beginRelaxation = function() {
		mRelaxationLoopCount = mRelaxationCount;
		mHasOneCollision = true;
	};

	var continueRelaxation = function() {
		var oneCollision = mHasOneCollision;
		mHasOneCollision = false;
		mRelaxationLoopCount = mRelaxationLoopCount - 1;
		return ((mRelaxationLoopCount > 0) && oneCollision);
	}

	// Relaxation of resolving the collision between two individual GameObject instances
	var processObjObj = function(obj1, obj2){
		var s1 = obj1.getPhysicsComponent();
		var s2 = obj2.getPhysicsComponent();

		if( s1 === s2) {
			return;
		}

		beginRelaxation();
		while(continueRelaxation()){
			if(s1.collided(s2, mCollisionInfo)){
				resolveCollision(s1, s2, mCollisionInfo);
			}
		}
	};

	//process the collision resolution between a GameObject instance and a GameObjectSet
	var processObjSet = function (obj, set){
		var s1 = obj.getPhysicsComponent();
		var i, s2;
		beginRelaxation();
		while(continueRelaxation()){
			for(i=0; i<set.size(); i++){
				s2 = set.getObjectAt(i).getPhysicsComponent();
				if((s1 !== s2) && (s1.collided(s2, mCollisionInfo))){
					resolveCollision(s1, s2, mCollisionInfo);
				}
			}
		}
	};

	// Process the collision resolution between two GameObjectSets
	var processSetSet = function(set1, set2) {
	    var i, j, s1, s2;
	    beginRelaxation();
	    while (continueRelaxation()) {
	        for (i=0; i<set1.size(); i++) {
	            s1 = set1.getObjectAt(i).getPhysicsComponent();
	            for (j=0; j<set2.size(); j++) {
	                s2 = set2.getObjectAt(j).getPhysicsComponent();
	                if ((s1 !== s2) && (s1.collided(s2, mCollisionInfo))) {
	                    resolveCollision(s1, s2, mCollisionInfo);
	                }
	            }
	        }
	    }
	};

    // Rigid Shape interactions: a set against itself
    var processSelfSet = function(set) {
        var i, j, s1, s2;
        beginRelaxation();
        while (continueRelaxation()) {
            for (i=0; i<set.size(); i++) {
                s1 = set.getObjectAt(i).getPhysicsComponent();
                for (j=i+1; j<set.size(); j++) {
                    s2 = set.getObjectAt(j).getPhysicsComponent();
                    if ((s1 !== s2) && (s1.collided(s2, mCollisionInfo))) {
                        resolveCollision(s1, s2, mCollisionInfo);
                    }
                }
            }
        }
    };
	// Setters and Getters
	var getSystemAcceleration = function() { return mSystemAcceleration; };
	var setSystemAcceleration = function(g) { mSystemAcceleration = g; };
	var getRelaxationCorrectionRate = function() { return mPosCorrectionRate; };
	var setRelaxationCorrectionRate = function(r) {
	    if ((r <= 0) || (r>=1)) {
	        r = 0.8;
	    }
	    mPosCorrectionRate = r;
	};
	var getRelaxationLoopCount = function() { return mRelaxationCount; };
	var setRelaxationLoopCount = function(c) {
	    if (c <= 0)
	        c = 1;
	    mRelaxationCount = c;
	    mRelaxationOffset = 1/mRelaxationCount;
	};

	var mPublic = {
		initialize: initialize,
	    resolveCollision: resolveCollision,
	    beginRelaxation: beginRelaxation,
	    continueRelaxation: continueRelaxation,
	    getSystemAcceleration: getSystemAcceleration,
	    setSystemAcceleration: setSystemAcceleration,
	    getRelaxationCorrectionRate: getRelaxationCorrectionRate,
	    setRelaxationCorrectionRate: setRelaxationCorrectionRate,
	    getRelaxationLoopCount: getRelaxationLoopCount,
	    setRelaxationLoopCount: setRelaxationLoopCount,
	    processObjObj: processObjObj,
	    processObjSet: processObjSet,
	    processSetSet: processSetSet,
		processSelfSet: processSelfSet
	 };
	return mPublic;
}());