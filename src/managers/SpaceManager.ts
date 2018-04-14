import { Space } from '../components/Space';
import { SelectionManager } from '../managers/SelectionManager';
import { Shape2D } from '../components/shapes/Shape2D';

/**
 * Managees spaces.
 * 
 * @export
 * @class SpaceManager
 */
export class SpaceManager {

  private spaces: Space[] = [];

  constructor() {
    // SelectionManager.selectedObjectIdSub.subscribe((id) => {
    //   console.log(`selected id: ${id}`);
    // });
  }

  /**
   * add slots to array
   * 
   * @param {Space} slot 
   * @memberof SlotManager
   */
  private add(slot: Space) {
    if (this.spaces) {
      this.spaces.push(slot);
    }
  }

  private create(): void {
    //const shape2D: Shape2D = new Shape2D();
    //const space: Space = new Space(shape2D);
  }
}