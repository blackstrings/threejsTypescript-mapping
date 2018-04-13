import * as THREE from 'three';

import OrbitControlsFactory from '../plugins/three-orbital-controls';
let OrbitControls = OrbitControlsFactory(THREE);

import { CanvasManager } from './CanvasManager';
import { Debug } from '../utils/Debug';
import { Subscriptions } from '../events/Subscriptions';

export class CameraManager {

  private debug: Debug = null;
  private activeCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private orbitControls: any;
  
  private renderDomElement: HTMLElement = null;

  /**
   * Creates an instance of CameraManager.
   * @param {HTMLElement} dom helps define the camera aspect ratio
   * @memberof CameraManager
  /**
   * Creates an instance of CameraManager.
   * @param {CanvasManager} canvasManager 
   * @memberof CameraManager
   */
  constructor(private canvasManager: CanvasManager) {
    const width: number = this.canvasManager.getWidth();
    const height: number = this.canvasManager.getHeight();
    // this.activeCamera = this.createPerspectiveCamera(width, height); // you may see nothing when using this camera at first render
    this.activeCamera = this.createOrthographicCamera(width, height);

    // subscriptions
    
    // create orbital controls once when renderer.domElement is setup and ready
    Subscriptions.rendererSetupComplete.subscribe((dom: HTMLElement) => {
      this.renderDomElement = dom;
    });
    
    Subscriptions.debugSetupComplete.subscribe((debug: Debug) => {
      this.debug = debug;
    });
    
    // TODO: subscribes to window size update
    // this.updateActiveCameraProjection();
    
  }
  
  public init(): void {
    if (this.renderDomElement) {
      if (!this.orbitControls) {
        this.createOrbitalControls(this.renderDomElement);
      } else {
        console.warn('failed to create orbital controls, orbital controls is already created');
      }
    } else {
      console.warn('failed to init, rendererDomElement is null');
    }
  }

  /**
   * training http://stackoverflow.com/questions/17558085/three-js-orthographic-camera
   * 
   * For an app that requires the canvas to change to different size at runtime when the browser window is scaled
   * for orthocamera to continue to work and not cause distortions, you need to set up an update with the correct aspect ratio
   * 
   * otherwise only the inital launch will have the correct aspect ratio for ortho, once canvas updates, the aspect will be off
   * 
   * @private
   * @param {number} domWidth 
   * @param {number} domHeight 
   * @returns {THREE.OrthographicCamera} 
   * @memberof CameraManager
   */
  private createOrthographicCamera(domWidth: number, domHeight: number): THREE.OrthographicCamera {
    const viewSize = domHeight;
		const width = domWidth;

		const fieldOfView = 45;
		const aspectRatio = domWidth / viewSize;
		const aspectRatioH = viewSize / domWidth;
		const nearPlane = -500;
		const farPlane = 1000;
		//camera = new THREE.OrthographicCamera( this.width / - this.height, this.width/ this.height, this.height / this.width, this.height / - this.width, -100, 1000 );

		const viewport = {
			viewSize: viewSize,
			aspectRatio: aspectRatio,
			left: (-aspectRatio * viewSize) / 2,
			right: (aspectRatio * viewSize) / 2,
			top: viewSize / 2,
			bottom: -viewSize / 2,
			near: 1,
			far: 5000
		}
    // return new THREE.OrthographicCamera(-domWidth/ 2, domWidth / 2, domHeight, -domHeight, .1, 5000);
    const camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(viewport.left, viewport.right, viewport.top, viewport.bottom, viewport.near, viewport.far);
    
    // NOTE: if applying orbital controls, you must reset the origin of the camera or might get odd orbit controls movements when attached
    // Note: for ortho camera, distance of the camera from the center of the center doesn't matter
    // What matter is the zoom factor.
    // Therefore we just need to move 1 unit in z + lookat to correctly orient the camera
    camera.position.copy(new THREE.Vector3(0,0, 1));
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    return camera;
  }
  
  private createPerspectiveCamera(domWidth: number, domHeight: number): THREE.PerspectiveCamera {
    // aspect ratio must be correct or you see skewed visuals or nothing at all
    const aspect: number = domWidth / domHeight;
    const fov: number = 35;
    return new THREE.PerspectiveCamera(fov, aspect, .1, 5000);
  }
  
  /**
   * Usually called after the renderer is setup
   * as you can't create the orbital controls at the same time the camera manager is being created
   * as orbital controls need the renderer.dom element which is the canvas element
   * 
   * Note: Highly recommend there is only one orbital controls per camera. If more than one camera, create and handle separate orbital controls.
   * 
   * @param {HTMLElement} rendererCanvas 
   * @memberof CameraManager
   */
  private createOrbitalControls(rendererCanvas: HTMLElement): void {
    if (rendererCanvas && this.activeCamera) {
      this.orbitControls = new OrbitControls(this.activeCamera, rendererCanvas);

      // restrict ortho cameras from rotating
      if (this.activeCamera instanceof THREE.OrthographicCamera) {
        if (this.debug && this.debug.enabled && this.debug.forceEnableCameraRotation) {
          console.warn(this.debug.message + 'rotation for orthographic camera is turned on');
          this.orbitControls.enableRotate = true;
        } else {
          this.orbitControls.enableRotate = false;
        }
      }

      this.orbitControls.minPolarAngle = 0;
      this.orbitControls.maxPolarAngle = Math.PI;
  
      // Zoom limits
      this.orbitControls.minDistance = 180;
      this.orbitControls.maxDistance = 600;
  
      this.orbitControls.enablePan = true;
      this.orbitControls.enableZoom = true;
    } else {
      console.error('Orbital control failed to be created, rendererCanvas or activeCamera is null');
    }
  }
  
  /**
   * This method must be called whenever the browser resizes in order to prevent objects in
   * scene from becoming skewed.
   *
   * @memberof CameraManager
   */
  private updateActiveCameraProjection(): void {
    if (this.canvasManager.getWidth() && this.canvasManager.getHeight()) {
      if (this.activeCamera instanceof THREE.PerspectiveCamera) {

        const aspect: number = this.canvasManager.getWidth() / this.canvasManager.getHeight();
        this.activeCamera.aspect = aspect;

      } else if (this.activeCamera instanceof THREE.OrthographicCamera) {

        // TODO: may need to be revisited - look at how orthocamera is setup
        this.activeCamera.left = this.canvasManager.getWidth() / -2;
        this.activeCamera.right = this.canvasManager.getWidth() / 2;
        this.activeCamera.top = this.canvasManager.getHeight() / 2;
        this.activeCamera.bottom = this.canvasManager.getHeight() / -2;

      }
      // after setting the aspect on either camera, you need to call this to take into effect
      this.activeCamera.updateProjectionMatrix();
    } else {
      console.warn(`No height and/or width from CanvasManager to resize`);
    }
  }

  public getActiveCamera(): THREE.Camera {
    return this.activeCamera;
  }
}