import { SpaceManager } from '../managers/SpaceManager';
import { ShapeManager } from '../managers/ShapeManager';
import { SceneManager } from '../managers/SceneManager';
import { Space } from '../components/Space';
import { Shape2D } from '../components/shapes/Shape2D';


export class SpaceBuilder {
  
  constructor(private spaceManager: SpaceManager, private shapeManager: ShapeManager, private sceneManager: SceneManager){
    
  }

  create() {
    const shape: Shape2D = this.shapeManager.createShape();
    const space: Space = this.spaceManager.create(shape);
    this.sceneManager.addToScene(shape);
  }
  
  
}