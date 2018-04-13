import { Subscriptions } from '../events/Subscriptions';
import { SceneManager } from '../managers/SceneManager';
import { RenderManager } from '../managers/RenderManager';


export class Operation {

  constructor(private sceneManager: SceneManager, private renderManager: RenderManager) {

  }

  public createShape(): void {
    this.sceneManager.createShape();
  }

  public removeLastShape(): void {
    this.sceneManager.removeLastShape();
    //this.renderManager.render();  // shold not need this
  }
  
  public removeActiveShape(): void {
    this.sceneManager.removeActiveShape();
  }

  /**
   * Allow custom draw to take place.
   * 
   * @memberof Operation
   */
  public enableCustomDraw(): void {
    this.sceneManager.setCustomDraw(true);
  }
  
  public enableShapeEdit(): void {
    this.sceneManager.setShapeEdit(true);
  }
}