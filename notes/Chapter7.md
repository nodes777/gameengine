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
