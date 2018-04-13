import * as THREE from 'three';

export class VectorUtils {
  
  /**
   * Modifies the actual vector and rounds all xyz values to the fixed position.
   * By default, rounds each xyz two positions to the right of the decimal.
   * 
   * 
   * @static
   * @param {number} [fixedValue=2] the position after the decimal
   * @returns {THREE.Vector3} 
   * @memberof VectorUtils
   */
  public static toFixed(vector: THREE.Vector3, fixedValue: number = 2): THREE.Vector3 {
    if (vector) {
      vector.setX(parseFloat(vector.x.toFixed(fixedValue)));
      vector.setY(parseFloat(vector.y.toFixed(fixedValue)));
      vector.setZ(parseFloat(vector.z.toFixed(fixedValue)));
    } else {
      console.warn('toFixed failed, vector is null');
    }
    return vector;
  }
  
  public static convertVec3sToVec2s(vec3s: THREE.Vector3[]): THREE.Vector2[]{
    let vec2s: THREE.Vector2[] = null;

    if(vec3s){
      vec2s = [];
      vec3s.forEach((v) => {
        vec2s.push(new THREE.Vector2(v.x, v.y));
      });
    }

    return vec2s;
  }

  public static convertArrayToVec3s(points: Array<ArrayLike<number>>){
    let vec3s: THREE.Vector3[] = null;
    if(points){
      vec3s = [];
      points.forEach((point) => {
        vec3s.push(new THREE.Vector3(point[0], point[1], point[2]));
      });
    } else {
      throw new Error('cannot convert array to vector3s, vec3s is null');
    }
    return vec3s;
  }
  
  public static convertJsonArrayToVec3s(points: { x: number, y: number, z: number }[]): THREE.Vector3[] {
    const vec3s: THREE.Vector3[] = [];
    if (points) {
      points.forEach((point: { x: number, y: number, z: number }) => {
        vec3s.push(new THREE.Vector3(point.x, point.y, point.z));
      });
    }
    return vec3s;
  }
}