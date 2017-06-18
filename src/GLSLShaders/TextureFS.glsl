// precision for floating point computation
precision mediump float;

// The object that fetches data from texture.
// Must be set outside the shader.
// Utility from glsl
uniform sampler2D uSampler;

//color of pixel
uniform vec4 uPixelColor;

// varying keyword signifies that the texture coord will
// be interpolated and thus varies
varying vec2 vTexCoord;

void main (void){
	// Texel color look up based on interpolated UV value in vTexCoord
	vec4 c = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));

	// tint the textured area. Leave transparent area as defined by the texture
	// I can experiment here
	vec3 r = vec3(c) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
	vec4 result = vec4(r, c.a);

	gl_FragColor = result;
}