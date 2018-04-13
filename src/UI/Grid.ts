import * as THREE from 'three';

/**
 * This is a wrapper class around the actual THREE.GridHelper class.
 * Reason so is to make the grid more friendlier to setup. Contraints are put into place for easier use.
 * Otherwise if you wish to use the Three.GridHelper directly feel free.
 */
export class Grid {

  /**
   * The grid, once it is created.
   * 
   * @type {THREE.GridHelper}
   * @memberof Grid
   */
  public mesh: THREE.GridHelper;

  /**
   * The grid is contructed to work off inches as the smallest unit.
   * It interprets 1 square = 1 feet = 12 inches.
   * Should you want 1 square to represent 2ft or 4ft, pass in 2 or 4 or a # multiple of 4.
   * @param gridOrientation 'front' or 'top' - the grid can be facing front to back or from top to bottom
   * @param sizeInFeet      multiples of 4 only and has to be >= 16
   * @param gridSpacing     optional with default as 1 space = 1 feet. Use even numbers >= 2.
   */
  constructor(public gridOrientation: string, private sizeInFeet: number, private gridSpacing?: number) {
    if (!this.mesh) {

      // 16 is the loweset it can go anything higher must be multiples of 4
      // this prevention allows for grid to have center line exactly in the middle
      let gridSizeInFeet = (sizeInFeet >= 16) && (sizeInFeet % 4 === 0) ? sizeInFeet : 16;  // only do powers of 4??? 4, 16, 32, etc...
      let centerLineColor = 0xff0000; //Utils.getColor('red');
      let gridLineColor = 0xffffff; //Utils.getColor('white');

      // represents the length and width of the overall grid size
      let gridSizeInInch = gridSizeInFeet * 12; //Utils.feetToInches(gridSizeInFeet);

      let division = gridSizeInInch / 12; // every 12 inch is a line
      // if custom spacing is provided
      if (gridSpacing != null) {
        // multiples of 2 only or defaults to no custom spacing
        division /= (gridSpacing >= 2 && gridSpacing % 2 === 0) ? gridSpacing : 1;
      }

      this.createGrid(gridOrientation, gridSizeInInch, division, centerLineColor, gridLineColor);
    } else {
      this.mesh.visible = true;
      // Utils.rotateMesh(grid, 90, 90, 0);
    }
  }

  show(): void {
    if (this.mesh) {
      this.mesh.visible = true;
    }
  }

  hide(): void {
    if (this.mesh) {
      this.mesh.visible = false;
    }
  }

  /**
   * creates the grid
   * @param {string} axis            default is top : top or front
   * @param {number} gridSizeInInch  size in inch
   * @param {number} lines           the number of dvisions
   * @param {number} centerLineColor hex number
   * @param {number} gridColor       hex number
   */
  private createGrid(axis: string, gridSizeInInch: number, division: number, centerLineColor: number, gridColor: number): void {
    if (gridSizeInInch && division) {

      let grid: THREE.GridHelper;
      
      // top - no rotation needed - default
      grid = new THREE.GridHelper(gridSizeInInch, division, centerLineColor, gridColor);

      // grid xz
      if (axis === 'front') {
        // grid yx - no rotation needed
        grid.rotateX(THREE.Math.degToRad(90));
      } else {
        console.warn('Grid defaulting to "Top", grid axis does not support value of: ' + axis);
      }
      console.log('Grid is facing: ' + axis);
      this.mesh = grid;
    } else {
      console.warn('Params req. not met. Grid failed to be added');
    }
  }
}