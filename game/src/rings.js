import * as THREE from 'three';

export class Rings {
  constructor(random, scene) {
    this.rings = [];
    this.nextSpawn = 0;
    this.score = 0;
    this.scene = scene;
    this.random = random;
    const mat = new THREE.MeshBasicMaterial({ color: 0x00FFFF, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    for (let i = 0; i < 8; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(5, 1.5, 8, 64), mat);
      ring.position.set(0, 12 + (i % 3) * 6, 300 + i * 100);
      ring.rotation.x = 0;
      this.rings.push(ring);
      this.scene.add(ring); // will be added later
    }
  }
  update(delta) {
    this.nextSpawn -= delta;
    if (this.nextSpawn <= 0) {
      this.nextSpawn = 2;
      if (this.rings.length > 0) {
        const newRing = this.rings[0].clone();
        newRing.position.z = 300;
        newRing.position.y = 8 + this.random() * 20;
        newRing.rotation.x = 0;
        this.scene.add(newRing);
        this.rings.push(newRing);
        if (this.rings.length > 8) {
          const old = this.rings.shift();
          this.scene.remove(old);
        }
      }
    }
    this.rings.forEach(ring => {
      ring.position.z -= 50 * delta;
      if (ring.position.z < -50) {
        this.scene.remove(ring);
        this.rings.splice(this.rings.indexOf(ring), 1);
      }
    });
  }
  checkPass(position, radius) {
    let hit = 0;
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      const dx = ring.position.x - position.x;
      const dy = ring.position.y - position.y;
      const dz = ring.position.z - position.z;
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 8 && dz > 0) {
        hit++;
        this.scene.remove(ring);
        this.rings.splice(i, 1);
        this.score += 100;
      }
    }
    return hit;
  }
}
