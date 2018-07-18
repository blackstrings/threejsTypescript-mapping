import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as THREE from 'three';

import { Grid } from '../UI/Grid';
import { Shape2D } from '../components/shapes/Shape2D';
import { Subscriptions } from '../events/Subscriptions';
import { Shape } from '../components/shapes/Shape';
import { VectorUtils } from '../utils/VectorUtils';
import { Subscription } from 'rxjs/Subscription';
import { Debug } from '../utils/Debug';
import { Space } from '../components/Space';

/**
 * Manages actual shape classes.
 * 
 * @export
 * @class SceneManager
 */
export class SceneManager {
  
  public static activeShapeSelectedPub: ReplaySubject<Shape> = new ReplaySubject<Shape>(1);

  private debug: Debug = null;
  private activeScene: THREE.Scene = null;
  private grid: Grid = null;
  
  private shapes: Shape[] = [];

  
  public children: THREE.Object3D[];

  constructor() {
    this.activeScene = new THREE.Scene();
    this.children = this.activeScene.children;
    this.showGrid();
    this.showAxisHelper();
    
    // select the shape base on geometry selection
    Subscriptions.selectedObjectId.subscribe((objectId: number) => {
      // this.activeShape = this.getShape(objectId);
      
      // TODO
      // pub the shape
      // SceneManager.activeShapeSelectedPub.next(this.activeShape);
    });

    Subscriptions.debugSetupComplete.subscribe((debug: Debug) => {
      this.debug = debug;
    });
    
    // when new shape gets created
    Subscriptions.newShapeCreated.subscribe((shape: Shape) => {
      this.addToScene(shape);
    });
    
    Subscriptions.shapeDeleted.subscribe((shape: Shape) => {
      this.removeFromScene(shape);
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

  public addToScene(shape: Shape): void {
    if (shape && this.activeScene) {
      this.activeScene.add(shape.mesh);
    } else {
      console.warn('fail to add to sceen, shape or activeScene is null');
    }
  }

  /**
   * Handles adding non-shape objects like helpers
   * @param {Object3D} obj
   */
  public addToScene2(obj: THREE.Object3D): void {
    this.activeScene.add(obj);
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
  
  public removeFromSceneById(id: number): boolean {
    let result: boolean = false;
    if (id && id >= 0) {
      this.removeFromScene(null, id);
      result = true;
    } else {
      console.warn('Failed to remove shape from scene by id, id is null');
    }
    return result;
  }

  public getActiveScene(): THREE.Scene {
    return this.activeScene;
  }

}