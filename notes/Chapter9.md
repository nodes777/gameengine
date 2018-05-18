# Chapter 9 Physics

## 9.1 Simple Physics

* Derive the basic infrastructure to support collision detection between rigid shapes
* Understand and implement collision detection algorithms between bounding boxes and circles
* Lay the foundation for building a physics component



9.1 glsl out of range problem: Engine_VertextBuffer.js was missing a line for buffering data
 // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfLine), gl.STATIC_DRAW);


## 9.2 Resolving Collisions - The Rigid Shape Impulse Project

* To experience implementing movements based on Symplectic Euler Integration
* To understand the need for and experience the implementation of collecting collision information
* To build a physics component with relaxation support


* Objects will not be rotated as a response in collisions

Symplectic Euler Integration

newVelocity = currentVelocity + currentAcceleration * dt
newPosition = currentPosition + newVelocity * dt

dt is the step defined in the game loop update

1) Modify RigidShape class to include:
	* Mass
	* Restituition (bounciness)
	* Acceleration
	* Friction
	* Velocity
	*

2) Add rigidShapeBehavior.js with setters and gettings for those values

3) Extracting Collision Information - To provide a proper collision resolution, you need to compute the collision depth (how hard of a collision) and collision normal (the angle)

Collision depth: Smallest amount that the objects interpenetrated where the collision normal is the direction along which the collision depth is measured
Any interpenetration can be resolved by moving the objects along the collision normal by collision depth distance. The RigidShape collision functions must be modified to compute for this information

The normal vector is derived from vec, the result of clamping the components of the vFrom1to2 vector by the colliding side of the rectangle. Image 9-5

When the circle center is inside the bounds of the rectangle, instead of clamping, you must extend corresponding vFrom1to2 components to compute the vec vector and reverse it, as the vFrom1to2 always goes to the center of the circle.


4) Add Core Engine_Physics.js

Calculate the correction amount in the collision normal direction as a function of depth and mass of colliding objects.
Objects with infinite mass will not be moved, as the correction amount is inversely proportional to the mass of the object and scaled by mPosCorrectionRate.

5) Resolving a collision
Steps A sets mHasOneCollision to true to ensure that that relaxation loop will continue.
Steps B calls to _positionalCorrection() to apply positional correction to the objects to push them apart by 80 percent (by default) of the collision depth.
Step C calls to _applyFriction() to dampen the tangent component of the object velocities.
Step D calculates the relative velocity between the two objects by subtracting them. This relative velocity is important for computing the impulse that pushes the objects apart.
Step E computes rVelocityInNormal, the component of the relative velocity vector that is in the collision normal direction. This component indicates how rapidly the two objects are moving toward or away from each other. If rVelocityInNormal is greater than zero, then the objects are moving away from each other and impulse response will not be necessary.
Step F computes the impulse magnitude, j, based on rVelocityInNormal, restitution (bounciness), and the masses of the colliding objects. This impulse magnitude value will be used to modify both velocities to push them apart.



## 9.3 Particles and Particle Systems

Understand the details of how to draw a particle and define its behaviors
Experience implementing a particle system
Build a particle engine component that supports interaction with RigidShape