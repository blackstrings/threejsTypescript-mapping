import { Observable } from 'rxjs/Observable';

import { SelectionManager } from '../managers/SelectionManager';
import { RenderManager } from '../managers/RenderManager';
import { Debug } from '../utils/Debug';
import { UIManager } from '../managers/UIManager';

/**
 * The publish variable lives in the class that will be publishing. Other classes that wish to subscribe must import this class.
 * Acts as the one class for all subscribers.
 * 
 * @export
 * @class RSJX
 */
export class Subscriptions {


  public static selectedObjectId: Observable<number> = SelectionManager.selectedObjectIdPub.asObservable(); // selected object id
  
  public static mouseClick: Observable<THREE.Vector3> = SelectionManager.mouseClickPub.asObservable();  // mouse down position
  
  
  public static rendererSetupComplete: Observable<HTMLElement> = RenderManager.rendererSetupComplete.asObservable();  // renderer parent dom
  public static debugSetupComplete: Observable<Debug> = Debug.debugSetupComplete.asObservable();  // debugger setup
  
  public static createNewShape: Observable<Boolean> = UIManager.createNewShapePub.asObservable(); // create new shape
}