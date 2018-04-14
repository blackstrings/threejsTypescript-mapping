import { Shape2D } from './shapes/Shape2D';
import { Vendor } from './Vendor';

/**
 * Contains a shape2D and vendor.
 * 
 * @export
 * @class Space
 */
export class Space {

    private shape: Shape2D;
    private vender: Vendor;
    private label: string = 'n/a';

    constructor(shape: Shape2D){
        this.shape = shape;
        this.validate();
    }

    private validate(): void {
        if(!this.shape){ throw new Error('shape is not set or null');}
    }

    public setShape(shape): void {
        this.shape = shape;
    }

    public setVendor(vendor: Vendor): void {
        this.vender = vendor;
    }
}