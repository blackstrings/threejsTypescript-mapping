import * as THREE from 'three';

import { VectorUtils } from '../../utils/VectorUtils';
import { Shape } from '../shapes/Shape';

/**
 * Contains thet shape information such as position and shape vertices for 2d
 * 
 * @export
 * @class Shape
 */
export class Shape2D extends Shape {

  /**
   * contains 2d points
   * 
   * @type {THREE.Vector3[]}
   * @memberof Shape2D
   */
  private points: THREE.Vector3[] = [];

  public mesh: THREE.Mesh = null;

  constructor(points: THREE.Vector3[]) {
    super();
    try {
      this.points = points;
      this.create();
    } catch (e) {
      throw e;
    }
  }

  /**
   * Return clone versions of the points array, not the actual references
   * 
   * @returns {THREE.Vector3[]} 
   * @memberof Shape2D
   */
  public getPoints(): THREE.Vector3[] {
    if (this.points) {
      const clonedPoints: THREE.Vector3[] = [];
      this.points.forEach((point: THREE.Vector3) => {
        clonedPoints.push(point.clone());
      });
      return clonedPoints;
    }
  }

  /**
   * Creates the shape2d mesh and returns it based on this.points
   * 
   * @private
   * @memberof Shape
   */
  private create(): THREE.Mesh {
    if (this.points) {
      const vec2s: THREE.Vector2[] = VectorUtils.convertVec3sToVec2s(this.points);  // from 3d to 2d points
      const shape: THREE.Shape = new THREE.Shape(vec2s);
      const shapeGeo: THREE.ShapeGeometry = new THREE.ShapeGeometry(shape);
      this.mesh = new THREE.Mesh(shapeGeo, new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));
      this.mesh.name = 'shape'; // has to be a valid name for the selection manager to filter the geometry during mouse down to make it selectable
      this.uuid = this.mesh.uuid;
      this.id = this.mesh.id;
    } else {
      throw new Error('<< Shape >> mesh2D is null');
    }
    return this.mesh;
  }


}