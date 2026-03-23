// ECE Portfolio — Particle Field Fragment Shader
// Renders each particle as a soft circular point with cobalt shimmer near mouse

uniform vec3 u_colorBase;       // Base particle color (cobalt-tinted white)
uniform vec3 u_colorAccent;     // Accent color when near mouse (pure cobalt)
uniform float u_time;

varying float v_alpha;
varying float v_distToMouse;

void main() {
  // Circular particle shape (discard corners of gl_PointCoord quad)
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  if (dist > 0.5) discard;

  // Soft gaussian falloff (bright center, transparent edge)
  float strength = 1.0 - smoothstep(0.0, 0.5, dist);
  strength = pow(strength, 1.8);

  // Color — blend from base to cobalt accent based on mouse proximity
  float proximity = 1.0 - smoothstep(0.0, 0.5, v_distToMouse);
  vec3 color = mix(u_colorBase, u_colorAccent, proximity * 0.7);

  // Subtle twinkle — very slight brightness pulse per particle
  float twinkle = 0.9 + 0.1 * sin(u_time * 3.0 + v_distToMouse * 10.0);
  color *= twinkle;

  gl_FragColor = vec4(color, strength * v_alpha);
}
