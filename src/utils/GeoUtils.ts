
export class GeoUtils {

  /**
   * FreezeTransformation only works on meshes that have been moved or rotated through applyMatrix().
   * Manipulating the mesh by setting position and rotation without using the matrix will not have desireable outcome with this method.
   *
   * Resets the objet3d's matrix to the unity value, but does not move the object3d from its currently location it is at.
   * Whether or not the mesh has modified position, rotation, or scale, keep the current state, but reset the values.
   *
   * It tells the mesh
   * - its current position becomes its origin, as if it has never been translated.
   * - its rotations are zeroed out, as if it has never been rotated.
   * - its scale is set to 1,1,1 as if it has never been scaled.
   *
   * For those that understand matrix, the mesh's matrix4 is reset to the matrix unity value.
   *
   * @memberof Mesh
   */
  public static freezeTransformation(object3d: THREE.Line | THREE.Mesh): void {
    object3d.geometry.applyMatrix(object3d.matrix);
    object3d.position.set(0, 0, 0);
    object3d.rotation.set(0, 0, 0);
    object3d.scale.set(1, 1, 1);
    object3d.updateMatrix();
  }
}