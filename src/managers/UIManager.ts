import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import { Panel } from '../UI/htmlProxys/Panel';
import { Button } from '../UI/htmlProxys/Button';
import { Subscriptions } from '../events/Subscriptions';
import { Operation } from '../services/Operation';
import { Space } from '../components/Space';

/**
 * Handles the button GUI for interacting with the canvas.
 * 
 * @export
 * @class UIManager
 */
export class UIManager {
  
  private readonly topPanelId: string = 'topPanel';
  private readonly displayPanelId: string = 'displayPanel';

  private panels: Panel[] = [];
  private dom: HTMLElement = null;

  public static createNewShapePub: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);


  constructor(uiDom: HTMLElement, private operation: Operation) {
    if (uiDom) {
      this.dom = document.createElement('div');
      this.dom.className = 'uiMain';
      uiDom.appendChild(this.dom);
      this.init();
      console.log('<< UIManager >> init completed');
    } else {
      throw new Error('UIManager failed to create, rootDom is null');
    }

    // subs
    Subscriptions.activeSpaceSelected.subscribe((space: Space) => {
      this.displaySpaceInfo(space);
    });

  }

  private init(): void {

    this.initEditPanel();
    this.initDisplayPanel();

  }

  /**
   * Reads out the space info into the UI
   * 
   * @param {Space} space 
   * @memberof UIManager
   */
  public displaySpaceInfo(space: Space): void {
    if (this.panels) {
      const displayPanel: Panel = this.panels.filter(panel => panel.panelId === this.displayPanelId)[0];
      
      if (displayPanel) {
        displayPanel.dom.innerHTML = space.toString();
      } else {
        console.warn('Failed to display space info, displayPanel is null or was not found');
        displayPanel.dom.innerHTML = 'n/a';
      }
    }
  }

  public addPanel(panel: Panel): void {
    if (this.panels) {
      this.panels.push(panel);
      this.dom.appendChild(panel.dom);
    } else {
      console.error('failed to add panel, panels is null');
    }
  }

  public removePanel(panel: Panel): void {
    if (this.panels) {
      const index: number = this.panels.indexOf(panel);
      if (index >= 0) {
        const panelToRemove: Panel = this.panels.splice(index, 1)[0];
        this.dom.removeChild(panelToRemove.dom);
        console.log('panel removed successfully');
      }
    } else {
      console.error('failed to remove panel, panel is null');
    }
  }

  private initDisplayPanel(): void {
    // panel
    const panel: Panel = new Panel('displayPanel', this.displayPanelId);
    this.addPanel(panel);
  }

  private initEditPanel(): void {
    // panel
    const panel: Panel = new Panel('topPanel', this.topPanelId);
    this.addPanel(panel);

    // button
    let btn: Button = new Button('btn', 'New Shape');
    panel.add(btn);
    btn.dom.addEventListener('click', () => {
      this.operation.createShape();
    });

    btn = new Button('btn', 'Remove Last Shape');
    panel.add(btn);
    btn.dom.addEventListener('click', () => {
      this.operation.removeLastShape();
    });

    btn = new Button('btn', 'Draw Custom Shape');
    panel.add(btn);
    btn.dom.addEventListener('click', () => {
      this.operation.enableCustomDraw();
    });

    btn = new Button('btn', 'Edit');
    panel.add(btn);
    btn.dom.addEventListener('click', () => {
      this.operation.enableShapeEdit();
    });

    btn = new Button('btn', 'Remove Active Shape');
    panel.add(btn);
    btn.dom.addEventListener('click', () => {
      this.operation.removeActiveShape();
    });

    btn = new Button('btn', 'New Space');
    panel.add(btn);
    btn.dom.addEventListener('click', () => {
      this.operation.createSpace();
    });

  }

}