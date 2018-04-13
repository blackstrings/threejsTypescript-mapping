import * as THREE from 'three';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

export class RenderManager {

  private renderer: THREE.WebGLRenderer;
  private rendererDomParent: HTMLElement;
  public activeScene: THREE.Scene;
  public activeCamera: THREE.Camera;

  private isRendering: boolean = false;
  private requestAnimationId: number;
  
  public static rendererSetupComplete: ReplaySubject<HTMLElement> = new ReplaySubject<HTMLElement>(1);

  constructor(rendererDomParent: HTMLElement, activeScene: THREE.Scene, activeCamera: THREE.Camera) {
    if (rendererDomParent && activeScene && activeCamera) {

      this.rendererDomParent = rendererDomParent;
      this.activeScene = activeScene;
      this.activeCamera = activeCamera;

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.rendererDomParent.offsetWidth, this.rendererDomParent.offsetHeight);

      this.renderer.setClearColor(0xcccccc, 1);
      rendererDomParent.appendChild(this.renderer.domElement);
      
      //publish the event for whoever needs to listen that RenderManager is ready
      RenderManager.rendererSetupComplete.next(this.renderer.domElement);

      // kick off render
      this.render(this.activeScene, this.activeCamera);

    } else {
      throw new Error('<< RenderManager >> dom, activeScene, or activeCamera is null or undefined');
    }
  }

  public setActiveScene(scene: THREE.Scene): void {
    this.activeScene = scene;
  }

  public setActiveCamera(cam: THREE.Camera): void {
    this.activeCamera = cam;
  }

  public getCanvas(): HTMLCanvasElement {
    if (this.renderer) {
      return this.renderer.domElement;
    }
    console.warn('Cannot return renderer canvas, renderer is null');
    return null;
  }

  /**
  * A call to render the scene.
  * If a render loop is already running, it will be stopped and
  * then restarted to prevent multiple recursive calls from ever happening.
  *
  * @param {THREE.Scene} scene scene from SceneManager
  * @param {THREE.Camera} activeCamera current active camera from CameraManager
  * @memberof RenderManager
  */
  public render(scene?: THREE.Scene, camera?: THREE.Camera): void {
    if (scene && camera) {

      // reference the scene and camera for render loop
      this.activeScene = scene;
      this.activeCamera = camera;
    }
    
    if (this.activeCamera && this.activeScene) {

      // stop the render loop - sometimes stopping the render and re starting the render picks up changes better
      this.stopRenderLoop();

      // kick off the render loop
      this.renderLoop();

    } else {
      throw new Error(`Cannot render scene, scene or camera is null`);
    }

  }

  /**
   * The recursive render loop that runs at 60fps (frames per seconds) or as fast as the client's device can process.
   *
   * This call should only be fired by the renderer, as it is a recursive call.
   *
   * @private
   * @memberof RenderManager
   */
  private renderLoop(): void {
    if (this.renderer) {
      if (this.activeScene && this.activeCamera) {

        // run this before you run the render loop
        this.renderer.render(this.activeScene, this.activeCamera);

        this.requestAnimationId = requestAnimationFrame(() => this.renderLoop());

      } else {
        console.warn(`<< RenderManager >> Scene and/or activeCamera is null or undefined`);
      }
    } else {
      console.warn(`<< RenderManager >> Renderer has not be initialized unable to render display`);
    }
  }

  /**
  * Stops the render loop.
  * requestAnimationFrame() returns an id when called, we simply stop it by reusing that id
  *
  *
  * @private
  * @memberof RenderManager
  */
  private stopRenderLoop(): void {
    if (this.requestAnimationId) {
      cancelAnimationFrame(this.requestAnimationId);
    }
  }

}