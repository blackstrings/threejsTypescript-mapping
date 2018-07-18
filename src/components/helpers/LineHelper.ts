import * as THREE from "three";

export class LineHelper {

  public mesh3D: THREE.Line;

  private MAX_POINTS: number;
  private positions: Float32Array;

  /**
   * What vertice index we are on in the positions float32 array
   */
  private count: number = 0;

  /**
   * A dynamic line that can grow in points. A regular line cannot grow in points and can only update the starting points.
   * This is a buffer line that sets a max buffer of vertices. Once the max is reached, the line will error out.
   * @param maxPoints the maximum number of vertices this line can have.
   */
  constructor(maxPoints){
    // const lineGeo: THREE.Geometry = new THREE.Geometry();
    this.MAX_POINTS = maxPoints > 0 || maxPoints < 1000 ? maxPoints : 500;  // set min of 1 max of 999 points
    this.positions = new Float32Array(this.MAX_POINTS * 3);

    // buffer geometry so can add points
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    this.mesh3D = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xff0000}));
  }

  public addPoint(point: THREE.Vector3): void {
    if (point && this.mesh3D && this.mesh3D.geometry instanceof THREE.BufferGeometry) {
      // console.log("point nr " + count + ": " + mouse.x + " " + mouse.y + " " + mouse.z);
      this.positions[this.count * 3 + 0] = point.x;
      this.positions[this.count * 3 + 1] = point.y;
      this.positions[this.count * 3 + 2] = point.z;
      this.count++;
      this.mesh3D.geometry.setDrawRange(0, this.count);
      this.update(point);
    } else {
      throw new Error('<< LineHelper >> point, mesh3d, or geometry is null');
    }
  }

  public update(currentMousePoint?: THREE.Vector3): void {
    if (this.mesh3D && this.mesh3D.geometry instanceof THREE.BufferGeometry) {

      if(currentMousePoint){
        this.positions[this.count * 3 - 3] = currentMousePoint.x;
        this.positions[this.count * 3 - 2] = currentMousePoint.y;
        this.positions[this.count * 3 - 1] = currentMousePoint.z;
      }

      // run regardless if point was passed in
      if(this.mesh3D.geometry.attributes){
        const position: THREE.BufferAttribute = this.mesh3D.geometry.attributes['position'];
        position.needsUpdate = true;
      }
    }
  }

  /**
   * reset the line.
   * All float32 items are reset to zero values. Do not change the buffer size.
   */
  public reset(): void {
    if (this.mesh3D && this.mesh3D.geometry instanceof THREE.BufferGeometry && this.mesh3D.geometry.attributes){
        for(let i = 0; i<this.positions.length; i++){
          this.positions[i] = 0;
        }

        const positionArray: THREE.BufferAttribute = this.mesh3D.geometry.attributes['position'];
        if (positionArray) {
          positionArray.needsUpdate = true;
        }

        this.count = 0;
        this.update();
    }
  }
}