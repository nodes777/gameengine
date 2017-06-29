#Chapter 5 - Textures, Sprites and Fonts
* Use any image or photograph as a texture representing characters or objects in your game
* Understand and use texture coordinates to identify a location on an image
* Optimize texture memory utilization by combining multiple characters and objects into one image
* Produce and control animations using sprite sheets
* Display texts of different fonts and sizes anywhere in your game

To represent objects, images with meaningful drawings are pasted, or mapped, on simple geometries. For example, a horse in a game can be represented by a square that is mapped with an image of a horse. In this way, a game developer can manipulate the transformation of the square to control the horse. This mapping of images on geometries is referred to as texture mapping in computer graphics.

In the case of your game engine, instead of drawing a constant color for each pixel occupied by the unit square, you will create GLSL shaders to strategically select texels from the texture and display the corresponding texel colors at the screen pixel locations covered by the unit square.

Texels: smallest graphical element in 2d. Representing texture space, like images are represented by arrays of pixels.

Texture Sampling: The process of selecting a texel, or converting a group of texels into a single color, to be displayed to a screen pixel location.

Introducing Texture Coordinate System and Texture Space, for handling images and resolutions. Images will have a 0-1 range for x and y. Origin is bottom left, 1,1 top right.

u-axis: horizontal axis
v-axis: vertical axis
uv values: texture coordinates

## 5.1 - Texture Shaders
* Determine how to define uv coords for geometries with WebGL
* Create a texture coordinate buffer in the graphics system with WebGL
* Build GLSL shaders to render textured geometry
* Define texture core engine component to load and process an image into a texture and unload
* Implement simple texture tinting, a mod of all texels with a programmer-specified color

### Changes in this chapter

TextureVS.glsl and TextureFS.glsl: These are new files created to define GLSL shaders for supporting drawing with uv coordinates. Recall that the GLSL shaders must be loaded into WebGL and compiled during the initialization of the game engine.

Engine_VertexBuffer.js: This file is modified to create a corresponding uv coordinate buffer to define the texture coordinate for the vertices of the unit square.

TextureShader.js: This is a new file that defines TextureShader as a subclass of SimpleShader to interface the game engine to the corresponding GLSL shaders (TextureVS and TextureFS).

Engine_DefaultResources.js: This is a new file (??? no its not) that defines a core engine component to facilitate the sharing of systemwide resources. In this case, it’s to facilitate the sharing of both SimpleShader and TextureShader by the corresponding Renderable objects.

Renderable.js: This file is modified to facilitate Renderable serving as the base class to all future types of Renderable objects and to share the Shader resource provided by gEngine_DefaultResources.

TextureRenderable.js: This is a new file that defines RenderableTexture as a subclass of Renderable to facilitate the creation, manipulation, and drawing of multiple instances of textured objects.

Engine_Core.js: This file is modified to configure WebGL to support drawing with a texture map.
Engine_Textures.js: This is a new file that defines the core engine component that is capable of loading, activating (for rendering), and unloading texture images.
MyGame.js and BlueLevel.js: These game engine client files are modified to test the new texture mapping functionality.

Create a shader that accepts both geometric (x,y) and texture (u,v) coordinates at each vertex.

## 5.2 Sprite Shaders - sprite sheets

* To gain a deeper understanding for texture coordinates/UV values
* To experience defining subregions within an image for texture mapping
* To draw squares by mapping from sprite sheet elements
* To prepare for working with sprite animation and bitmap fonts