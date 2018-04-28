import * as THREE from 'three';

import { Shape } from '../components/shapes/Shape';
import { CanvasManager } from '../managers/CanvasManager';
import { Subscriptions } from "../events/Subscriptions";
import { Mouse } from '../UI/Mouse';
import { CameraManager } from './CameraManager';
import { SceneManager } from './SceneManager';
import { Debug } from '../utils/Debug';
import { ShapeManager } from './ShapeManager';

export class MovementManager {

  private debug: Debug = null;

  public selectedShape: Shape;

  /**
   * prevent unnecessary multiple event listeners from firing when already fired
   * 
   * @private
   * @type {boolean}
   * @memberof MovementManager
   */
  private isActivated: boolean = false;

  public isEnabled: boolean = true;

  private raycaster: THREE.Raycaster = new THREE.Raycaster();

  /**
   * A math plane for finding intersection points on mouse down and mouse move.
   * THREE.Plane is a non-visible math plane that has a direction and stretches out infinitely in space.
   * The default plane normal is +Z which is what you want for mouse detection on screen
   * @private
   * @type {THREE.Plane}
   * @memberof MovementManager
   */
  private plane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  constructor(private canvasManager: CanvasManager,
    private cameraManager: CameraManager,
    private sceneManager: SceneManager,
    private mouse: Mouse,
    private shapeManager: ShapeManager) {

    Subscriptions.debugSetupComplete.subscribe((debug: Debug) => {
      this.debug = debug;
    });

    Subscriptions.selectedObjectId.subscribe((objectId: number) => {
      if (this.sceneManager) {
        const shape: Shape = this.shapeManager.getShapeById(objectId);
        if (shape) {
          this.selectedShape = shape;
          if (this.debug && this.debug.enabled && this.debug.selectedShapeForMoveLog) {
            console.log('<< MovementManager >> Selected shape for move is:');
            console.log(this.selectedShape);
          }
        }
        // do nothing
      } else {
        console.warn('failed to set selected shape, sceneManager is null');
      }
    });

    this.activate();
  }

  public activate(): void {
    if (this.isActivated) {
      return;
    }

    this.isActivated = true;
    if (this.canvasManager.rendererDomParent) {
      this.canvasManager.rendererDomParent.addEventListener('mousemove', this.move.bind(this), false);
      this.canvasManager.rendererDomParent.addEventListener('mouseup', this.finalize.bind(this), false);
      this.canvasManager.rendererDomParent.addEventListener('mouseleave', this.finalize.bind(this), false);  // when mouse move outside of canvas

      this.canvasManager.rendererDomParent.addEventListener('touchmove', this.move.bind(this), false);
      this.canvasManager.rendererDomParent.addEventListener('touchend', this.finalize.bind(this), false);
      this.canvasManager.rendererDomParent.addEventListener('touchcancel', this.finalize.bind(this), false);
    }
  }

  public deactivate(): void {
    if (!this.isActivated) {
      return;
    }

    this.isActivated = false;
    if (this.canvasManager.rendererDomParent) {
      this.canvasManager.rendererDomParent.removeEventListener('mousemove', this.move.bind(this), false);
      this.canvasManager.rendererDomParent.removeEventListener('mouseup', this.finalize.bind(this), false);
      this.canvasManager.rendererDomParent.removeEventListener('mouseleave', this.finalize.bind(this), false);  // when mouse move outside of canvas

      this.canvasManager.rendererDomParent.removeEventListener('touchmove', this.move.bind(this), false);
      this.canvasManager.rendererDomParent.removeEventListener('touchend', this.finalize.bind(this), false);
      this.canvasManager.rendererDomParent.removeEventListener('touchcancel', this.finalize.bind(this), false);
    }
  }

  protected move(event: MouseEvent): void {
    if (this.isEnabled && this.selectedShape) {
      console.log(`<< MovementManager >> 'mousemove'`);
      event.preventDefault();

      this.mouse.update(event);

      this.raycaster.setFromCamera(this.mouse.position, this.cameraManager.getActiveCamera());

      // location of the moust down in 3D space on the math plane
      const intersection: THREE.Vector3 = new THREE.Vector3();

      // tell the ray caster to use the plane for finding intersection points
      const mouseDownPosition: THREE.Vector3 = this.mouse.mouseDownPosition;
      if (this.raycaster.ray.intersectPlane(this.plane, intersection) && mouseDownPosition) {

        // find the offset/diff
        // get the difference between the mouseDown location and the current mouse location
        // Note: intersection and mouseDownPosition occurred on the same math plane, mathPlane sits in world space
        // the diff is in world position
        const diffWorld: THREE.Vector3 = new THREE.Vector3();
        diffWorld.subVectors(intersection.clone(), mouseDownPosition.clone());

        // get the shape's original local position and convert it to world position, so it be on the same local layer as the diff vector
        // key here is to reference the selected shape's starting position in local space which should stay constant during mouse move
        // use the shape's parent to convert its local position to world
        var shapeOriginalPositionWorld: THREE.Vector3 = this.selectedShape.mesh.parent.localToWorld(this.mouse.shapeOriginPositionLocal.clone());
        var newShapePositionWorld: THREE.Vector3 = shapeOriginalPositionWorld.add(diffWorld);
        const newShapePositionLocal: THREE.Vector3 = this.selectedShape.mesh.parent.worldToLocal(newShapePositionWorld);


        // snapping
        const snapeValue: number = 12;
        // snapping
        // Math.round(newShapePositionLocal.y / snapeValue) * snapeValue;

        // y snap only
        // this.selectedShape.mesh.position.set(
        //   newShapePositionLocal.x,
        //   Math.round(newShapePositionLocal.y / snapeValue) * snapeValue,
        //   newShapePositionLocal.z,
        // );

        // x and y snap
        this.selectedShape.mesh.position.set(
          Math.round(newShapePositionLocal.x / snapeValue) * snapeValue,
          Math.round(newShapePositionLocal.y / snapeValue) * snapeValue,
          newShapePositionLocal.z,
        );


      }
    }
  }

  private finalize(e: MouseEvent): void {
    this.selectedShape = null;
  }

}