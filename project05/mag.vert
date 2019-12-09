#version 330 compatibility

out vec2 vTexCoord;

void main() {
    vTexCoord = aTexCoord0.st;
    gl_Position = aVertex;
}
