/**
 * Mutable state driven by GSAP / ScrollTrigger and read each frame by the Three.js loop.
 * offsetX/Y are in normalized view space (roughly -0.6..0.6) applied to the particle group.
 */
export const sphereState = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  opacity: 1,
  /** Extra line/point intensity for the contact “soft glow” beat */
  glow: 0.35,
};
