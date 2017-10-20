# Chapter 7 - Manipulating the Camera

* Implement operations that are commonly employed by manipulating a camera
* Interpolate values between old and new to create a smooth transition
* Understand how some motions or behaviors can be described by simple mathematic formulations
* Build games with multiple camera views
* Transform positions from the Canvas Coordinate space to the World Coordinate (WC) space
* Program with mouse input in a game environment with multiple cameras

The WC window is the bounds defined by a WC center and a dimension of Wwc × Hwc

setUpViewProjection encapsulates details and enables drawing of game obkects inside the WC window bounds

## Chapter 7.1 - Camera Manipulations

* To experience some of the common camera manipulation operations
* To understand the mapping from manipulation operations to the corresponding camera parameter values that must be altered
* To implement camera manipulation operations

## Chapter 7.2 - Camera Manipulations

Provide interpolation so the camera movements aren't as janky

* To understand interpolated results between given values
* To implement interpolation supporting gradual camera parameter changes
* To experience interpolated changes in camera parameters

## Chapter 7.3 - Camera Shake

Shake will be created with a damped harmonic function

* To gain some insights into modeling displacements with simple mathematical functions
* To experience with the camera shake effect
* To implement camera shake as a pseudorandom damped simple harmonic motion

Q key will shake

## Chapter 7.4 - Multiple Cameras

The camera object abstracts the World Coordinate window of the game to draw FROM and the viewport for the area to draw TO.
We can have multiple views, each with a seperate Camera object with distinct World Coordinate windows and viewport configurations.

* To understand the camera abstraction for presenting views into the game world
* To experience working with multiple cameras in the same game level
* To appreciate the importance of interpolation configuration for cameras with a specific purpose

In Camera.configInterpolation, stiffness is keeping the center of camera on object, duration is how smoothly it scrolls to that object.

## Chapter 7.5 Mouse Input Through Cameras

Mouse can report information through canvas coordinate space. The game engine works in World Coordinate space. For game engine to work with mouse inputs, Canvas Space must be transformed to World Coordinate space.

mouseDCX = mouseX-Vx

mouseDeltaClickX = mouseClickX - ViewportX

Device Coordinate (DC) space defines a pixel position within a viewport with offsets measured with respect to the lower-left corner of the viewport. DC = pixel space

mouseWCX = minWCX + (mouseDCX * (WidthWorldCoord/WidthViewport))

mouseX -> mouseDCX -> mouseWCX

* To understand the Canvas Coordinate space to WC space transform
* To appreciate mouse clicks are specific to individual viewports
* To implement transformation between coordinate spaces and support mouse input

