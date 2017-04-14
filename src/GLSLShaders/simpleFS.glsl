//sets the precision for floating point computation
//to transform the vertex position
precision mediump float;
// uniform denotes that a variable is constant for all vertices
uniform vec4 uPixelColor;

void main (void){
	//uPixelColor can be set from JavaScript
	gl_FragColor = uPixelColor;
}

