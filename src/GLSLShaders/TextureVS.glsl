//expects one vertex position, xyz
attribute vec3 aSquareVertexPosition;

//the uv coordinate
attribute vec2 aTextureCoordinate;

// texture coordinate that will map the entire image to the entire square
// linearlly interpolated and passed to the fragment shader
varying vec2 vTexCoord

// transform the vertex postion
uniform mat4 uModelTransform;
uniform mat4 uViewProjTransform;

void main(void) {
	gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0);

    // pass the texture coordinate to the fragment shader
	vTexCoord = aTextureCoordinate;
}
