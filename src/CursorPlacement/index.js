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
            left: `${this.getClientX(event)}px`,
            maxWidth: `${this.windowProps.width - 10}px`,
            maxHeight: `${this.windowProps.height - 10}px`,
            overflow: 'auto'
        });
    }
    /**
     * Returns context menu's approximate position on X axis
     * @param {Event} event Event object
     */
    getClientX(event) {
        const displacement = event.clientX + this.targetPlacement.width - this.windowProps.width;
        if (displacement > 0) {
            return event.clientX - displacement - 4;
        }
        return event.clientX;
    }
    /**
     * Returns context menu's approximate position on Y axis
     * @param {Event} event Event object
     */
    getClientY(event) {
        const displacement = event.clientY + this.targetPlacement.height - this.windowProps.height;
        if (displacement > 0) {
            return event.clientY - displacement - 4;
        }
        return event.clientY;
    }
}