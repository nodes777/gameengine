
// this is the vertex shader
// uniform is a global var with vertices that do not change
// uModelTransform is the transform operator
// maintins the operator values for all vertices of a square
uniform mat4 uModelTransform;

// attribute defines the per vertex data that will be passed to the vertex shader in GPU
// vec3, datatype, a vector with array of three floating-point numbers
// naming convention, attributes always begin with "a"
attribute vec3 aSquareVertexPosition;

void main(void) {
	// transform by uModelTransform first, then
   // Convert the vec3 into vec4 for scan conversion and
   // assign to gl_Position to pass the vertex to the fragment shader
   //gl_Position is a built in special variable
    gl_Position = uModelTransform * vec4(aSquareVertexPosition, 1.0);
}
