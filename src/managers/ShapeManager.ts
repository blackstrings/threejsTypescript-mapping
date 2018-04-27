import * as THREE from 'three';

import { SelectionManager } from '../managers/SelectionManager';
import { Shape2D } from '../components/shapes/Shape2D';
import { Vendor } from '../components/Vendor';
import { SceneManager } from './SceneManager';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscriptions } from '../events/Subscriptions';
import { Shape } from '../components/shapes/Shape';
import { VendorManager } from './VendorManager';
import { Debug } from '../utils/Debug';
import { VectorUtils } from '../utils/VectorUtils';

/**
 * Managees spaces.
 * 
 * @export
 * @class SpaceManager
 */
export class ShapeManager {

  public static newShapeCreatedPub: ReplaySubject<Shape> = new ReplaySubject<Shape>(1);
  public static shapeDeletedPub: ReplaySubject<Shape> = new ReplaySubject<Shape>(1);

  // for generic meshes without shape
  public static newMeshCreated: ReplaySubject<THREE.Mesh> = new ReplaySubject<THREE.Mesh>(1);
  public static meshDeleted: ReplaySubject<THREE.Mesh> = new ReplaySubject<THREE.Mesh>(1);

  private debug: Debug = null;

  private shapes: Shape[] = [];

  private activeShape: Shape = null;

  private isCustomDrawEnabled: boolean = false;
  private isShapeEditEnabled: boolean = false;
  private newCustomShapePoints: THREE.Vector3[] = [];

  private tempGeoMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  private tempShapePointMeshes: THREE.Mesh[] = [];

  constructor() {

    // subscriptions
    Subscriptions.debugSetupComplete.subscribe((debug: Debug) => {
      this.debug = debug;
    });

    Subscriptions.mouseClick.subscribe((mouseClickPosition: THREE.Vector3) => {
      // custom draw if enabled
      this.drawCustomShape(mouseClickPosition);
    });
  }

  private getShapeByUUID(uuid: string): Shape {
    let shape: Shape = null;
    if (this.shapes && this.shapes.length) {
      
      const shapes: Shape[] = this.shapes.filter((shape) => shape.getUUID() === uuid);
      if (shapes && shapes.length) {
        shape = shapes[0];
      } else {
        console.warn(`failed to get shape of uuid ${uuid}`);
      }
      
    } else {
      console.warn('Failed to get shape by uuid, spaces is null or empty, returning null');
    }
    return shape;
  }
  
  public getShapeById(shapeId: number): Shape {
    let shape: Shape = null;
    if (this.shapes && this.shapes.length) {

      const shapes: Shape[] = this.shapes.filter((shape) => shape.getId() === shapeId);
      if (shapes && shapes.length) {
        shape = shapes[0];
      } else {
        console.warn(`failed to get shape of uuid ${shapeId}`);
      }

    } else {
      console.warn('failed to get shape, shapes is null or empty');
    }
    return shape;
  }

  /**
   * add slots to array
   * 
   * @param {Space} space 
   * @memberof SlotManager
   */
  private add(shape: Shape): void {
    if (this.shapes) {
      this.shapes.push(shape);
    } else {
      console.error('Failed to add shape, shapes is null');
    }
  }
  
  public removeByUUID(shapeUUID: string): Shape {
    let result: Shape = null;
    if (this.shapes && this.shapes.length) {
      const shapesFound: Shape[] = this.shapes.filter(shape => shape.getUUID() === shapeUUID);
      if (shapesFound && shapesFound.length) {
        const shapeFound: Shape = shapesFound[0];
        result = this.remove(shapeFound);
      } else {
        console.warn('Failed to remove shape by uuid, no match found');
      }
    } else {
      console.warn('Failed to remove shape by uuid, shapes is null or empty');
    }
    return result;
  }

  public remove(shape: Shape): Shape {
    let shapeRemoved: Shape = null;
    if (this.shapes && this.shapes.length) {
      const index: number = this.shapes.indexOf(shape);
      if (index >= 0) {
        shapeRemoved = this.shapes.splice(index, 1)[0];
        // ShapeManager.shapeDeletedPub.next(shapeRemoved);
      } else {
        console.warn('Failed to remove shape, shape not found in array');
      }
    } else {
      console.warn('Failed to remove shape, shapes is null or empty');
    }
    return shapeRemoved;
  }

  public createShape(points?: THREE.Vector3[]): Shape2D {
    let shape: Shape2D = null;

    if (points) {
      shape = new Shape2D(points);
      // show shape position locaiton visually
      if (this.debug && this.debug.enabled && this.debug.showShapePosition) {
        const axisHelper: THREE.AxesHelper = new THREE.AxesHelper(10);
        shape.mesh.add(axisHelper);
      }
    } else {
      // for debugging only
      const jsonPoints = [
        { x: -12, y: 12, z: 0 },
        { x: 12, y: 12, z: 0 },
        { x: 12, y: -12, z: 0 },
        { x: -12, y: -12, z: 0 }
      ];
      const points: THREE.Vector3[] = VectorUtils.convertJsonArrayToVec3s(jsonPoints);
      shape = new Shape2D(points);
    }
    this.add(shape);

    ShapeManager.newShapeCreatedPub.next(shape);
    return shape;
  }

  /**
   * TODO remove to shapeCreator
  * When custom draw is enabled, every 3 clicks will create a square
  * 
  * @private
  * @param {THREE.Vector3} mouseClickPosition 
  * @memberof SceneManager
  */
  private drawCustomShape(mouseClickPosition: THREE.Vector3): void {

    // snapping if we want it
    const snapValue: number = 12;
    const mouseClickSnapPos: THREE.Vector3 = new THREE.Vector3();
    const x: number = Math.round(mouseClickPosition.x / snapValue) * snapValue;
    const y: number = Math.round(mouseClickPosition.y / snapValue) * snapValue;
    mouseClickSnapPos.set(x, y, 0);

    const maxClick: number = 4;
    if (this.isCustomDrawEnabled) {

      // collect the clicks until you reach max click
      if (this.newCustomShapePoints && this.newCustomShapePoints.length < maxClick) {

        // store so we can later pass into shape2D
        this.newCustomShapePoints.push(mouseClickSnapPos);

        // create temp mesh on mouse click location
        this.createTempPointMesh(mouseClickSnapPos);

        if (this.newCustomShapePoints.length >= maxClick) {
          // draw the shape
          this.createShape(this.newCustomShapePoints);
          this.newCustomShapePoints = []; // reset
          this.setCustomDraw(false);  // turn off
          this.cleanTempPointMeshes();
        }

      }
    } // custom draw is not enabled, do nothing
  }

  private createTempPointMesh(mouseClickPos: THREE.Vector3): void {
    if (this.tempShapePointMeshes && this.tempGeoMat) {

      // size
      const radius: number = 2;
      const geo: THREE.Geometry = new THREE.CircleGeometry(radius, 8);
      const mesh: THREE.Mesh = new THREE.Mesh(geo, this.tempGeoMat);

      // move each temp circle into position of where the clicked occured
      mesh.position.copy(mouseClickPos);

      this.tempShapePointMeshes.push(mesh);
      ShapeManager.newMeshCreated.next(mesh);
    }
  }

  private cleanTempPointMeshes(): void {
    if (this.tempShapePointMeshes && this.tempShapePointMeshes.length) {
      this.tempShapePointMeshes.forEach((mesh) => {
        ShapeManager.meshDeleted.next(mesh);
      });
      this.tempShapePointMeshes = [];
    }
  }

  public setCustomDraw(value: boolean): void {
    this.isCustomDrawEnabled = value;
  }

  public setShapeEdit(value: boolean): void {
    this.isShapeEditEnabled = value;
  }

  public removeActiveShape(): void {
    if (this.activeShape) {
      this.remove(this.activeShape);
      this.activeShape = null;
    } else {
      console.log('No active shape removed, activeShape was null');
    }
  }
  
  public removeLastShape(): void {
    if (this.shapes && this.shapes.length) {
      const shapeToRemove: Shape = this.shapes[this.shapes.length - 1];
      this.remove(shapeToRemove);
    } else {
      console.log('failed to remove last shape, shapes is empty or null or activeScene is null');
    }
  }

}