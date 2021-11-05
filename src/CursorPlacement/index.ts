import { Select, HTMLSelector } from '../Select';

export class CursorPlacement {
  target: Select;
  targetPlacement: DOMRect | null;
  windowProps: {
    width: number;
    height: number;
  };
  constructor(event: MouseEvent, element: HTMLSelector) {
    const win = (typeof document !== 'undefined' && document.defaultView) || {
      innerWidth: 0,
      innerHeight: 0,
    };
    this.target = new Select(element);
    this.targetPlacement = this.target.bounds()[0];
    this.windowProps = {
      width: win.innerWidth,
      height: win.innerHeight,
    };
    this.target.setCSSProps({
      position: 'fixed',
      top: `${this.getClientY(event)}px`,
      left: `${this.getClientX(event)}px`,
      maxWidth: `${this.windowProps.width - 10}px`,
      maxHeight: `${this.windowProps.height - 10}px`,
      overflow: 'auto',
    });
  }
  /**
   * Returns context menu's approximate position on X axis
   * @param {Event} event Event object
   */
  getClientX(event: MouseEvent): number {
    if (this.targetPlacement) {
      const displacement =
        event.clientX + this.targetPlacement.width - this.windowProps.width;
      if (displacement > 0) {
        return event.clientX - displacement - 4;
      }
    }
    return event.clientX;
  }
  /**
   * Returns context menu's approximate position on Y axis
   * @param {Event} event Event object
   */
  getClientY(event: MouseEvent): number {
    if (this.targetPlacement) {
      const displacement =
        event.clientY + this.targetPlacement.height - this.windowProps.height;
      if (displacement > 0) {
        return event.clientY - displacement - 4;
      }
    }
    return event.clientY;
  }
}
