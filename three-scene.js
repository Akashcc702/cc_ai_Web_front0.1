// ═══════════════════════════════════════════════════
//  CC-AI — Three.js Immersive Scene
//  Particle field + mouse interaction + morph shapes
// ═══════════════════════════════════════════════════
(function () {

  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Renderer ─────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // ── Scene + Camera ────────────────────────────────
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // ── Mouse tracking ────────────────────────────────
  const mouse    = new THREE.Vector2(0, 0);
  const target   = new THREE.Vector2(0, 0);
  const mouseLag = 0.05;

  document.addEventListener('mousemove', e => {
    mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── PARTICLE SYSTEM ───────────────────────────────
  const PARTICLE_COUNT = window.innerWidth < 768 ? 2000 : 4500;

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const randoms   = new Float32Array(PARTICLE_COUNT);
  const scales    = new Float32Array(PARTICLE_COUNT);

  // Distribute on sphere surface
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 2.5 + (Math.random() - 0.5) * 3;

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    randoms[i] = Math.random();
    scales[i]  = Math.random();
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('aRandom',  new THREE.BufferAttribute(randoms, 1));
  particleGeo.setAttribute('aScale',   new THREE.BufferAttribute(scales, 1));

  // Custom shader material for glowing particles
  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime:       { value: 0 },
      uMouse:      { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
    vertexShader: `
      attribute float aRandom;
      attribute float aScale;
      uniform float uTime;
      uniform vec2  uMouse;
      uniform float uPixelRatio;

      void main() {
        vec3 pos = position;

        // Breathe animation
        float breathe = sin(uTime * 0.4 + aRandom * 6.28) * 0.08;
        pos *= 1.0 + breathe;

        // Mouse influence — repel/attract
        vec4 mvPos  = modelViewMatrix * vec4(pos, 1.0);
        vec4 clipPos = projectionMatrix * mvPos;
        vec2 ndc = clipPos.xy / clipPos.w;
        float dist = distance(ndc, uMouse * 0.5);
        float influence = smoothstep(0.6, 0.0, dist) * 0.35;
        pos += normalize(pos) * influence;

        gl_Position  = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (aScale * 2.5 + 0.8) * uPixelRatio * (1.0 + influence * 2.0);
      }
    `,
    fragmentShader: `
      void main() {
        // Soft circle
        vec2 uv   = gl_PointCoord - 0.5;
        float d   = length(uv);
        float a   = 1.0 - smoothstep(0.35, 0.5, d);
        if (a < 0.01) discard;

        // Purple → cyan gradient based on position
        vec3 col1 = vec3(0.55, 0.27, 1.0);  // purple
        vec3 col2 = vec3(0.0,  0.85, 0.95); // cyan
        vec3 col  = mix(col1, col2, gl_FragCoord.y / 800.0);

        gl_FragColor = vec4(col, a * 0.7);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── FLOATING GEOMETRIC SHAPES ─────────────────────
  function makeShape(geo, x, y, z, color) {
    const mat  = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  const shapes = [
    makeShape(new THREE.IcosahedronGeometry(0.7, 1),  2.5, 1.5, -2, 0x8b5cf6),
    makeShape(new THREE.OctahedronGeometry(0.5),      -2.5, -1, -1, 0x06b6d4),
    makeShape(new THREE.TorusGeometry(0.6, 0.15, 8, 20), 0, -2.2, -1.5, 0xa78bfa),
  ];

  // ── RESIZE ────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    particleMat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
  });

  // ── ANIMATION LOOP ────────────────────────────────
  let frameId;
  function animate(t = 0) {
    frameId = requestAnimationFrame(animate);
    const time = t * 0.001;

    // Smooth mouse lag
    target.x += (mouse.x - target.x) * mouseLag;
    target.y += (mouse.y - target.y) * mouseLag;

    // Update uniforms
    particleMat.uniforms.uTime.value  = time;
    particleMat.uniforms.uMouse.value.set(target.x, target.y);

    // Rotate particle field with mouse
    particles.rotation.y = time * 0.04 + target.x * 0.15;
    particles.rotation.x = time * 0.02 + target.y * 0.08;

    // Shapes float
    shapes.forEach((s, i) => {
      s.rotation.x = time * (0.2 + i * 0.1);
      s.rotation.y = time * (0.15 + i * 0.08);
      s.position.y += Math.sin(time + i * 2) * 0.001;
    });

    renderer.render(scene, camera);
  }
  animate();

  // Expose stop/start for performance (pause when tab hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frameId);
    else animate();
  });

})();
