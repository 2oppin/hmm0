export class KeyboardHandler {
  private listenersDown: {[key: string]: (e: KeyboardEvent) => void} = {};
  private listenersUp: {[key: string]: (e: KeyboardEvent) => void} = {};
  private pressed: Set<string> = new Set();
  private downHandled: boolean = true;
  private toCleanup: {[key: string]: () => void} = null;
  constructor() {
    this.toCleanup = {
      keydown: this.handleKeyDown.bind(this),
      keyup: this.handleKeyUp.bind(this),
    }
    Object.entries(this.toCleanup).forEach(([event, cb]) =>
      document.addEventListener(event, cb)
    );
  }

  destroy() {
    Object.entries(this.toCleanup).forEach(([event, cb]) =>
      document.removeEventListener(event, cb)
    );
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.pressed.add(event.key);
    const combination = Array.from(this.pressed).sort().join("+");
    this.listenersDown[combination] && this.listenersDown[combination](event);
    this.downHandled = false;
  }

  private handleKeyUp(event: KeyboardEvent) {
    const combination = Array.from(this.pressed).sort().join("+");
    if (!this.downHandled && this.listenersUp[combination])
      this.listenersUp[combination](event);
    this.pressed.delete(event.key);
    this.downHandled = true;
  }

  listenToUp(key: string,  cb: (e: KeyboardEvent) => void) {
    this.listenersUp[key] = cb;
  }

  listenToDown(key: string,  cb: (e: KeyboardEvent) => void) {
    this.listenersDown[key] = cb;
  }
}
