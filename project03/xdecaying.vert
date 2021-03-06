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
	float alpha = 2*M_PI * uB * (aVertex.x + 1.) + uC;
	float beta = uD * (aVertex.x + 1.) + uE * (aVertex.y + 1.);

	float z = uA * cos(alpha) * exp(-beta);
	float dzdx = -(2*M_PI * uB * tan(alpha) + uD) * z;
	float dzdy = -uE * z;

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
