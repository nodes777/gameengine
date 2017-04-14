
// this is the vertex shader
attribute vec3 aSquareVertexPosition;
//attribute defines the per vertex data that will be passed to the vertex shader in GPU
// vec3, datatype, a vector with array of three floating-point numbers
// naming convention, attributes always begin with "a"
void main(void) {
   // Convert the vec3 into vec4 for scan conversion and
   // assign to gl_Position to pass the vertex to the fragment shader
   //gl_Position is a built in variable
    gl_Position = vec4(aSquareVertexPosition, 1.0);
}
