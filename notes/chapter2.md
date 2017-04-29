#Chapter 2 HTML5 and WebGL
* OpenGL Shading Language (GLSL)
* Create a contiguous buffer in the GPU

Shaders run in the GPU, always a pair, a vertex shader then a fragment shader.
A vertex shader runs once per primitive vertex
A fragment shader runs once per PIXEL covered by the primitive

In
```var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
```
The GPU will run the vertex shader 4 times, once per vertex

The GPU will run the fragment shader 10000 times (100*100), once for each of the 100x100 pixels

WebGL context is an abstraction of the GPU hardware

----------------
GLSL is a C-like language, for the GPU
* gl_Position, gl_FragColor - built in variables

##Compile, Link, and Load the Vertex and Fragment Shaders


 step D locates and stores the reference to the aSquareVetexPosition attribute defined in your vertex shader. Step E activates the vertex buffer you loaded in VertexBuffer.js, and step F connects the activated buffer to the aSquareVertexPosition attribute by describing the data format of the vertex buffer, where each vertex position is a three-float (x, y, z) position.

WebGL draws vertices within a +- 1 range in X and Y directions. So a canvas of 640x480 and vertices of

``` [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
```
do not give a square. It's a rectangle because it's mapped onto that rectangled canvas.


-----------
Chapter 2.4 - Encapsulation
------------

All graphical objects will be drawn based on the unit square - gEngine.VertexBUffer

Functions that are meant to be private will have names that begin with an underscore (_), as in _loadAndCompileShader(). Convention is not call _function outside of its object

-----------
Chapter 2.5 - Seperating out the GLSL
------------
* TO DO - make a modern xmlReq request?

-----------
Chapter 2.6 - Parameterizing Fragment Shader
------------
