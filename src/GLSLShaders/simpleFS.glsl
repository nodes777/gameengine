//sets the precision for floating point computation
//to transform the vertex position
precision mediump float;
// uniform denotes that a variable is constant for all vertices
uniform vec4 uPixelColor;
// These are shared globally
uniform vec4 uGlobalAmbientColor;
uniform float uGlobalAmbientIntensity;

void main (void){
	//uPixelColor can be set from JavaScript
	// Multiply the color by the lighting color and intensity to get final color
	gl_FragColor = uPixelColor * uGlobalAmbientIntensity * uGlobalAmbientColor;
}

