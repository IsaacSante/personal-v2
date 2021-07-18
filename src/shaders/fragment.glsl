   uniform float uTime;
    uniform vec3 colorA; 
    uniform vec3 colorB; 
    varying vec3 vUv;
    uniform vec2 u_resolution;
    void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
        gl_FragColor = vec4(mix(abs(uTime * 0.5) + colorA , abs(uTime * 0.5) + colorB, vUv.x + uTime), 1.0);
      }