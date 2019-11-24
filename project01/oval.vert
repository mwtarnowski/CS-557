#version 330 compatibility

out vec3 vColor;
out vec2 vTexCoord;
out float vLightIntensity;

const vec3 LIGHTPOS = vec3(-2., 0., 10.);

void main() {
    vColor = aColor.rgb;
    vTexCoord = aTexCoord0.st;

    vec3 ECvertex = vec3(uModelViewMatrix * aVertex);
    vec3 ECnormal = normalize(uNormalMatrix * aNormal);
    vLightIntensity = abs(dot(normalize(LIGHTPOS - ECvertex), ECnormal));

    gl_Position = uModelViewProjectionMatrix * aVertex;
}
