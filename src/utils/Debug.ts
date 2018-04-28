import { ReplaySubject } from 'rxjs/ReplaySubject';
export class Debug {

  public static debugSetupComplete: ReplaySubject<Debug> = new ReplaySubject<Debug>(1);

  /**
   * The prefix message for the console
   * 
   * @private
   * @type {string}
   * @memberof Debug
   */
  public message: string = 'Debug On: ';

  public forceEnableCameraRotation: boolean = false;  // All active cameras will have rotation enabeled
  public mouseMoveLog: boolean = false;               // Mouse will log all movements
  public selectedShapeForMoveLog: boolean = false;            // Movement manager will log selected shape
  public selectedSpaceLog: boolean = true;            // log the space selected
  public showShapePosition: boolean = false;

  constructor(public enabled: boolean = false, message?: string) {
    if (message) {
      this.message = message;
    }
  }

  public init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Debug.debugSetupComplete.next(this);
      resolve(true);
    });

  }


}