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

2) Add rigidShapeBehavior.js