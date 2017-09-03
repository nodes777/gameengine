# Chapter 6 - Behavior and Collisions

* GameObject class for abstracting game behaviors
* Generalize GameObject to support common behaviors like speed and movement direction
* Develop an effective per-pixel accurate collision detection

## 6.1 Game Objects

* Cleans up initialize and update so that you're not writing ridiculous amounts of code per each renderable.

* Improve the engine drawing infrastructure to receive the Camera object instead of just the View-Projection matrix of a camera. Although this goal is minimally related to game object behaviors, this is a necessary step to include in order to support the growing game engine sophistication.
* Begin defining the GameObject class to encapsulate object behaviors in games.
* Demonstrate the creation of subclasses to the GameObject class to maintain the simplicity of the MyGame level update() function.

Modify Renderable and Shader Objects to Draw with a Camera - do it to all renderables

Create GameObject Class to abstract out common funcs of objects in the game

Create ObjectSet to manage all GameObjects in scene

## 6.2 Chasing Game Object - Vectors

Vector = (x²-x¹, y²-y¹)

Size of vector = magnitude = length of vector = distance = difference

vec2s in gl-lib, can be used to represent points in space.
Normalized vectors(unit vector): Vectors with a size of 1
vec2.normalized(V¹)

Normalized vectors keep direction without regards to length

Dot products return a number/scalar to find angle
Cross products return a vector to determine clockwise or counterclockwise rotation

## 6.3 Axis Aligned Bounding Boxes

### Bitwise Or operator
	Used to check if multiple sides have collisions.
	Each enumerated value is different and has only one nonzero bit
The bitwise OR assignment operator uses the binary representation of both operands, does a bitwise OR operation on them and assigns the result to the variable

var bar = 5;
bar |= 2; // 7
// 5: 00000000000000000000000000000101
// 2: 00000000000000000000000000000010
// -----------------------------------
// 7: 00000000000000000000000000000111

	Example: eCollideLeft | eCollideTop = 4 | 1 = 5.
BoundingBox.eboundCollideStatus = Object.freeze({
    eCollideLeft: 1, // 00001
    eCollideRight: 2, // 00010
    eCollideTop: 4,	// 00100
    eCollideBottom: 8, //01000
    eInside : 16,	//10000
    eOutside: 0
});

AND is 1 only if both of its inputs are 1.

OR is 1 if one or more of its inputs are 1.

XOR is 1 only if exactly one of its inputs are 1.

NOT is 1 only if its input are 0.

## 6.4 Per Pixel Collisions

* Demonstrate how to detect nontransparent pixel overlap

1) check if the bounding boxes over lap
2) check if the nontransparent pixels over lap

Given two images, Image-A and Image-B
If the bounds of the object of Image-A and Image-B collide then
    For each Pixel-A in Image-A
        pixelCameraSpace = Pixel-A position in camera space
        Transform pixelCameraSpace to Image-B space
        Read Pixel-B from Image-B
            If Pixel-A and Pixel-B are not both completely transparent then
                A collision has occurred

Use the smaller image as Image-A, since you must iterate over each pixel.
Each pixel within Image-A must be checked, so the runtime is O(N), where N is equal to the number of pixels in Image-A, or Image-A’s resolution

The Engine_Texture component reads image files from the server file system, loads the images to the WebGL context, and processes the images into WebGL textures. In this way, there is no actual storage of the file texture in the game engine. To support per-pixel collision detection, the color information must be retrieved from the WebGL context.