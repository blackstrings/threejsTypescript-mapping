import * as THREE from 'three';

import { Grid } from '../UI/Grid';
import { Shape2D } from '../components/shapes/Shape2D';
import { Subscriptions } from '../events/Subscriptions';
import { Shape } from '../components/shapes/Shape';
import { VectorUtils } from '../utils/VectorUtils';
import { Subscription } from 'rxjs/Subscription';
import { Debug } from '../utils/Debug';

export class SceneManager {

  private debug: Debug = null;
  private activeScene: THREE.Scene = null;
  private grid: Grid = null;
  public children: THREE.Object3D[];

  private shapes: Shape[] = [];

  private isCustomDrawEnabled: boolean = false;
  private isShapeEditEnabled: boolean = false;
  private newCustomShapePoints: THREE.Vector3[] = [];
  
  private tempGeoMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  private tempShapePointMeshes: THREE.Mesh[] = [];

  constructor() {
    this.activeScene = new THREE.Scene();
    console.error(`active scene ready of id: ${this.activeScene.id}`);
    this.children = this.activeScene.children;
    this.showGrid();
    this.showAxisHelper();

    Subscriptions.mouseClick.subscribe((mouseClickPosition: THREE.Vector3) => {
      // custom draw if enabled
      this.drawCustomShape(mouseClickPosition);
    });
    
    Subscriptions.debugSetupComplete.subscribe((debug: Debug) => {
      this.debug = debug;
    });
  }

  public showGrid(): void {
    if (this.activeScene) {
      if (!this.grid) {
        this.grid = new Grid('front', 64);
        this.activeScene.add(this.grid.mesh);
      }
      this.grid.mesh.visible = true;
    } else {
      console.warn('Grid failed to show, activeScene is null');
    }
  }

  public hideGrid(): void {
    if (this.activeScene && this.grid) {
      this.activeScene.remove(this.grid.mesh);
    }
  }

  public showAxisHelper(): void {
    const axis = new THREE.AxesHelper();
    this.activeScene.add(axis);
  }


  //TODO allow add any type of shape
  public addToScene(shape: Shape): void {
    if (shape && this.activeScene) {
      this.activeScene.add(shape.mesh);
    } else {
      console.warn('fail to add to sceen, shape or activeScene is null');
    }
  }

  /**
   * Handles removing the shape.mesh from the scene only, not the shape itself.
   * 
   * @param {Shape} shape 
   * @param {number} [id] 
   * @memberof SceneManager
   */
  public removeFromScene(shape: Shape, id?: number): void {
    const prefix: string = 'failed to remove from scene,';
    let shapeToRemove: THREE.Object3D = null;
    if (this.activeScene) {

      if (shape) {  // by shape

        shapeToRemove = shape.mesh;

      } else if (id => 0) { // by id
        const objs: THREE.Object3D[] = this.children.filter(obj => obj.id === id);
        if (objs && objs.length) {
          shapeToRemove = objs[0];
        } else {
          console.warn(`${prefix} no obj found for id: ${id}`);
        }
      } else {
        console.warn(`${prefix} shape is null`);
      }

      if (shapeToRemove) {
        this.activeScene.remove(shapeToRemove);
      }
    } else {
      console.warn(`${prefix} activeScene is null`);
    }
  }

  public createShape(points?: THREE.Vector3[]): void {
    if (this.activeScene) {

      if (points) {

        const shape: Shape2D = new Shape2D(points);
        
        // show shape position locaiton visually
        if (this.debug && this.debug.enabled && this.debug.showShapePosition) {
          const axisHelper: THREE.AxesHelper = new THREE.AxesHelper(10);
          shape.mesh.add(axisHelper);
        }
        
        this.addShape(shape);

      } else {

        // for debugging only
        // test shape when no params are passd in and increment each new shape every 10 units apart
        const jsonPoints = [
          { x: -12, y: 12, z: 0 },
          { x: 12, y: 12, z: 0 },
          { x: 12, y: -12, z: 0 },
          { x: -12, y: -12, z: 0 }
        ];
        // const jsonPoints = [
        //   { x: 0, y: 0, z: 0 },
        //   { x: 0, y: 12, z: 0 },
        //   { x: 6, y: 18, z: 0 },
        //   { x: 12, y: 12, z: 0 },
        //   { x: 12, y: 0, z: 0 },
        // ];

        const points: THREE.Vector3[] = VectorUtils.convertJsonArrayToVec3s(jsonPoints);
        const s: Shape2D = new Shape2D(points);
        //s.mesh.position.x = this.children.length * 10;
        this.addShape(s);

      }

    } else {
      console.warn('activeScene is null');
    }
  }

  /**
   * Add shape to shapes array and to the scene.
   * 
   * @private
   * @param {Shape} shape 
   * @memberof SceneManager
   */
  private addShape(shape: Shape): void {
    if (this.shapes) {
      this.shapes.push(shape);
      this.addToScene(shape);
    } else {
      console.warn('failed to add shape, shape is null');
    }
  }
  
  public getShape(shapeId: number): Shape {
    let shape: Shape = null;
    if (this.shapes && this.shapes.length) {
      
      const shapes: Shape[] = this.shapes.filter((shape) => shape.mesh.id === shapeId);
      if (shapes && shapes.length) {
        shape = shapes[0];
      } else {
        console.warn(`failed to get shape of id ${shapeId}`);
      }
      
    } else {
      console.warn('failed to get shape, shapes is null or empty');
    }
    return shape;
  }

  /**
   * When custom draw is enabled, every 3 clicks will create a square
   * 
   * @private
   * @param {THREE.Vector3} mouseClickPosition 
   * @memberof SceneManager
   */
  private drawCustomShape(mouseClickPosition: THREE.Vector3): void {
    const maxClick: number = 4;
    if (this.isCustomDrawEnabled) {
      
      // collect the clicks until you reach max click
      if (this.newCustomShapePoints && this.newCustomShapePoints.length < maxClick) {
        this.createTempPointMesh(mouseClickPosition);
      
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
  
  private createTempPointMesh(mouseClick: THREE.Vector3): void {
    if (this.tempShapePointMeshes && this.tempGeoMat) {
      
      // size
      const radius: number = 2;
      const geo: THREE.Geometry = new THREE.CircleGeometry(radius, 8);
      const mesh: THREE.Mesh = new THREE.Mesh(geo, this.tempGeoMat);
      
      // get rounded number on grid
      const snapValue: number = 12;
      const mouseClickSnapPos: THREE.Vector3 = new THREE.Vector3();
      const x: number = Math.round(mouseClick.x / snapValue) * snapValue;
      const y: number = Math.round(mouseClick.y / snapValue) * snapValue;
      mouseClickSnapPos.set(x, y, 0);
      
      // store so we can later pass into shape2D
      this.newCustomShapePoints.push(mouseClickSnapPos);  
      
      // move each temp circle into position of where the clicked occured
      mesh.position.copy(mouseClickSnapPos);
      
      this.tempShapePointMeshes.push(mesh);
      this.activeScene.add(mesh);
    }
  }
  
  private cleanTempPointMeshes(): void {
    if (this.tempShapePointMeshes && this.tempShapePointMeshes.length) {
      
      this.tempShapePointMeshes.forEach((mesh) => {
        this.activeScene.remove(mesh);
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

  public removeLastShape(): void {
    if (this.shapes && this.shapes.length && this.activeScene) {
      const shapeToRemove: Shape = this.shapes.pop();
      this.removeFromScene(shapeToRemove);
    } else {
      console.warn('failed to remove last shape, shapes or activeScene is null');
    }
  }

  public getActiveScene(): THREE.Scene {
    return this.activeScene;
  }

}