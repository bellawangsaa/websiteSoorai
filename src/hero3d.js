import * as THREE from 'three';
import gsap from 'gsap';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// ponytail: gentilis (serif) ships with three — swap for a converted brand serif later
import fontUrl from 'three/examples/fonts/gentilis_bold.typeface.json?url';

export function initHero3D() {
  const wrap = document.querySelector('.hero-3d');
  const canvas = document.getElementById('s3d');
  const isMobile = matchMedia('(max-width: 768px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 7;

  scene.add(new THREE.AmbientLight(0xe8e7e4, 0.35));
  const key = new THREE.SpotLight(0xfff2dd, 90, 40, Math.PI / 5, 0.5);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe8e7e4, 1.4);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  // matte obsidian — high roughness, near-black, no chrome
  const mat = new THREE.MeshStandardMaterial({ color: 0x1b1a18, roughness: 0.75, metalness: 0.05 });
  const group = new THREE.Group();
  scene.add(group);

  new FontLoader().load(fontUrl, (font) => {
    const geo = new TextGeometry('S', {
      font, size: 2.6, depth: 0.7, curveSegments: isMobile ? 6 : 12,
      bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: isMobile ? 2 : 4
    });
    geo.center();
    group.add(new THREE.Mesh(geo, mat));
    gsap.from(group.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 1.2, ease: 'power3.out' });
  });

  function resize() {
    const r = wrap.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  const target = { x: 0, y: 0 };
  addEventListener('pointermove', (e) => {
    target.x = e.clientX / innerWidth - 0.5;
    target.y = e.clientY / innerHeight - 0.5;
  });

  let baseY = 0;
  gsap.ticker.add((t, dtMs) => {
    baseY += dtMs * 0.00015; // slow constant turn
    group.rotation.y += (baseY + target.x * 0.4 - group.rotation.y) * 0.05;
    group.rotation.x += (target.y * 0.22 - group.rotation.x) * 0.05;
    renderer.render(scene, camera);
  });
}
