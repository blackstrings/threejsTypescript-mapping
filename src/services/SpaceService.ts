import { SpaceBuilder } from '../builders/SpaceBuilder';
import { SpaceManager } from '../managers/SpaceManager';
import { ShapeManager } from '../managers/ShapeManager';
import { SceneManager } from '../managers/SceneManager';
import { Space } from '../components/Space';
import { Subscriptions } from '../events/Subscriptions';
import { Debug } from '../utils/Debug';
import { ReplaySubject } from 'rxjs/ReplaySubject';


export class SpaceService {
  
  private debug: Debug = null;
  
  public static activeSpaceSelectedPub: ReplaySubject<Space> = new ReplaySubject<Space>(1);

  private spaceBuilder: SpaceBuilder = null;
  private activeSpace: Space = null;

  constructor(private spaceManager: SpaceManager, private shapeManager: ShapeManager, private sceneManager: SceneManager) {
    this.spaceBuilder = new SpaceBuilder(spaceManager, shapeManager, sceneManager);
    
    // subscriptions
    Subscriptions.debugSetupComplete.subscribe((debug: Debug) => {
      this.debug = debug;
    });
    
    // select the active space when the shape is selected
    Subscriptions.selectedObjectId.subscribe((meshId: number) => {
      if (meshId) {
        this.activeSpace = this.spaceManager.getSapceById(meshId);

        if (this.debug && this.debug.enabled && this.debug.selectedSpaceLog) {
          console.log('<< SpaceService >> selected space is:');
          console.log(this.activeSpace);
        }
        
        // publish
        SpaceService.activeSpaceSelectedPub.next(this.activeSpace);
      }
    });
    
  }

  public createNewSpace(): void {
    this.spaceBuilder.create();
  }
  
  public removeActiveSpace(): void {
    if (this.activeSpace) {
      this.removeCompletely(this.activeSpace);
    } else {
      console.warn('Failed to remove active space, activeSpace is null');
    }
  }
  
  public removeSpaceOnly(space: Space): void {
    if (this.spaceManager) {
      this.spaceManager.remove(space);
    }
  }
  
  public freeUpSpace(space: Space): void {
    this.spaceManager.freeUpSpace(space);
  }
  
  public closeUpSpace(space: Space, vendorId: number): void {
    this.spaceManager.closeUpSpace(space, vendorId);
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