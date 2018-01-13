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

## Chapter 8.3 Multiple Lights

Distance attenuation - Gradual fading of light at the edges
Near Cutoff distance/Far Cutoff distance: where distance attenuation will begin and end.
Light intensity to be added to Light object.

To build the infrastructure for supporting multiple light sources in the engine and in GLSL shaders
To understand and examine the distance attenuation effects of light
To experience controlling and manipulating multiple light sources in a scene

## Chapter 8.4 Diffuse Reflection and Normal Mapping

Illumination along boundries of squares changes uniformly (Not sure what this is describing or what I'm missing, seems fine to me. Double checked the master version as well). I'm observing boundry surfaces being illuminated by light sources that seem to be behind the surface. Illumination calculation does not consider geometric contours from image content (I get it now).

Diffuse reflection and normal mapping will approx normal vectors of surfaces.


Surface Normal Vector/surface normal/normal vector - Vector that is perpendicular to a give surface element.

Proportion of light energy recieved and reflected by a diffuse surface normal is proportional to the cos of the angle between its normal and the light vector.

Normal Texture/normal map will be added to color texture to apply light effects to show contours.
Each texel of a normal map encodes the xyz values of a normal vector in the RGB channels. In lieu of displaying the normal map texels as you would with a color texture, the texels are used purely for calculating how the surface would interact with light.

WebGL texture units will be adjusted. Color texture binding to unit 0 and normal texture binding to unit 1.

## Chapter 8.5 Specular Reflection and Materials

Shininess can be determined using angles and material values. N is shininess. N describes how rapidly specular light highlight will roll off. Larger N means that the cosine function decreases faster as alpha angle increases, the faster the specular highlight drops off and the glossier the material appears.

Using halfway vector to model specular highlights. Saves on computation. (N * H)^n vs (V * R)^n

Three Terms of Phong Illumination Model

* Ambient term: K~a + I~aC~a
* Diffuse term: I~lC~lK~d(N * L)
* Specular term: I~lC~lK~s(N * H)


Material Object to be created to handle material of a IllumRenderable.

## Chapter 8.6 Light Source Types - Point, Directional, Spotlight

Point Light - What we've been modelling
Directional - Like the Sun, multiple parallel light rays coming from the same direction. Has no distance drop off. Typically global lights.
Spotlight - Point light encompassed by a cone pointing in a specific direction, the light direction, with angular attenuation parameters for the inner and outer cone angles


## Chapter 8.7 Shadow Simulation

Shadows convey relative sizes, depths, distances, orderings

Computationally, this is an expensive operation because general visibility determination is an O(n) operation, where n is the number of objects in the scene. Algorithmically, this is a challenging problem because the visibility computation needs to occur within the fragment shader during illumination computation

Dedicated shadow caster and reciever based on the WebGL stencil buffer.

Shadow caster: This is the object that causes the shadow. In the Figure 8-23 example, the Hero object is the shadow caster.

Shadow receiver: This is the object that the shadow appears on. In the Figure 8-23 example, the Minion object is the shadow receiver.

Shadow caster geometry: This is the actual shadow, in other words, the darkness on the shadow receiver because of the occlusion of light. In the Figure 8-23 example, the dark imprint of the hero appearing on the minion behind the actual hero object is the shadow caster geometry.

Shadow Simulation Algorithm:
1) Compute shadow caster geometry
2) Render shadow caster as usual
3) Render shadow caster geometry as a dark shadow caster object over the receiver.
4) Render shadow caster as usual


For example, to render the shadow in Figure 8-23, the dark hero shadow caster geometry is first computed based on the positions of the light source, the Hero object (shadow caster), and the Minion object (shadow receiver).

After that, the Minion object (shadow receiver) is first rendered as usual, followed by rendering the shadow caster geometry as the Hero object with a dark constant color, and lastly the Hero object (shadow caster) is rendered as usual.

Problem occurs when the shadow caster geometry extends beyond the bounds of the shadow reciever.

WebGL stencil buffer is designed specifically to resolve these types of situations

Shadow Simulation Algorithm:
Given a shadowReceiver
    A: Draw the shadowReceiver to the canvas as usual

    // Stencil operations to enable the region for drawing shadowCaster
    B1: Initialize all stencil buffer pixels to off
    B2: Switch on the stencil buffer pixels that correspond to the shadowReceiver object
    B3: Enable stencil buffer checking

    // Compute shadowCaster geometries and draw them on the shadowReceiver
    C: For each shadowCaster of this shadowReceiver
         D: For each shadow casting light source
               D1: Compute the shadowCaster geometry
               D2: Draw the shadowCaster geometry

Goals
Understand shadows can be simulated by rendering explicit geometries
Appreciate the basic operations of the WebGL stencil buffer
Understand the simulation of shadows with shadow caster and receiver
Implement the shadow simulation algorithm based on the WebGL stencil buffer