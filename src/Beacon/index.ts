import { ContextMenu } from '..';
import { Select } from '../Select';
import { isEnvBrowser } from '../helpers';

export class Beacon<T extends HTMLElement> {
  #parentThis: ContextMenu<T>;
  #root?: Select;
  #beaconEvent = 'closecontextmenu';
  #resolver?: (value: boolean) => void;
  constructor(parentThis: ContextMenu<T>) {
    this.#parentThis = parentThis;
    if (isEnvBrowser()) {
      this.#root = new Select(document);
    }
  }

  emit(): void {
    if (this.#root) {
      this.#root.emit(this.#beaconEvent, this.#parentThis);
    }
  }

  #beaconListener = (e: Event): void => {
    const { args } = (e as CustomEvent).detail as { args: [ContextMenu<T>] };
    if (typeof this.#resolver === 'function') {
      this.#resolver(args[0] !== this.#parentThis);
    }
  };

  listen(resolve: (value: boolean) => void): void {
    this.#resolver = resolve;
    this.#root?.on(this.#beaconEvent, this.#beaconListener);
  }

  off(): void {
    this.#root?.off(this.#beaconEvent, this.#beaconListener);
    this.#resolver = undefined;
  }
}
