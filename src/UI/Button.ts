export class Button {
  
  public dom: HTMLElement;
  constructor(className: string, buttonText: string) {
    this.dom = document.createElement('button');
    this.dom.className = className;
    this.dom.innerHTML = buttonText;
  }
  
  public setClassName(name: string): void {
    if (this.dom) {
      this.dom.className = name;
    }
  }
  
  public updateText(newText: string): void {
    this.dom.innerHTML = newText;
  }
}