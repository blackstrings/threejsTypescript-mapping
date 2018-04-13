import { Button } from './Button';

export class Panel {
  
  public buttons: Button[] = [];
  
  public dom: HTMLElement;

  constructor(public className: string) {
    this.dom = document.createElement('div');
    this.dom.className = className;
  }
  
  add(button: Button): void {
    this.buttons.push(button);
    this.dom.appendChild(button.dom);
  }
}