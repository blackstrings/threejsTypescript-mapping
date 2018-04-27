import { Vendor } from '../components/Vendor';
import { SpaceManager } from './SpaceManager';
import { Subscriptions } from '../events/Subscriptions';
import { Space } from '../components/Space';

/**
 * Managees vendor infors.
 * 
 * @export
 * @class VendorManager
 */
export class VendorManager {

  private vendors: Vendor[] = [];

  /**
   * Should be set in the db and the value is derived from there.
   * 
   * @private
   * @type {number}
   * @memberof VendorManager
   */
  private id: number = null;

  constructor() {

  }

  /**
   * add slots to array
   * 
   * @param {Vendor} slot 
   * @memberof VendorManager
   */
  private add(vendor: Vendor) {
    if (this.vendors) {
      this.vendors.push(vendor);
    }
  }

  public remove(vendor: Vendor): Vendor {
    let vendorRemoved: Vendor = null;
    if (this.vendors && this.vendors.length) {
      const index: number = this.vendors.indexOf(vendor);
      if (index >= 0) {
        vendorRemoved = this.vendors.splice(index, 1)[0];
      } else {
        console.warn('Failed to remove vendor, vendor not found in array');
      }
    } else {
      console.warn('Failed to remove vendor, vendors is null or empty');
    }
    return vendorRemoved;
  }

  private create(id: number, businessName: string): Vendor {
    const vendor: Vendor = new Vendor(id, businessName);
    this.add(vendor);
    return vendor;
  }

}