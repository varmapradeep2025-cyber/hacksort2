import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type WaveVariant = 'judge' | 'participant' | 'organizer';

const VARIANT_CONFIG: Record<WaveVariant, { amplitude: number; speed: number; layers: number; glow: number; offsetZ: number }> = {
  judge: { amplitude: 2.2, speed: 0.5, layers: 3, glow: 0.85, offsetZ: -8 },
  participant: { amplitude: 3.0, speed: 0.75, layers: 4, glow: 1.0, offsetZ: -6 },
  organizer: { amplitude: 4.0, speed: 0.4, layers: 5, glow: 0.7, offsetZ: -10 },
};

export default function ThreeDWaveBackground({ variant = 'judge' }: { variant?: WaveVariant }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const variantRef = useRef(variant);
  variantRef.current = variant;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.022);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 6, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x1a2a4a, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0x22d3ee, 0.7);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x0891b2, 1.5, 40);
    pointLight.position.set(0, 8, 2);
    scene.add(pointLight);

    // Wave meshes
    const cfg = VARIANT_CONFIG[variantRef.current];
    const meshes: THREE.Mesh[] = [];
    const segX = isMobile ? 40 : 80;
    const segY = isMobile ? 30 : 50;

    for (let i = 0; i < cfg.layers; i++) {
      const geo = new THREE.PlaneGeometry(60, 40, segX, segY);
      const opacity = (0.16 - i * 0.03) * cfg.glow;
      const mat = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? 0x0e7490 : 0x155e75,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.12 - i * 0.02,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        flatShading: false,
        shininess: 60,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2.6;
      mesh.position.y = -2 - i * 1.8;
      mesh.position.z = cfg.offsetZ + i * 1.5;
      scene.add(mesh);
      meshes.push(mesh);
    }

    // Soft atmospheric glow sphere
    const glowGeo = new THREE.SphereGeometry(18, 24, 24);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x0891b2, transparent: true, opacity: 0.04, side: THREE.BackSide });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.set(0, 2, -12);
    scene.add(glowMesh);

    // Store original positions
    const positions = meshes.map((m) => (m.geometry.attributes.position as THREE.BufferAttribute).array.slice() as Float32Array);

    // Animation
    let raf = 0;
    let t = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const v = VARIANT_CONFIG[variantRef.current];
      t += dt * v.speed;

      meshes.forEach((mesh, idx) => {
        const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
        const orig = positions[idx];
        const amp = v.amplitude * (1 - idx * 0.15);
        for (let i = 0; i < pos.count; i++) {
          const ix = i * 3;
          const x = orig[ix];
          const y = orig[ix + 1];
          const wave =
            Math.sin(x * 0.18 + t + idx * 0.7) * amp * 0.5 +
            Math.cos(y * 0.22 + t * 0.8 + idx * 0.5) * amp * 0.4 +
            Math.sin((x + y) * 0.12 + t * 0.6) * amp * 0.3;
          pos.setZ(i, wave);
        }
        pos.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.position.z = v.offsetZ + idx * 1.5 + Math.sin(t * 0.3 + idx) * 0.5;
      });

      // Subtle camera drift
      camera.position.x = Math.sin(t * 0.15) * 1.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      // Render a single static frame
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      meshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      glowGeo.dispose();
      glowMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
