import * as THREE from 'three';
import { Colors } from './Colors';
import { AttributeType } from '../components/AttributeType';

/**
 * Passed into any shape that needs to reference shared materials
 * 
 * @export
 * @class MaterialLibrary
 */
export class MaterialLibrary {

  private materials: Map<AttributeType, THREE.Material> = new Map<AttributeType, THREE.Material>();

  constructor() {
    this.init();
  }
  
  public get(attributeType: AttributeType): THREE.Material {
    let mat: THREE.Material = null;
    if (this.materials && this.materials.has(attributeType)) {
      mat = this.materials.get(attributeType);
    } else {
      console.warn('Failed to get material, materials is null or does not have attributeType');
    }
    return mat;
  }

  private init() {

    const clearMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0
    });
    this.add(clearMat, AttributeType.GENERIC_CLEAR);

    // space open
    const spaceOpenMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: Colors.RED.value(),
      transparent: true,
      opacity: .3
    });
    this.add(spaceOpenMat, AttributeType.SPACE_OPEN);

    // space close
    const spaceCloseMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: Colors.RED.value()
    });
    this.add(spaceCloseMat, AttributeType.SPACE_CLOSE, );

  }

  private add(mat: THREE.Material, attr: AttributeType): void {
    mat.name = attr.toString();
    this.materials.set(attr, mat);
  }
}