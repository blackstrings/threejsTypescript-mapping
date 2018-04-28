import { Button } from './Button';
import { HTMLProxy } from './HTMLProxy';

export class Panel extends HTMLProxy {
  
  public buttons: HTMLProxy[] = [];
  public panelId: string;

  constructor(public className: string, public idName: string) {
    super();
    this.dom = document.createElement('div');
    this.dom.className = className;
    this.dom.id = idName;
    this.panelId = idName;
  }
  
  add(htmlProxy: HTMLProxy): void {
    this.buttons.push(htmlProxy);
    this.dom.appendChild(htmlProxy.dom);
  }

}