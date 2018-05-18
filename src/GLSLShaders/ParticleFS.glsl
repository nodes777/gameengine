precision mediump float;
// sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;

// Color of pixel
uniform vec4 uPixelColor;

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies.
varying vec2 vTexCoord;