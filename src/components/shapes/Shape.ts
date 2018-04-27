import * as THREE from 'three';

export abstract class Shape {
  protected uuid: string;
  protected id: number;
  public abstract mesh: THREE.Mesh;
  
  public getUUID(): string {
    return this.uuid;
  }
  
  public getId(): number {
    return this.id;
  }
}