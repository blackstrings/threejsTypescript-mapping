import { Shape2D } from './shapes/Shape2D';

/**
 * Contains a shape2D and vendor.
 * 
 * @export
 * @class Space
 */
export class Space {

  // gets set on new space publicize through rxjs
  private shape: Shape2D = null;
  private vendorId: number = null;
  private label: string = 'NA'; // not available because not set

  constructor(shape: Shape2D, label?: string) {
    this.shape = shape;
    this.label = label;
  }
  
  public displayOpen(): void {
    if (this.shape) {
      //this.shape.open();
    }
  }

  /**
   * generated and set by uuid generator in shapeManager when shape is created through threejs
   * 
   * @returns {string} 
   * @memberof Space
   */
  public getUUID(): string {
    let uuid: string = null;
    if (this.shape) {
      uuid = this.shape.getUUID();
    }
    return uuid;
  }
  
  public getId(): number {
    let id: number = null;
    if (this.shape) {
      id = this.shape.getId();
    }
    return id;
  }

  public setVendorId(vendorId: number): void {
    this.vendorId = vendorId;
  }

  public getVendorId(): number {
    return this.vendorId;
  }
}