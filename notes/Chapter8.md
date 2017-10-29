# Chapter 8 - Implementing Illumination and Shadow

* Understand the parameters of simple illumination models
* Define infrastructure supports for working with multiple light sources
* Understand the basics of diffuse reflection and normal mapping
* Understand the basics of specular reflection and the Phong illumination model
* Implement GLSL shaders to simulate diffuse and specular reflection and the Phong illumination model
* Create and manipulate point, directional, and spotlights
* Simulate shadows with the WebGL stencil buffer

Using the Phong illumination model.

Elements in the Phong Model

* Ambient Light
* Light Source
* Multiple Light Sources
* Diffuse Reflection and Normal Maps - Simulates diffuse lighting and reflection in 2D
* Specular Light and Material - Models reflecting light off surfaces and reaching the camera
* Light Source Types - Introduces illumination based on different types of light sources
* Shadow - Approximates results from light occulsion

To experience the effects of ambient lighting
To understand how to implement a simple global ambient across a scene
To refamiliarize yourself with the Shader/Renderable pair structure to interface to GLSL shaders and the game engine

## Chapter 8.1
Implements simple lighting interface

## Chapter 8.2

Shader objects interface to GLSL shaders
Renderables provide the programmer convience of manipulating many copies of geometries of the same shader type.
For example, TextureVS and TextureFS are interfaced to the game engine via the TextureShader object, and the TextureRenderable objects allow game programmers to create and manipulate multiple instances of geometries shaded by the TextureVS/FS shaders.

The Light Class will encapsulate the attributes of point light including position radius and color. This info will be forwarded to  LightFS, via the LightShader/LightRenderable pair for computing the appropriate pixel colors.

The GLSL fragment shader is invoked once for every pixel covered by the corresponding geometry. This means millions of times per sec for the whole scene. Efficiency is important.

Goals:
* To understand how to simulate the illumination effects from a point light
* To experience illumination results from a point light
* To implement a GLSL shader that supports point light illumination