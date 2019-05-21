# MagicScript WebGL PrismController

[![npm version](https://badge.fury.io/js/magic-script-webgl-prism-controller.svg)](https://badge.fury.io/js/magic-script-webgl-prism-controller) [![License](https://img.shields.io/:license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

Helper library for running webgl code in a Lumun Runtime Quadnode.

This expands on magic-script-polyfills to add an environment where popular webgl framework such as three.js and xeogl can run out of the box.

## Usage

Create a normal MagicScript LandScape app and use this PrismController on your prism to enable browser style webgl APIs.

```js
import { LandscapeApp } from 'lumin';
import { WebGlController } from 'magic-script-webgl-prism-controller';

import {
  BoxBufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, TextureLoader, WebGLRenderer
} from 'three';

export class App extends LandscapeApp {
  onAppStart () {
    let prism = this.requestNewPrism([0.5, 0.5, 0.02]);
    let controller = window.controller = new WebGlController();
    prism.setPrismController(controller);
  }
}
```

Now, you can consume existing webgl libraries such as three.js, it will render to a quad that's created inside your prism.  Note that this part of the code can also be used in a web browser.

```js
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

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

  // Start rendering/animation.
  return window.requestAnimationFrame(render);

  function render (time) {
    window.requestAnimationFrame(render);
    cube.rotation.x = time / 1000;
    cube.rotation.y = time / 1200;
    renderer.render(scene, camera);
  }
};
```

## Installation

Open a Terminal in your project's folder and run,

```sh
npm install magic-script-webgl-prism-controller
```

or

```sh
yarn add magic-script-webgl-prism-controller
```

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details
