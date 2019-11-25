#version 330 compatibility

out vec3 vMCposition;
out vec3 vColor;
out vec2 vTexCoord;
out float vDepth;
out float vLightIntensity;

const vec3 LIGHTPOS = vec3(-2., 0., 10.);

void main() {
    vColor = aColor.rgb;
    vTexCoord = aTexCoord0.st;

    vec3 ECnormal = normalize(uNormalMatrix * aNormal);
    vec3 ECposition = vec3(uModelViewMatrix * aVertex);
    vLightIntensity = abs(dot(normalize(LIGHTPOS - ECposition), ECnormal));

    vDepth = ECposition.z;
    vMCposition = aVertex.xyz;
    gl_Position = uModelViewProjectionMatrix * aVertex;
}
