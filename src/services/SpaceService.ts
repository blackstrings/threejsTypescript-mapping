import { SpaceBuilder } from '../builders/SpaceBuilder';
import { SpaceManager } from '../managers/SpaceManager';
import { ShapeManager } from '../managers/ShapeManager';
import { SceneManager } from '../managers/SceneManager';
import { Space } from '../components/Space';


export class SpaceService {

  private spaceBuilder: SpaceBuilder = null;

  constructor(private spaceManager: SpaceManager, private shapeManager: ShapeManager, private sceneManager: SceneManager) {
    this.spaceBuilder = new SpaceBuilder(spaceManager, shapeManager, sceneManager);
  }

  public createNewSpace(): void {
    this.spaceBuilder.create();
  }
  
  public removeSpaceOnly(space: Space): void {
    if (this.spaceManager) {
      this.spaceManager.remove(space);
    }
  }

  /**
   * Removes the space and its assocatied shape and mesh from the scene.
   * 
   * @param {Space} space 
   * @memberof SpaceService
   */
  public removeCompletely(space: Space): void {
    const shapeId: number = space.getId();
    const shapeUUID: string = space.getUUID();
    if (shapeUUID != null && shapeId != null) {
      if (this.sceneManager.removeFromSceneById(shapeId)) {
        this.shapeManager.removeByUUID(shapeUUID)
        this.removeSpaceOnly(space);
      }
    } else {
      console.warn('Failed to remove space, shapeId is null');
    }
  }

}