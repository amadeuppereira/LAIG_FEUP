attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D uHeightmap;
uniform float uHeightScale;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;

    vec4 pos = vec4(aVertexPosition.x,
                    aVertexPosition.y + texture2D(uHeightmap, aTextureCoord)[1] * uHeightScale,
                    aVertexPosition.z,
                    1.0);
    
    gl_Position = uPMatrix * uMVMatrix * pos;

}