// ECE Portfolio — Particle Field Vertex Shader
// Controls position, size, and mouse-physics displacement of each particle

attribute float a_size;         // Individual particle base size (randomized)
attribute float a_phase;        // Individual time offset (randomized, for organic drift)
attribute vec3 a_velocity;      // Individual drift velocity vector

uniform float u_time;           // Elapsed time in seconds
uniform vec2 u_mouse;           // Mouse NDC position (-1 to +1)
uniform float u_mouseSpeed;     // Mouse velocity magnitude (0 to ~100)
uniform float u_pixelRatio;     // Device pixel ratio for size correction
uniform vec2 u_resolution;      // Viewport resolution

varying float v_alpha;          // Pass alpha to fragment shader
varying float v_distToMouse;    // Pass mouse distance for color modulation

void main() {
  // 1. Organic drift — each particle moves on a slow, unique sine wave path
  vec3 pos = position;
  float t = u_time * 0.4 + a_phase;
  pos.x += sin(t * 0.7 + a_phase * 2.1) * 0.08;
  pos.y += cos(t * 0.5 + a_phase * 1.7) * 0.06;
  pos.z += sin(t * 0.3 + a_phase * 0.9) * 0.04;

  // 2. Mouse physics — particles near the cursor are repelled
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vec4 clipPos  = projectionMatrix * viewMatrix * worldPos;
  vec2 ndcPos   = clipPos.xy / clipPos.w;

  float dist = distance(ndcPos, u_mouse);
  float repelRadius = 0.25 + u_mouseSpeed * 0.004;
  float repelStrength = smoothstep(repelRadius, 0.0, dist);

  // Direction away from mouse
  vec2 repelDir = normalize(ndcPos - u_mouse);
  float force = repelStrength * (0.15 + u_mouseSpeed * 0.002);
  pos.x += repelDir.x * force;
  pos.y += repelDir.y * force;

  // 3. Final clip position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  // 4. Particle size — larger when close to mouse (attraction shimmer)
  float proximityBoost = smoothstep(0.5, 0.0, dist) * 2.5;
  gl_PointSize = (a_size + proximityBoost) * u_pixelRatio;

  // 5. Pass to fragment shader
  v_alpha = 0.4 + smoothstep(0.4, 0.0, dist) * 0.6;
  v_distToMouse = dist;
}
