//expects one vertex position, xyz
attribute vec3 aSquareVertexPosition;

//the uv coordinate
attribute vec2 aTextureCoordinate;

// texture coordinate that will map the entire image to the entire square
// linearlly interpolated and passed to the fragment shader
varying vec2 vTexCoord;

// transform the vertex postion
uniform mat4 uModelTransform;
uniform mat4 uViewProjTransform;

void main(void) {
    // Convert the vec3 into vec4 for scan conversion and
    // transform by uModelTransform and uViewProjTransform before
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0);

    // pass the texture coordinate to the fragment shader
    vTexCoord = aTextureCoordinate;
}
