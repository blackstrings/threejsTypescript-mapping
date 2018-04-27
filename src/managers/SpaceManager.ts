import { Space } from '../components/Space';
import { SelectionManager } from '../managers/SelectionManager';
import { Shape2D } from '../components/shapes/Shape2D';
import { Vendor } from '../components/Vendor';
import { SceneManager } from './SceneManager';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscriptions } from '../events/Subscriptions';
import { Shape } from '../components/shapes/Shape';
import { VendorManager } from './VendorManager';

/**
 * Managees spaces.
 * 
 * @export
 * @class SpaceManager
 */
export class SpaceManager {

  public static newSpaceCreatedPub: ReplaySubject<Space> = new ReplaySubject<Space>(1);

  private spaces: Space[] = [];

  private activeSpace: Space = null;

  // incremental id generator per new space, not be be relied on, on design reloads as can change over different sessions.
  private index: number = 1;

  constructor() {
    
    // select the active space when the shape is selected
    // Subscriptions.activeShapeSelected.subscribe((shape: Shape) => {
    //   if (shape instanceof Shape2D) {
    //     this.activeSpace = this.getSpaceByUUID(shape.getUUID());
    //     console.log(this.activeSpace);
    //   }
    // });
  }
  
  private getSpaceByUUID(uuid: string): Space {
    let space: Space = null;
    if (this.spaces && this.spaces.length) {
      space = this.spaces.filter((space) => space.getUUID() === uuid)[0];
      if (!space) {
        console.warn('Failed to get space by uuid, no match found, returnign null');
      }
    } else {
      console.warn('Failed to get space by uuid, spaces is null or empty, returning null');
    }
    return space;
  }

  /**
   * add space into the array
   * 
   * @param {Space} space 
   * @memberof SlotManager
   */
  private add(space: Space): void {
    if (this.spaces) {
      this.spaces.push(space);
    }
  }
  
  public remove(space: Space): Space {
    let spaceRemoved: Space = null;
    if (this.spaces && this.spaces.length) {
      const index: number = this.spaces.indexOf(space);
      if (index >= 0) {
        spaceRemoved = this.spaces.splice(index, 1)[0];
      } else {
        console.warn('Failed to remove space, space not found in array');
      }
    } else {
      console.warn('Failed to remove space, spaces is null or empty');
    }
    return spaceRemoved;
  }

  /**
   * Creates a new spaces and publicizes space, so proper properties can get set by other managers who listen.
   * 
   * Currently, vendorManager and sceneManager.
   * 
   * @memberof SpaceManager
   */
  public create(shape: Shape2D): Space {
    const space: Space = new Space(shape, 'testB');
    this.index++; // for next space

    this.add(space);
    return space;
    //SpaceManager.newSpaceCreatedPub.next(space);
  }
}