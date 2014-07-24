module tevents {

  export var CAPTURE_PHASE:number = 1;
  export var TARGET_PHASE:number = 2;
  export var BUBBLING_PHASE:number = 3;

  export class Event {
    public currentTarget:Dispatcher;
    public target:Dispatcher;
    public phase:number;
    public isPropagationStopped:boolean;

    constructor(private _type:string, public bubble:boolean = false) {
      this.isPropagationStopped = false;
    }

    public stopPropagation():void {
      this.isPropagationStopped = true;
    }

    public get type():string {
      return this._type;
    }
  }

  export class DataEvent extends Event {
    constructor(type:string, public data:any) {
      super(type);
    }
  }

  export class PropertyChangeEvent extends Event {
    constructor(public propertyName:string = '', public oldValue?:any, public newValue?:any) {
      super('propertyChange');
    }
  }

  export interface IHandlerFunction {
    (event:Event):void;
  }

  class Handler {
    constructor(public handlerFunction:IHandlerFunction, public useCapture:boolean, public once:boolean = false) {

    }
  }

  export class Dispatcher {
    private listeners:{[index:string]:Handler[]};
    public parent:Dispatcher;

    constructor() {
      this.listeners = {};
    }

    private initHandlersForType(eventType:string):void {
      if (!this.listeners[eventType]) {
        this.listeners[eventType] = [];
      }
    }

    private indexOfEventHandler(eventType:string, func:IHandlerFunction):number {
      var listeners:Handler[] = this.listeners[eventType];

      if (!listeners) {
        return -1;
      }

      for (var i:number = 0; i < listeners.length; i += 1) {
        if (listeners[i].handlerFunction === func) {
          return i;
        }
      }

      return -1;
    }

    public on(eventType:string, func:IHandlerFunction, useCapture:boolean = false):Dispatcher {
      this.initHandlersForType(eventType);
      this.listeners[eventType].push(new Handler(func, useCapture, false));
      return this;
    }

    public once(eventType:string, func:IHandlerFunction, useCapture:boolean = false):Dispatcher {
      this.initHandlersForType(eventType);
      this.listeners[eventType].push(new Handler(func, useCapture, true));
      return this;
    }

    public removeEventListener(eventType:string, func:IHandlerFunction):Dispatcher {
      var index:number = this.indexOfEventHandler(eventType, func);

      if (index !== -1) {
        this.listeners[eventType].splice(index, 1);
      }

      return this;
    }

    public hasEventListener(eventType) {
      return this.listeners[eventType] !== undefined && this.listeners[eventType].length > 0;
    }

    private callListeners(event:Event):void {
      if (event.currentTarget.hasEventListener(event.type)) {
        event.currentTarget.listeners[event.type].forEach((handler:Handler) => {
          if (handler.useCapture && event.phase !== CAPTURE_PHASE) {
            return;
          }
          if (!handler.useCapture && event.phase === CAPTURE_PHASE) {
            return;
          }
          handler.handlerFunction.call(event.currentTarget, event);
          if (handler.once) {
            event.currentTarget.removeEventListener(event.type, handler.handlerFunction);
          }
        });
      }
    }

    private static findParents(target:Dispatcher):Dispatcher[] {
      var parents:Dispatcher[] = [];
      while (target = target.parent) {
        parents.push(target);
      }
      return parents;
    }

    private capturePhase(event):void {
      var parents = Dispatcher.findParents(event.target);
      event.phase = CAPTURE_PHASE;
      while (!event.isPropagationStopped && parents.length > 0) {
        event.currentTarget = parents.pop();
        this.callListeners(event);
      }
    }

    private targetPhase(event):void {
      if (!event.isPropagationStopped) {
        event.phase = TARGET_PHASE;
        event.currentTarget = event.target;
        this.callListeners(event);
      }
    }

    private bubblingPhase(event):void {
      event.phase = BUBBLING_PHASE;
      while (!event.isPropagationStopped && event.currentTarget.parent) {
        event.currentTarget = event.currentTarget.parent;
        this.callListeners(event);
      }
    }

    public dispatchEvent(event:string):Dispatcher;
    public dispatchEvent(event:Event):Dispatcher;
    public dispatchEvent(event:any):Dispatcher {
      if (typeof event === 'string') {
        event = new Event(event);
      }
      event.target = this;

      this.capturePhase(event);
      this.targetPhase(event);
      this.bubblingPhase(event);

      return this;
    }
  }
}

if (!this['document']) {
  Object.keys(tevents).forEach((key:string):void => {
    this[key] = tevents[key];
  });
}