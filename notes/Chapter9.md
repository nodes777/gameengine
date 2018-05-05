# Chapter 9 Physics

## 9.1 Simple Physics

* Derive the basic infrastructure to support collision detection between rigid shapes
* Understand and implement collision detection algorithms between bounding boxes and circles
* Lay the foundation for building a physics component



9.1 glsl out of range problem: Engine_VertextBuffer.js was missing a line for buffering data
 // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfLine), gl.STATIC_DRAW);