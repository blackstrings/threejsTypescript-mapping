import * as THREE from 'three';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import { CanvasManager } from '../managers/CanvasManager';
import { CameraManager } from '../managers/CameraManager';
import { SceneManager } from '../managers/SceneManager';
import { Mouse } from '../UI/Mouse';
import { Debug } from '../utils/Debug';
import { VectorUtils } from '../utils/VectorUtils';
import { Subscriptions } from '../events/Subscriptions';

/**
 * The SelectionManager class, a wrapper around THREE.Raycaster, is used for capturing mouse events in
 * the canvas. It also contains a utility for projecting a small image onto the screen indicating
 * your current mouse location.
 *
 * @export
 * @class SelectionManager
 */
export class SelectionManager {

  private debug: Debug = null;

  /**
   * Used to add the logging prefix to any logger messages (unique to extended class)
   *
   * @private
   * @type {string}
   * @memberof SceneManager
   */
  private logPrefix: string = '<< SelectionManager >>';

  /**
   * Publicizes the threejs id of the mesh/obj selected.
   * The publication should only happen within this class and no where else with selectedObjectIdPub.next(number);
   *
   * @private
   * @type {ReplaySubject<number>}
   * @memberof SelectionManager
   */
  public static selectedObjectIdPub: ReplaySubject<number> = new ReplaySubject<number>(1);
  
  // avoid publishing the object
  // public static selectedObjectPub: ReplaySubject<THREE.Object3D> = new ReplaySubject<THREE.Object3D>(1);
  
  public static mouseClickPub: ReplaySubject<THREE.Vector3> = new ReplaySubject<THREE.Vector3>(1);
  
  // lazy way - we would just create the obserable in this class, but we move the convention where the public observable subscription
  // is in RXJS class object - any class wish to subscribe to the publication, will have to import subscription
  // any class can subscribe to this publication
  //public static selectedObjectIdSub: Observable<number> = SelectionManager.selectedObjectIdPub.asObservable();

  /**
   * The core of detecting objects in the 3d scene.
   * Raycasater shoots a ray into the scene. Whatever geometries it hits, gets pushed into an array for later accessibility.
   *
   * @private
   * @type {THREE.Raycaster}
   * @memberof SelectionManager
   */
  private raycaster: THREE.Raycaster = new THREE.Raycaster();

  /**
   * A math plane for finding intersection points on mouse down and mouse move.
   * THREE.Plane is a non-visible math plane that has a direction and stretches out infinitely in space.
   * @private
   * @type {THREE.Plane}
   * @memberof SelectionManager
   */
  private plane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private isEnabled: boolean = true;

  /**
   * Defines what is selectable and also defines order or precedence.
   *
   * When selecting multiple objects, to determine which object gets priority,
   * The object name at the beginning of the array have higher precedence than names towards the end of the array.
   * Or the lower the index, the higher the precedence.
   *
   * @private
   * @type {string[]}
   * @memberof SelectionManager
   */
  private selectableGeometries: string[] = ['shape', 'backgroundMesh'];

  /**
   * Creates an instance of SelectionManager.
   * @param {Type<Injectable>} child class that extends SelectionManager, used for logging
   * @param {LoggerService} logger
   * @param {CanvasManager} canvasManager
   * @param {SelectionManagerSubscription} selectionManagerSubscription
   * @param {CameraManager} cameraManager
   * @param {SceneChildrenManager} sceneChildrenManager
   * @param {Mouse} mouse
   * @memberof SelectionManager
   */
  constructor(
    protected canvasManager: CanvasManager,
    protected cameraManager: CameraManager,
    protected sceneManager: SceneManager,
    protected mouse: Mouse
  ) {

    // Subscribe to publications
    this.canvasManager.rendererDomParent.addEventListener('mousedown', (e) => { this.onMouseDown(e); }, false);
    this.canvasManager.rendererDomParent.addEventListener('touchstart', (e) => { this.onMouseDown(e); }, false);
    
    Subscriptions.debugSetupComplete.subscribe((debug: Debug) => {
      this.debug = debug;
    });
    
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  /**
   * Functionality to perform on a mouse down event
   *
   * @private
   * @param {MouseEvent} event
   * @memberof SelectionManager
   */
  private onMouseDown(event: Event): void {

    if (event instanceof MouseEvent) {
      event.preventDefault();
    }

    if (this.isEnabled) {

      this.mouse.update(event);

      // The raycaster.setFromCamera method updates the ray with a new origin and direction
      // based on the mousedown location and the current camera position.
      this.raycaster.setFromCamera(this.mouse.position, this.cameraManager.getActiveCamera());

      // Tracks the mouse down start position and publicizes it
      const mouseDownPosition: THREE.Vector3 = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(this.plane, mouseDownPosition)) {
        this.mouse.mouseDownPosition = VectorUtils.toFixed(mouseDownPosition);

        if (this.debug && this.debug.enabled) {
          console.log(`${this.logPrefix} mouse down location:`);
          console.log(mouseDownPosition);
          SelectionManager.mouseClickPub.next(this.mouse.mouseDownPosition);
          
          // send information to any class that wishes to listen to mouse click locations
          
        }
      }

      const selectedObject = this.filterSelection();
      if (selectedObject) {
        
        // store the offset from mouse click location to mesh origin position - for later moving so shape don't jump
        this.mouse.shapeOriginPositionLocal.copy(selectedObject.position.clone());
        SelectionManager.selectedObjectIdPub.next(selectedObject.id); // publish

        // avoid publishing the object, do the id instead
        // SelectionManager.selectedObjectPub.next(selectedObject);
        
        // this is ony when you have nested objects and wish to select an object passively rather than directly
        // if the selected object carries userData, use the id from the userData instead
        // this is the case where a empty mesh has a background mesh as a child, and we are using the background mesh as the click region
        if (selectedObject.userData) {
          //console.log(`Selected object id: ${selectedObject.userData.componentID}`);
          //this._selectedThreeJSObjectId.next(selectedObject.userData.componentID);

        } else {

          // fallback should the selected object not have componentUserData
          // this the case where a side grabspot does not have background mesh as child
          //console.log(`selected object id: ${selectedObject.id}`);
          //this._selectedThreeJSObjectId.next(selectedObject.id);
        }
        
      }
    }
  }

  /**
   * filterSelection gets an array of objects that the THREE.Raycaster intersects,
   * iterates through them, filters them by mesh name, and returns the first relevant
   * object that it hits. The filter used to find relevant objects is in the form of an
   * array of strings called 'selectableGeometries'.
   * @private
   * @returns {THREE.Object3D}
   *
   * @memberof Selector
   */
  private filterSelection(): THREE.Object3D {
    let selectedObject: THREE.Object3D;

    if (this.sceneManager.children && this.sceneManager.children.length > 0) {
      // intersects is an array of objects that the raycaster hits
      const intersects: THREE.Intersection[] = this.raycaster.intersectObjects(this.sceneManager.children, true);

      const intersectedObjs: THREE.Object3D[] = [];

      // log the point of intersect
      if (intersects.length > 0 && intersects[0]) {
        console.log(`selected object location: `);
        const objectLocation: THREE.Vector3 = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
        VectorUtils.toFixed(objectLocation);
        console.log(objectLocation);
      }

      // log any shapre regardless of filtered shapes
      if (this.debug && this.debug.enabled) {
        if (intersects[0]) {
          // console.log('Mesh of Object clicked:', intersects[0].object);
          // this._selectedThreeJSObjectId.next(intersects[0].object.id); sends publication to ComponentManager...will be useful at some point in near future EPD 1/5/2018
        }
      }

      // Loop through all intersected objects, checks for valid mesh names, and push them into an array for further filtering
      for (const obj of intersects) {
        for (const name of this.selectableGeometries) {
          if (obj.object.name === name) {
            intersectedObjs.push(obj.object);
          }
        }
      }

      // if multiple valid objects are hit, run one more pass to get selected object who has the higher precedence
      if (intersectedObjs.length > 1) {
        selectedObject = this.getObject3DByOrderOfPrecedence(intersectedObjs);
      } else {
        // if single object hit, just assign the object at index zero
        selectedObject = intersectedObjs[0];
      }
      
      if (selectedObject) {
        // valid selections are geometry with valid names in the selectableGeometries array
        if (this.debug && this.debug.enabled) {
          console.log('Selected filtered geometry is a valid selection of name: ' + selectedObject.name);
        }
      } else {
        if (this.debug && this.debug.enabled) { console.log('No geometry selected or geometry is a invalid selection'); }
      }

    } else {
      console.log(`no children exist in scene to select`);
    }
    
    return selectedObject;
  }

  public get $isEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Returns the object3D with higher precedence.
   * Returns null if the array is null or empty.
   *
   * If all objects have no precedence, the first object in the selected3DObjects array gets selected by default.
   *
   * Object3D names are the key to knowing their precedence value.
   * Compares the selected objects's names against an array of names in precedence order.
   * From left to right in the array, items with a lower index has the higher precedence.
   *
   * @param {THREE.Object3D[]} [selected3DObjects=[]]
   * @returns {THREE.Object3D}
   * @memberof SelectionManager
   */
  private getObject3DByOrderOfPrecedence(selected3DObjects: THREE.Object3D[] = []): THREE.Object3D {
    let selectedObject: THREE.Object3D = null;
    let objectWithHigherPrecedenceFound: boolean = false;

    if (selected3DObjects) {

      if (selected3DObjects.length === 1) {
        selectedObject = selected3DObjects[0];
      } else if (selected3DObjects.length > 1) {

        // iterarate through the selectableGeometries list
        for (const precedenceName of this.selectableGeometries) {

          // iterate through obj that were passed in
          for (const obj3D of selected3DObjects) {

            // soon as we find object3D name that matches a precedenceName, we break out
            // that object is guaranteed to have higher precedence than the rest, no need to check the rest
            if (precedenceName === obj3D.name) {
              selectedObject = obj3D;
              objectWithHigherPrecedenceFound = true;
              // precedence is found break out
              break;
            }
          }

          if (objectWithHigherPrecedenceFound) {
            // precedence is found break out
            break;
          }
        }

        if (!objectWithHigherPrecedenceFound) {
          selectedObject = selected3DObjects[0];
        }

      }
    } else {
      console.error(`Failed to select by order of precedence, selected3DObjects array is empty returning null`);
    }

    return selectedObject;
  }

}
