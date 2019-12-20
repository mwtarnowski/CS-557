#version 330 compatibility

out vec3 vNormal;

void main() {
    vNormal = aNormal;
    gl_Position = aVertex;
}
