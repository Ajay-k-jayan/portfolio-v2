import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { sphereState } from '../sphereState';

/** Fibonacci sphere — even distribution on a sphere surface */
function fibonacciSphere(count: number, radius: number, out: Float32Array) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
}

/** Limit edges: for each particle, connect to k nearest neighbors (undirected unique) */
function buildLineIndices(positions: Float32Array, count: number, maxPerNode: number, maxLines: number) {
  const pairs: [number, number][] = [];
  const seen = new Set<string>();

  const distSq = (i: number, j: number) => {
    const ax = positions[i * 3];
    const ay = positions[i * 3 + 1];
    const az = positions[i * 3 + 2];
    const bx = positions[j * 3];
    const by = positions[j * 3 + 1];
    const bz = positions[j * 3 + 2];
    const dx = ax - bx;
    const dy = ay - by;
    const dz = az - bz;
    return dx * dx + dy * dy + dz * dz;
  };

  for (let i = 0; i < count; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      dists.push({ j, d: distSq(i, j) });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < Math.min(maxPerNode, dists.length); k++) {
      const j = dists[k].j;
      const a = Math.min(i, j);
      const b = Math.max(i, j);
      const key = `${a},${b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push([a, b]);
      if (pairs.length >= maxLines) return pairs;
    }
  }
  return pairs;
}

type Props = {
  reducedMotion: boolean;
};

/**
 * Single WebGL canvas: connected particle “network sphere” + scroll-driven transform from sphereState.
 */
export function PersistentParticleSphere({ reducedMotion }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0'; // fade-in after GPU warm-up
    canvas.style.transition = 'opacity 320ms ease';
    container.appendChild(canvas);

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const particleCount = reducedMotion ? 48 : isMobile ? 72 : 120;
    const maxLines = reducedMotion ? 80 : isMobile ? 140 : 220;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.z = 4.2;

    const root = new THREE.Group();
    scene.add(root);

    const positions = new Float32Array(particleCount * 3);
    fibonacciSphere(particleCount, 1.15, positions);

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointsMat = new THREE.PointsMaterial({
      color: 0x6b8cff,
      size: reducedMotion ? 0.028 : isMobile ? 0.032 : 0.038,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(pointsGeo, pointsMat);
    root.add(points);

    const pairs = buildLineIndices(positions, particleCount, 3, maxLines);
    const linePos = new Float32Array(pairs.length * 2 * 3);
    let o = 0;
    for (const [a, b] of pairs) {
      linePos[o++] = positions[a * 3];
      linePos[o++] = positions[a * 3 + 1];
      linePos[o++] = positions[a * 3 + 2];
      linePos[o++] = positions[b * 3];
      linePos[o++] = positions[b * 3 + 1];
      linePos[o++] = positions[b * 3 + 2];
    }
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(linesGeo, linesMat);
    root.add(lines);

    const clock = new THREE.Clock();
    let targetTiltX = 0;
    let targetTiltY = 0;

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetTiltX = ny * 0.18;
      targetTiltY = nx * 0.18;
    };

    if (!reducedMotion) window.addEventListener('pointermove', onMove, { passive: true });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const pr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };

    resize();
    // Pre-compile shaders and do a warm-up render to avoid first-frame jank
    try {
      renderer.compile(scene, camera);
      renderer.render(scene, camera);
    } catch {
      // no-op: compile not supported in older three versions
    }
    // Make visible on next frame (after warm-up)
    requestAnimationFrame(() => {
      canvas.style.opacity = '1';
    });
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let raf = 0;
    let alive = true;

    const animate = () => {
      if (!alive) return;
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!reducedMotion) {
        const autoY = t * 0.09;
        const autoX = Math.sin(t * 0.22) * 0.07;
        root.rotation.y += (autoY + targetTiltY * 0.28 - root.rotation.y) * 0.04;
        root.rotation.x += (autoX + targetTiltX * 0.22 - root.rotation.x) * 0.04;
        root.position.y = Math.sin(t * 0.35) * 0.06;
      }

      const s = sphereState;
      root.position.x = THREE.MathUtils.lerp(root.position.x, s.offsetX * 1.35, 0.08);
      root.position.z = THREE.MathUtils.lerp(root.position.z, -0.15 - (1 - s.scale) * 0.8, 0.06);
      const sc = THREE.MathUtils.lerp(root.scale.x, s.scale, 0.08);
      root.scale.setScalar(sc);

      const glowBoost = 0.5 + s.glow * 0.9;
      pointsMat.opacity = 0.22 + s.opacity * 0.55 * glowBoost;
      linesMat.opacity = 0.06 + s.opacity * 0.22 * glowBoost;
      const cool = new THREE.Color(0x6b8cff);
      const warm = new THREE.Color(0xc4b5fd);
      pointsMat.color
        .copy(cool)
        .lerp(warm, THREE.MathUtils.clamp((s.glow - 0.35) / 0.55, 0, 1));

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      pointsGeo.dispose();
      pointsMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      renderer.dispose();
      container.removeChild(canvas);
    };
  }, [reducedMotion]);

  return <div ref={containerRef} className="particle-canvas" aria-hidden />;
}
