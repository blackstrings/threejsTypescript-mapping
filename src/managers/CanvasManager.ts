import * as THREE from 'three';

/**
 * Contains the dom element for which the renderer.dom (canvas will be put into).
 * 
 * Also the layout of where the UI panels will be put into
 * 
 * @export
 * @class CanvasManager
 */
export class CanvasManager {

  // public dom: HTMLElement;  // the dom which the renderer.domElement will be put into
  private rootDom: HTMLElement; // the container that holds the dom and the panel that contains UI buttons
  
  /**
   * Houses the renderer domElement
   * 
   * @type {HTMLElement}
   * @memberof CanvasManager
   */
  public rendererDomParent: HTMLElement;

  /**
   * Creates an instance of CanvasManager.
   * @param {HTMLElement} rootDom the root dom that will house the application
   * @memberof CanvasManager
   */
  constructor(rootDom: HTMLElement) {
    this.rootDom = rootDom;

    // this.dom = dom;

    // todo see if we can dump stuff into a generic root dom
    this.rendererDomParent = document.createElement('div');
    this.rootDom.appendChild(this.rendererDomParent);
    // this.dom.className = 'canvasContainer';
    this.updateSize();

    // this.validate();
  }
  
  public updateSize(): void {
    this.rendererDomParent.style['width'] = this.rootDom.offsetWidth + 'px';
    this.rendererDomParent.style['height'] = this.rootDom.offsetHeight + 'px';
  }

  private validate(): void {
    let result: boolean = true;
    result = this.rootDom ? true : false;
    if (result) { result = this.rendererDomParent ? true : false; }

    if (!result) {
      throw new Error('CanvasManager failed to validate');
    }
  }

  /**
   * Returns the current dom width.
   * 
   * Used for calculating camera aspect ratio.
   * 
   * @returns {number} 
   * @memberof CanvasManager
   */
  public getWidth(): number {
    if (this.rendererDomParent) {
      return this.rendererDomParent.offsetWidth;
    } else {
      console.warn('Failed to get width, dom is null');
      return null;
    }
  }

  /**
   * Returns the dom height.
   * 
   * Used for calculating camera aspect ratio
   * 
   * @returns {number} 
   * @memberof CanvasManager
   */
  public getHeight(): number {
    if (this.rendererDomParent) {
      return this.rendererDomParent.offsetHeight;
    } else {
      console.warn('Failed to get height, dom is null');
      return null;
    }
  }


}