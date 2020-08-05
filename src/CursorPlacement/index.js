import { Select } from '../Select';

export class CursorPlacement {
    constructor(event, element) {
        this.target = new Select(element);
        this.targetPlacement = this.target.bounds()[0];
        this.windowProps = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.target.setCSSProps({
            position: 'fixed',
            top: `${this.getClientY(event)}px`,
            left: `${this.getClientX(event)}px`
        });
    }
    /**
     * Returns context menu's approximate position on X axis
     * @param {Event} event Event object
     */
    getClientX(event) {
        if (event.clientX + this.targetPlacement.width > this.windowProps.width) {
            return event.clientX - this.targetPlacement.width;
        }
        return event.clientX;
    }
    /**
     * Returns context menu's approximate position on Y axis
     * @param {Event} event Event object
     */
    getClientY(event) {
        if (event.clientY + this.targetPlacement.height > this.windowProps.height) {
            return event.clientY - this.targetPlacement.height;
        }
        return event.clientY;
    }
}