import { Slot } from '../components/Slot';
import { SelectionManager } from '../managers/SelectionManager';

export class SlotManager {

    private slots: Slot[] = [];

    constructor() {
      // SelectionManager.selectedObjectIdSub.subscribe((id) => {
      //   console.log(`selected id: ${id}`);
      // });
    }

    /**
     * add slots to array
     * 
     * @param {Slot} slot 
     * @memberof SlotManager
     */
    add(slot: Slot) {
        if (this.slots) {
            this.slots.push(slot);
        }
    }
}