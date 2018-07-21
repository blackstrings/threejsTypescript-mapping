import { SpaceManager } from '../managers/SpaceManager';
import { ShapeManager } from '../managers/ShapeManager';
import { SceneManager } from '../managers/SceneManager';
import { Space } from '../components/Space';
import { Shape2D } from '../components/shapes/Shape2D';

/**
 * Handles getting shape into space and into the 3d scene
 */
export class SpaceBuilder {
  
  constructor(private spaceManager: SpaceManager, private shapeManager: ShapeManager, private sceneManager: SceneManager){
    
  }

  public create() {
    const shape: Shape2D = this.shapeManager.createShape();
    const space: Space = this.spaceManager.create(shape);
    this.sceneManager.addToScene(shape);
  }
  
  
}