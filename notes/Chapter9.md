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

Extracting Collision Information - To provide a proper collision resolution, you need to compute the collision depth (how hard of a collision) and collision normal (the angle)

Collision depth: Smallest amount that the objects interpenetrated where the collision normal is the direction along which the collision depth is measured
Any interpenetration can be resolved by moving the objects along the collision normal by collision depth distance. The RigidShape collision functions must be modified to compute for this information

The normal vector is derived from vec, the result of clamping the components of the vFrom1to2 vector by the colliding side of the rectangle. Image 9-5

When the circle center is inside the bounds of the rectangle, instead of clamping, you must extend corresponding vFrom1to2 components to compute the vec vector and reverse it, as the vFrom1to2 always goes to the center of the circle.