#ifdef GL_ES
precision highp float;
#endif

varying vec4 vFinalColor;
varying vec2 vTextureCoord;
varying float vTimeFactor;
varying float vTexscale;

uniform sampler2D uTexture;

void main() {
	vec4 textureColor =
        texture2D(uTexture, vTextureCoord*vTexscale + vTimeFactor);
	gl_FragColor = textureColor * vFinalColor;
}