import { LandscapeApp } from 'lumin';
import { WebGlController } from 'magic-script-webgl-prism-controller';

import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export class App extends LandscapeApp {
  onAppStart () {
    let prism = this.requestNewPrism([0.5, 0.5, 0.02]);
    let controller = window.controller = new WebGlController();
    prism.setPrismController(controller);
  }
}

window.onload = () => {
  // Create an empty scene
  const scene = new Scene();

  // Create a basic perspective camera
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 4;

  // Create and configure a renderer
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor('#000000');
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Append Renderer to DOM
  // Note: WebGLController ignores these calls, only here for browser compat.
  document.body.appendChild(renderer.domElement);

  // Create a Cube Mesh with basic material
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: '#433F81' });
  const cube = new Mesh(geometry, material);

  // Add cube to Scene
  scene.add(cube);

  return render();

  function render () {
    window.requestAnimationFrame(render);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // Render the scene
    renderer.render(scene, camera);
  }
};
