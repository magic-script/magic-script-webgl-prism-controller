import { PrismController } from 'lumin';
import * as egl from 'egl';
import * as gl from 'gl';
import * as png from 'png';
import * as jpeg from 'jpeg';

let cb;
globalThis.requestAnimationFrame = fn => { cb = fn; };

export let frameCost = 0;
export let frameCount = 0;

export class WebGlController extends PrismController {
  onAttachPrism () {
    let prism = this.getPrism();
    let root = this.getRoot();

    // create planar resource
    let id = prism.createPlanarEGLResourceId(1024, 1024);
    let quad = this.quad = prism.createQuadNode(id);
    let [w, h] = prism.getSize();
    quad.setLocalScale([w, h, 1]);
    quad.setLocalPosition([-w / 2, -h / 2, 0]);
    quad.setBackFaceCulls(false);
    quad.setIsOpaque(false);
    root.addChild(quad);
    let resource = this.resource = prism.getResource(id);
    let surface = this.surface = resource.getEGLSurface();
    let context = this.context = resource.getEGLContext();
    egl.makeCurrent(surface, surface, context);
    this.start = Date.now();

    globalThis.requestAnimationFrame = callback => {
      this.cb = callback;
    };
    if (cb) this.cb = cb;
    if (window.onload) { window.onload(); }
    return 0;
  }
  onUpdate () {
    if (this.cb) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      let fn = this.cb;
      this.cb = null;
      const now = Date.now();
      fn(now - this.start);
      frameCost += Date.now() - now;
      frameCount++;
      egl.swapBuffers(this.surface);
    }
    return true;
  }
}

export let width = 1024;
export let height = 1024;

let DomNode = {
  get parentElement () { return this; },
  appendChild () { return this; },
  addEventListener (event, fn) {
    print('Ignoring addEventListener', event);
  },
  get style () { return {}; },
  querySelector (selector) {
    print('querySelector', selector);
    if (/canvas/.test(selector)) return canvas;
  }
};

let canvas = {
  __proto__: DomNode,
  getContext (type) {
    if (type !== 'webgl') return {};
    const context = Object.create(gl)
    context.canvas = canvas;
    return context;
  },
  clientWidth: width,
  clientHeight: height,
  width,
  height
};

let body = {
  __proto__: DomNode
};

globalThis.window = globalThis;
window.innerWidth = width;
window.innerHeight = height;
window.devicePixelRatio = 1;

globalThis.document = {
  __proto__: DomNode,
  getElementsByTagName (name) {
    print('document.getElementsByTagName', name);
    if (name === 'body') return [body];
    if (name === 'canvas') return [canvas];
    return [];
  },
  getElementById (id) {
    print('document.getElementById', id);
    if (/canvas/.test(id)) return canvas;
  },
  createElement (tag) {
    if (tag === 'canvas') return canvas;
    if (tag === 'img') return new Image();
    return { __proto__: DomNode };
  },
  createElementNS (namespace, tag) {
    if (namespace === 'http://www.w3.org/1999/xhtml') return this.createElement(tag);
    return { __proto__: DomNode };
  },
  body
};

class Image {
  set src (url) {
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(data => {
        print('Image loaded', url);
        let decode;
        if (/\.png/i.test(url)) {
          decode = png.decode;
        } else if (/\.jpe?g/i.test(url)) {
          decode = jpeg.decode;
        } else {
          throw new Error('Can only load .png, .jpg, or .jpeg images');
        }
        let { width, height, pixels, bpp } = decode(data);
        print('Image decoded', width, height, pixels, bpp);
        if (width * height * bpp !== pixels.byteLength) {
          throw new Error('Decode output mismatched size');
        }
        this.bpp = bpp;
        this.width = width;
        this.height = height;
        this.pixels = pixels;
        this.onload();
      }, err => {
        if (this.onerror) {
          this.onerror(err);
        } else {
          throw err;
        }
      });
  }
  addEventListener (name, cb) {
    if (name === 'load') this.onload = cb;
  }
  removeEventListener (name, cb) {
    if (name === 'load' && this.onload === cb) this.onload = undefined;
  }
}

globalThis.Image = Image;

globalThis.navigator = {};

class WebVRManager {

}

globalThis.WebVRManager = WebVRManager;
