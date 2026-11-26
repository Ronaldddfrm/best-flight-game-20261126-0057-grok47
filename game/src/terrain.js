import * as THREE from 'three';

export function createTerrain(random) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);
  scene.fog = new THREE.Fog(0x87CEEB, 300, 1200);
  const light = new THREE.DirectionalLight(0xFFFFFF, 1.2);
  light.position.set(100, 200, 50);
  scene.add(light);
  const ambient = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambient);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(30, 8, 8), new THREE.MeshBasicMaterial({ color: 0xFFFFAA }));
  sun.position.set(150, 300, 200);
  scene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2048, 2048), new THREE.MeshStandardMaterial({ color: 0x2E8B57, roughness: 0.9 }));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const runway = new THREE.Mesh(new THREE.PlaneGeometry(300, 100), new THREE.MeshStandardMaterial({ color: 0xE0E0E0 }));
  runway.rotation.x = -Math.PI / 2;
  runway.position.y = 0.01;
  scene.add(runway);
  const cloudMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.7 });
  const clouds = [];
  for (let i = 0; i < 8; i++) {
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(28, 6, 6), cloudMat);
    cloud.position.set(random() * 800 - 400, 120 + random() * 60, random() * 600 + 300);
    scene.add(cloud);
    clouds.push(cloud);
  }
  const treeMat = new THREE.MeshStandardMaterial({ color: 0x3D8B40 });
  const trees = [];
  for (let i = 0; i < 80; i++) {
    const x = random() * 1200 - 600;
    const z = random() * 800 + 100;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 12, 8), new THREE.MeshStandardMaterial({ color: 0x8B4513 }));
    trunk.position.set(x, 6, z);
    scene.add(trunk);
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(8, 20, 8), treeMat);
    leaves.position.set(x, 16, z);
    scene.add(leaves);
    trees.push(trunk, leaves);
  }
  scene.add(new THREE.AmbientLight(0xFFFFFF, 0.3));
  // Rocky grey mountains on the horizon ahead (coordinator addition: the flat plain had none).
  const mountainMat = new THREE.MeshStandardMaterial({ color: 0x708090, roughness: 1 });
  for (let i = 0; i < 10; i++) {
    const h = 80 + random() * 100;
    const mountain = new THREE.Mesh(new THREE.ConeGeometry(40 + random() * 50, h, 6), mountainMat);
    mountain.position.set((random() < 0.5 ? -1 : 1) * (120 + random() * 480), h / 2 - 5, 300 + random() * 600);
    scene.add(mountain);
  }
  return {
    scene: scene,
    update: () => {},
    getHeight: (x, z) => ground.position.y,
    jetPos: { x: 0, y: 10, z: 0 },
  };
}
