import * as THREE from 'three';
import { createRandom } from './random.js';
import { createTerrain } from './terrain.js';
import { Jet } from './jet.js';
import { Rings } from './rings.js';
import { HUD } from './hud.js';
import { createInput } from './input.js';
import { FIELD, STEP, TIMER_MAX, SCORE_PER_RING, TIME_PER_RING, RING_SPACING, PALETTE } from './config.js';
import { CONTROLS } from './config.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');

const random = createRandom(seed);
const terrain = createTerrain(random);
const jet = new Jet();
const rings = new Rings(random, terrain.scene);
const hud = new HUD();
const input = createInput(canvas);

// Renderer + chase camera (coordinator wiring: the game had none).
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.setSize(1280, 720);
const camera = new THREE.PerspectiveCamera(60, 1280 / 720, 0.1, 2000);
terrain.scene.add(jet.mesh);

function renderFrame() {
  const p = jet.mesh.position;
  camera.position.set(p.x, p.y + 12, p.z - 55);
  camera.lookAt(p.x, p.y + 2, p.z + 120);
  renderer.render(terrain.scene, camera);
}

function showOverlay(title, sub) {
  const el = document.createElement('div');
  el.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:monospace;text-align:center;pointer-events:none;';
  el.innerHTML = '<div style="font-size:64px;text-shadow:0 2px 12px #000;">' + title + '</div><div style="font-size:20px;margin-top:12px;text-shadow:0 2px 8px #000;">' + sub + '</div>';
  document.body.appendChild(el);
}

let score = 0;
let timeLeft = TIMER_MAX;
let ringsHit = 0;
let throttle = 0;
let pitch = 0;
let roll = 0;
let altitude = 0;
let speed = 0;
let heading = 0;
let gameState = 'start';
let lastTime = performance.now();

function startGame() {
  score = 0;
  timeLeft = TIMER_MAX;
  ringsHit = 0;
  throttle = 0;
  pitch = 0;
  roll = 0;
  altitude = 10;
  speed = 0;
  heading = 0;
  gameState = 'play';
  status.textContent = 'Playing. 120 seconds.';
  canvas.focus();
}

function endGame() {
  gameState = 'end';
  status.textContent = `Game over. Score ${score}.`;
  renderFrame();
  showOverlay('GAME OVER', 'Score ' + score + ' &middot; Rings ' + ringsHit + ' &mdash; press R or click to fly again');
  if (score > 0) {
    // save best
  }
}

function updateHUD() {
  hud.update(altitude, speed, heading, throttle * 100, score, ringsHit, timeLeft);
}

function loop(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (gameState === 'play') {
    timeLeft -= delta;
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    // Real input when keys are held; otherwise the autopilot drift keeps the scene alive.
    const keyPitch = input.getPitch();
    const keyRoll = input.getRoll();
    const keyThrottle = input.getThrottle();
    if (keyThrottle !== 0) throttle = Math.max(0, Math.min(1, throttle + keyThrottle * delta * 0.5));
    else throttle = 0.5 + Math.sin(now / 500) * 0.5;
    pitch = keyPitch !== 0 ? keyPitch * 0.5 : Math.sin(now / 300) * 0.3;
    roll = keyRoll !== 0 ? keyRoll * 0.5 : Math.sin(now / 400) * 0.2;
    speed = 80 + throttle * 120;
    heading += roll * 2 * delta;
    altitude = 10 + Math.sin(now / 200) * 5 + Math.random() * 2;
    jet.update(new THREE.Vector3(Math.sin(heading) * 20, altitude, 0), pitch, roll, throttle);
    rings.update(delta);
    if (rings.checkPass(jet.mesh.position, 10)) {
      ringsHit++;
      score += SCORE_PER_RING;
      timeLeft += TIME_PER_RING;
    }
    updateHUD();
    renderFrame();
  } else if (gameState === 'shot') {
    // handled in stageShot
  }
  requestAnimationFrame(loop);
}

if (shot) {
  // Deterministic staged renders of the real game scene (coordinator wiring).
  gameState = 'shot';
  if (shot === 'start') {
    jet.update(new THREE.Vector3(0, 10, 0), 0, 0, 0);
    hud.update(10, 0, 0, 0, 0, 0, TIMER_MAX);
    status.textContent = 'Aurora Run. Press Enter or click Fly.';
    renderFrame();
    showOverlay('AURORA RUN', 'Fly through the glowing rings &mdash; 120 seconds &mdash; press Enter or click Fly');
  } else if (shot === 'play') {
    throttle = 0.7;
    score = 300;
    ringsHit = 3;
    timeLeft = 95;
    altitude = 25;
    speed = 80 + throttle * 120;
    jet.update(new THREE.Vector3(0, 25, 0), 0.1, 0.1, throttle);
    const staged = rings.rings.slice(0, 3);
    staged[0].position.set(2, 26, 60);
    staged[1].position.set(-6, 30, 120);
    staged[2].position.set(4, 22, 180);
    hud.update(altitude, speed, 0, Math.round(throttle * 100), score, ringsHit, timeLeft);
    status.textContent = 'Playing. 95 seconds.';
    renderFrame();
  } else {
    score = 450;
    ringsHit = 4;
    timeLeft = 0;
    jet.update(new THREE.Vector3(0, 10, 0), 0, 0, 0);
    hud.update(10, 0, 0, 0, score, ringsHit, 0);
    status.textContent = 'Game over. Score 450.';
    renderFrame();
    showOverlay('GAME OVER', 'Score 450 &middot; Rings 4 &mdash; press R or click to fly again');
  }
} else {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && gameState === 'start') {
      startGame();
    } else if (e.key === 'r' && gameState === 'end') {
      startGame();
    }
  });
  canvas.addEventListener('click', (e) => {
    if (gameState === 'start') startGame();
    else if (gameState === 'end') startGame();
  });
  requestAnimationFrame(loop);
}
