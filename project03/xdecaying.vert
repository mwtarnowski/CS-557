#version 330 compatibility

#define M_PI 3.1415926535898

out vec3 vMCposition;
out vec3 vECnormal;
out vec3 vLightDir;
out vec3 vViewDir;

uniform float uA, uB, uC, uD, uE;
uniform float uLightX, uLightY, uLightZ;

void main() {
	// Add 1 to both x and y to make decaying exponentials nicer.
	float x1p = aVertex.x + 1.;
	float y1p = aVertex.y + 1.;
	float z = uA * cos(2*M_PI * uB * x1p + uC) * exp(-(uD * x1p + uE * y1p));
	float dzdx = uA * (-sin(2*M_PI * uB * x1p + uC) * 2*M_PI * uB + cos(2*M_PI * uB * x1p + uC) * (-uD)) * exp(-(uD * x1p + uE * y1p));
	float dzdy = uA * cos(2*M_PI * uB * x1p + uC) * (-uE) * exp(-(uD * x1p + uE * y1p));

	vec4 vertex = vec4(aVertex.xy, z, 1.);
	vMCposition = vertex.xyz;

	vec3 Tx = vec3(1., 0., dzdx);
	vec3 Ty = vec3(0., 1., dzdy);
	vECnormal = normalize(uNormalMatrix * cross(Tx, Ty));

	vec4 ECposition = uModelViewMatrix * vertex;
	vec3 EClightPosition = vec3(uLightX, uLightY, uLightZ);
	vLightDir = EClightPosition - ECposition.xyz;
	vViewDir = -ECposition.xyz;
	gl_Position = uModelViewProjectionMatrix * vertex;
}
