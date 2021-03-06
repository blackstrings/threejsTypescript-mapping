import { Subscriptions } from '../events/Subscriptions';
import { ShapeManager } from '../managers/ShapeManager';
import { RenderManager } from '../managers/RenderManager';
import { SpaceManager } from '../managers/SpaceManager';
import { Shape2D } from '../components/shapes/Shape2D';
import { SpaceService } from './SpaceService';


export class Operation {

  constructor(private spaceService: SpaceService, private renderManager: RenderManager) {

  }
  
  public createSpace(): void {
    this.spaceService.createNewSpace();
  }

  public createShape(): void {
    //this.shapeManager.createShape();
    console.log('TODO');
  }

  public removeLastShape(): void {
    //this.shapeManager.removeLastShape();
    // TODO remove
    //this.renderManager.render();  // shold not need this
    console.log('TODO');
  }
  
  public removeActiveShape(): void {
    this.spaceService.removeActiveSpace();
  }

  /**
   * Allow custom draw to take place.
   * 
   * @memberof Operation
   */
  public enableCustomDraw(): void {
    this.spaceService.enableCustomSpace();
    console.log('TODO');
  }
  
  public enableShapeEdit(): void {
    //this.shapeManager.setShapeEdit(true);
    console.log('TODO');
  }
}