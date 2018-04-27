import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import { Panel } from '../UI/Panel';
import { Button } from '../UI/Button';
import { Subscriptions } from '../events/Subscriptions';
import { Operation } from '../services/Operation';

/**
 * Handles the button GUI for interacting with the canvas.
 * 
 * @export
 * @class UIManager
 */
export class UIManager {

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

  }

  private init(): void {
    // panel
    const panel: Panel = new Panel('topPanel');
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

}