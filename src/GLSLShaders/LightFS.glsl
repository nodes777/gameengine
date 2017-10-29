precision mediump float;

// The object that fetches data from texture
uniform sampler2D uSampler;

// Color of pixel
uniform vec4 uPixelColor;
uniform vec4 uGlobalAmbientColor; // Shared globally
uniform float uGlobalAmbientIntensity;

//Light information
uniform bool uLightOn;
uniform vec4 uLightColor;
uniform vec4 uLightPosition; // in pixel space
uniform float uLightRadius; // in pixel space

varying vec2 vTexCoord;

/**
* Sample the texture color and apply the ambient color and intensity.
* Determine whether the current fragment should be illuminated by the light source. To do this, first check whether the light is on; if it is, compute the distance between the light’s position (in pixel space) and the current fragment’s position (in pixel space) that is defined in the GLSL-provided variable gl_FragCord.xyz. If the distance is less than that of the light’s radius (again in pixel space), then accumulate the light’s color.
* The last step is to apply the tint and to set the final color via gl_FragColor.
*/
void main(void) {
	vec4 textureMapColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
	vec4 lgtResults = uGlobalAmbientIntensity * uGlobalAmbientColor;

	// now decide if illuminating by the light
	if(uLightOn && (textureMapColor.a > 0.0)){
		float dist = length(uLightPosition.xyz - gl_FragCoord.xyz);
		if (dist <= uLightRadius){
			lgtResults += uLightColor;
		}
	}
	lgtResults *= textureMapColor;

	//tint the textured area, and leave transparent area as defined by the texture
	vec3 r = vec3(lgtResults) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
	vec4 result = vec4(r, lgtResults.a);

	gl_FragColor = result;
}