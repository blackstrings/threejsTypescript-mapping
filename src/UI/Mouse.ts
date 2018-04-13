import * as THREE from 'three';

import { CanvasManager } from '../managers/CanvasManager';
import { CameraManager } from '../managers/CameraManager';
import { Debug } from '../utils/Debug';
import { Subscriptions } from '../events/Subscriptions';

/**
 * Manage mouse features which include position tracking.
 * 
 * Unlike orbital controls, this mouse is for handling seperate click events un-related to orbital controls.
 * NOTE: some functions are purely for develop environments only.
 *
 * @abstract
 * @export
 * @class Mouse
 */
export class Mouse {

  private debug: Debug = null;

  /**
   * Used to add the logging prefix to any logger messages (unique to extended class)
   *
   * @private
   * @type {string}
   * @memberof Mouse
   */
  private logPrefix: string;

  /**
   * Contains the mouse coordinates
   *
   * @type {THREE.Vector2}
   * @memberof Mouse
   */
  private _position: THREE.Vector2 = new THREE.Vector2();

  /**
   * Location of mouse down event
   *
   * @type {Vector3}
   * @memberof Mouse
   */
  public mouseDownPosition: THREE.Vector3;
  
  // store the shape origin position on first mouse down - for later use with moving
  public shapeOriginPositionLocal: THREE.Vector3 = new THREE.Vector3();

  /**
   * Creates the instance of Mouse, an injectable service used by the SelectionManager and MovementManager
   * @param {LoggerService} logger
   * @param {CanvasManager} canvasManager
   * @param {CameraManager} cameraManager
   * @memberof Mouse
   */
  constructor(
    protected canvasManager: CanvasManager,
    protected cameraManager: CameraManager
  ) {


    if (this.debug && this.debug.enabled && this.debug.mouseMoveLog) {
      this.canvasManager.rendererDomParent.addEventListener('mousemove', (event: MouseEvent) => {
        this.onMouseMove(event);
      }, false);
    }

    // subscription
    Subscriptions.debugSetupComplete.subscribe((debug: Debug) => {
      this.debug = debug;
    });
  }

  /**
   * Whenever mouse move, we have to update the x and y.
   * 
   * e.clientX and e.ClientY are the mousedown coordinates.
   * rect is an object which contains the bounding coordinates of the canvas element.
   * mouse.x and mouse.y are the normalized coordinates that threejs uses to create the raycaster.
   * They will have values between -1 and +1
   *
   * The following formulae are used to calculate the normalized coordinates required by threejs. They
   * are derived from combining the threejs calculations with the formulae found here:
   * http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
   *
   * @param {MouseEvent} event
   *
   * @memberof Mouse
   */
  public update(event: Event): void {
    const rect: ClientRect = this.canvasManager.rendererDomParent.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      this._position.x = (event.clientX - rect.left) / (rect.right - rect.left) * 2 - 1;
      this._position.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    } else if (event instanceof TouchEvent) {
      this._position.x = (event.touches[0].clientX - rect.left) / (rect.right - rect.left) * 2 - 1;
      this._position.y = - ((event.touches[0].clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    }
  }

  /**
   * Getter for mouse position
   *
   * @readonly
   * @type {THREE.Vector2}
   * @memberof Mouse
   */
  public get position(): THREE.Vector2 {
    return this._position;
  }

  // *********************** Debug properties ***********************

  /**
   * Publicizes the enabling of a visual indicator for mouse position
   * NOTE: purely for debug purposes
   *
   * @private
   * @type {Subject<THREE.Points>}
   * @memberof Mouse
   */
  //private _toggleVisualMouse: ReplaySubject<THREE.Points> = new ReplaySubject<THREE.Points>(1);

  /**
   * Subscription for the enabling of a visual indicator for mouse position
   * NOTE: purely for debug purposes
   *
   * @type {Observable<THREE.Points>}
   * @memberof Mouse
   */
  //public toggleVisualMousePublication: Observable<THREE.Points> = this._toggleVisualMouse.asObservable();

  /**
   * Denotes when mouse indicator has been turned on
   *
   * @private
   * @type {boolean}
   * @memberof Mouse
   */
  private _isMouseIndicatorEnabled: boolean = false;

  /**
   * For tracking/updating location of mouse
   *
   * @private
   * @type {THREE.Geometry}
   * @memberof Mouse
   */
  private pointCloud: THREE.Geometry;

  /**
   * Reference to the currently active mouse indicator (for add/remove in scene)
   *
   * @private
   * @type {THREE.Points}
   * @memberof Mouse
   */
  private mouseIndicator: THREE.Points;

  /**
   * Used to help determine current mouse position
   *
   * @private
   * @type {THREE.Raycaster}
   * @memberof Mouse
   */
  private raycaster: THREE.Raycaster = new THREE.Raycaster();

  /**
   * A math plane for finding intersection points on mouse down and mouse move.
   * THREE.Plane is a non-visible math plane that has a direction and stretches out infinitely in space.
   * @private
   * @type {THREE.Plane}
   * @memberof DragControls
   */
  private plane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  // *********************** Debug functions ***********************

  /**
   * Provides a visual cue for position of mouse click events. Once executed, the reference
   * is enabled for the rest of the current session. Typically used for debugging purposes.
   *
   * @memberof Mouse
   */
  private toggleVisualMouse(): void {
    if (this.debug && this.debug.enabled) {
      if (this._isMouseIndicatorEnabled) {
        //this._toggleVisualMouse.next(this.mouseIndicator); // will remove mouse indicator from scene
      } else {
        this.pointCloud = new THREE.Geometry();
        this.pointCloud.vertices.push(new THREE.Vector3(0, 0, 0));
        const dotMaterial: THREE.PointsMaterial = new THREE.PointsMaterial({
          size: 5,
          sizeAttenuation: false,
          color: 0xff0000 //Colors.RED.value()
        });
        this.mouseIndicator = new THREE.Points(this.pointCloud, dotMaterial);

        //this._toggleVisualMouse.next(this.mouseIndicator); // will add mouse indicator to scene
      }
      this._isMouseIndicatorEnabled = !this._isMouseIndicatorEnabled; // toggles
    }
  }

  /**
   * Updates the mouse indicator position
   *
   * @private
   * @param {MouseEvent} event
   * @memberof Mouse
   */
  private onMouseMove(event: MouseEvent): void {
    // TODO: turn off for now
    if (this.debug && this.debug.enabled && this.debug.mouseMoveLog) {
      console.warn(this.debug.message + "mouse move is activated");
      // document.getElementById('containerName').style.cursor = 'pointer'; // Uncomment to change cursor to pointer

      if (this._isMouseIndicatorEnabled && this.debug.enabled) {
  
        this.update(event);
  
        this.raycaster.setFromCamera(this.position, this.cameraManager.getActiveCamera());
        const currentMouseLocation: THREE.Vector3 = this.raycaster.ray.intersectPlane(this.plane);
  
        if (currentMouseLocation) {
          this.pointCloud.vertices[0] = currentMouseLocation;
          this.pointCloud.verticesNeedUpdate = true;
        }
      }

    }
  }

  /**
   * Getter for enabled state of mouse indicator
   *
   * @readonly
   * @type {boolean}
   * @memberof Mouse
   */
  public get isMouseIndicatorEnabled(): boolean {
    return this._isMouseIndicatorEnabled;
  }

}
