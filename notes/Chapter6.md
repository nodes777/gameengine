# Chapter 6 - Behavior and Collisions

* GameObject class for abstracting game behaviors
* Generalize GameObject to support common behaviors like speed and movement direction
* Develop an effective per-pixel accurate collision detection

## Game Objects

* Cleans up initialize and update so that you're not writing ridiculous amounts of code per each renderable.

* Improve the engine drawing infrastructure to receive the Camera object instead of just the View-Projection matrix of a camera. Although this goal is minimally related to game object behaviors, this is a necessary step to include in order to support the growing game engine sophistication.
* Begin defining the GameObject class to encapsulate object behaviors in games.
* Demonstrate the creation of subclasses to the GameObject class to maintain the simplicity of the MyGame level update() function.

Modify Renderable and Shader Objects to Draw with a Camera - do it to all renderables

Create GameObject Class to abstract out common funcs of objects in the game

Create ObjectSet to manage all GameObjects in scene