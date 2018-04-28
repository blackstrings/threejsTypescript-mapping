import { Observable } from 'rxjs/Observable';

import { SceneManager } from '../managers/SceneManager';
import { SelectionManager } from '../managers/SelectionManager';
import { RenderManager } from '../managers/RenderManager';
import { Debug } from '../utils/Debug';
import { UIManager } from '../managers/UIManager';
import { SpaceManager } from '../managers/SpaceManager';
import { Space } from '../components/Space';
import { Shape2D } from '../components/shapes/Shape2D';
import { Shape } from '../components/shapes/Shape';
import { ShapeManager } from '../managers/ShapeManager';
import { SpaceService } from '../services/SpaceService';

/**
 * The publish variable lives in the class that will be publishing. Other classes that wish to subscribe must import this class.
 * Acts as the one class for all subscribers.
 * 
 * @export
 * @class RSJX
 */
export class Subscriptions {


  public static selectedObjectId: Observable<number> = SelectionManager.selectedObjectIdPub.asObservable(); // selected object id
  public static activeSpaceSelected: Observable<Space> = SpaceService.activeSpaceSelectedPub.asObservable(); // selected object id
  
  
  
  public static mouseClick: Observable<THREE.Vector3> = SelectionManager.mouseClickPub.asObservable();  // mouse down position
  
  // shape & mesh creation
  public static newShapeCreated: Observable<Shape> = ShapeManager.newShapeCreatedPub.asObservable(); // new shape
  public static shapeDeleted: Observable<Shape> = ShapeManager.shapeDeletedPub.asObservable(); // shape deleted
  public static newMeshCreated: Observable<THREE.Mesh> = ShapeManager.newMeshCreated.asObservable(); // new mesh
  public static meshDeleted: Observable<THREE.Mesh> = ShapeManager.meshDeleted.asObservable(); // mesh deleted
  
  // public static activeShapeSelected: Observable<Shape> = SceneManager.activeShapeSelectedPub.asObservable(); // selected shape
  
  public static rendererSetupComplete: Observable<HTMLElement> = RenderManager.rendererSetupComplete.asObservable();  // renderer parent dom
  public static debugSetupComplete: Observable<Debug> = Debug.debugSetupComplete.asObservable();  // debugger setup
  
  // TODO not in use
  public static createNewShape: Observable<Boolean> = UIManager.createNewShapePub.asObservable(); // create new shape
  public static createNewSpace: Observable<Space> = SpaceManager.newSpaceCreatedPub.asObservable(); // create new shape
  
  
}