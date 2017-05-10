# Chapter 3: Drawing Objects in the World

* Renderable Objects
* Demonstrate how to create different instances of SimpleShader
* Demonstrate the ability to create multiple Renderable objects

Renderable.js lets us defing new instances of shading rectangles using an Renderable Constructor

Whats a Renderable? Just a rect for now?

# Chapter 3.2: Transforming Renderables

* Draw Multiple Renderables in different locastions and sizes
## Matrices as Transform Operators
    *A matrix is MxN rows and columns
    * We'll use 4x4

### Translation
    * T(tx,ty)
    * * moves a vertex from (x,y) to (x+tx, y+ty)
    * T(0,0) does not transform of a vertex position
    * -Useful inital value for accumulating translation operations
Example: (x,y) -> (x+tx, y+ty)
        (2,4) -> (2+3,4+3) = (5,7)

### Scaling
    * S(sx,sy)
    * Scales from (x,y) to (s*x,s*y)
    * S(1,1) does not change the value of a given vertex position

### Rotation
    * R(θ)
    * Rotates a given vertex position with respect to the origin
    * θ is expressed in radians usually

### Identity Operator
    * I
    * I doesn't affect a given vertex position
    * Mostly used for initialization
    * a 4x4 identity matrix:
    `
    I = [1,0,0,0
         0,1,0,0
         0,0,1,0
         0,0,0,1]
    `

    * A matrix transform operator operates on a vertex through matrix-vector multiplication

    * A vertex position (p=x,y,z) must be represented as a 4x1 vector:

    p= [x,
        y,
        z, //z is 3rd dimension usually 1
        1] // last value is saved for something we learn later

p' for a translation:

p' = Txp = Tp

## Matrix Operator Concatenation
    * Matrix operators can be combined into a single operator
    * Scale, Rotate, and Translate:
    p' = TRSp
    * also you can define your own combinations of operators:
    M = TRS
    p' = Mp
    * ORDER OF OPERATIONS IS IMPORTANT

## The glMatrix Library
* Fucking get a library for this shit mate!
* http://glMatrix.net

## Transform Object
* To abstract out the transformations
* The Transform object abstracts out the matrix operations so we can use them on Renderables

## View, Projections, and Viewports
* How do we handle representing the world?
* Two Coordinate Systems
    - Model Space: 1x1 square in vertex buffer
        + Unique for each geometric object
        + defines the geometry of each model
    - Nomarlized Device Coordinates (NDC): WebGL
        + Bound to +-1
        + Shown in Canvas
* Modeling Transform: opertaion that transforms models from Model Space to NDC

Model Space -> WebGL NDC -> Canvas Coords

World Coordinate System: solves the problem of -1 to +1 scale
    * Must transform WC to NDC - The View-Projection Transform

### The View-Transform operator:
    * uses 2 glMatrix lib funcs:
    * mat4.lookAt(viewMatrix, // defines the center
        [centerX, centerY, 10], //center of WC
        [centerX, centerY, 0],
        [0, 1, 0]); // orientation
    * mat4.ortho(projMatrix, // defines the dimension of the WC
        -distToLeft, // dist from (centerX, centerY) to left of WC
        distToRight,
        -distToBottom,
        distToTop,
        0, // Z distant to near plane
        1000); //z distant to far plane
The View-Transform operator (vpMatrix) is the concatenation of the View and Projection matrices
    * vpMatrix = projMatrix*viewMatrix
 ### The Viewport
    * An area to be drawn to
    * WebGl default is the entire canvas
        - Can override
    * gl.viewport(
    x,     // x position of bottom-left corner of the area to be drawn
    y,     // y position of bottom-left corner of the area to be drawn
    width, // width of the area to be drawn
    height // height of the area to be drawn
    );
    * WC -View-Projection Transfrom> WebGL NDC -Fixed Mapping> Viewport inside Canvas

## Chapter 3.4 Viewport Project
    * Understand Coordinate Systems
    * Define and draw subregions on canvas
    * Understand View and Projection transforms
    * Drawing in the user defined World Coordinate System
