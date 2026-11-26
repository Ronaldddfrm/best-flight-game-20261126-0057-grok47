import * as THREE from 'three';

export class Jet {
  constructor() {
    this.mesh = new THREE.Group();
    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(4, 4.5, 18, 8), new THREE.MeshStandardMaterial({ color: 0xFF2222 }));
    fuselage.rotation.x = Math.PI / 2;
    this.mesh.add(fuselage);
    const wings = new THREE.Mesh(new THREE.PlaneGeometry(18, 6), new THREE.MeshStandardMaterial({ color: 0xFF2222, side: THREE.DoubleSide }));
    wings.position.y = 0.5;
    wings.position.z = -4;
    this.mesh.add(wings);
    const tail = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), new THREE.MeshStandardMaterial({ color: 0xFF2222, side: THREE.DoubleSide }));
    tail.position.y = 0.5;
    tail.position.z = 9;
    tail.rotation.z = Math.PI / 2;
    this.mesh.add(tail);
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 6, 8), new THREE.MeshStandardMaterial({ color: 0x88CCFF, transparent: true, opacity: 0.8 }));
    canopy.position.y = 1;
    canopy.position.z = 3;
    canopy.rotation.x = Math.PI / 2;
    this.mesh.add(canopy);
    this.mesh.position.set(0, 10, 0);
    this.mesh.rotation.y = Math.PI;
  }
  update(position, pitch, roll, throttle) {
    this.mesh.position.copy(position);
    this.mesh.rotation.y = Math.PI + roll * 0.5;
    this.mesh.rotation.x = pitch * 0.4;
  }
}
