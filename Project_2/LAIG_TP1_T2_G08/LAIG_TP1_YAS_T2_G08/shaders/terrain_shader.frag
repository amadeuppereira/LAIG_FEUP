#ifdef GL_ES
precision highp float;
#endif

varying vec4 vFinalColor;
varying vec2 vTextureCoord;

uniform sampler2D uTexture;

void main() {
	vec4 textureColor = texture2D(uTexture, vTextureCoord);
	gl_FragColor = textureColor * vFinalColor;
}