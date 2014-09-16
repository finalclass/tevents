declare module "tevents" {

  export var CAPTURE_PHASE:number;
  export var TARGET_PHASE:number;
  export var BUBBLING_PHASE:number;

  export class Event {
    public currentTarget:Dispatcher;
    public target:Dispatcher;
    public phase:number;
    public isPropagationStopped:boolean;

    private _type:string;
    public bubble:boolean;
    constructor(type:string, bubble?:boolean);
    public stopPropagation():void;
    public type:string;
  }

  export class DataEvent extends Event {
    public data:any;
    constructor(type:string, data:any);
  }

  export class PropertyChangeEvent extends Event {
    public propertyName:string;
    public oldValue:any;
    public newValue:any;

    constructor(propertyName?:string, oldValue?:any, newValue?:any);
  }

  export interface IHandlerFunction {
    (event:Event):void;
  }

  class Handler {
    public handlerFunction:IHandlerFunction;
    public useCapture:boolean;
    public once:boolean;
    constructor(handlerFunction:IHandlerFunction, useCapture:boolean, once?:boolean);
  }

  export class Dispatcher {
    private listeners:{[index:string]:Handler[]};
    public parent:Dispatcher;

    constructor();

    private initHandlersForType(eventType:string):void;
    private indexOfEventHandler(eventType:string, func:IHandlerFunction):number;
    public on(eventType:string, func:IHandlerFunction, useCapture?:boolean):Dispatcher;
    public once(eventType:string, func:IHandlerFunction, useCapture?:boolean):Dispatcher;
    public removeEventListener(eventType:string, func:IHandlerFunction):Dispatcher;
    public hasEventListener(eventType):boolean;
    private callListeners(event:Event):void;
    private static findParents(target:Dispatcher):Dispatcher[];
    private capturePhase(event):void;
    private targetPhase(event):void;
    private bubblingPhase(event):void;
    public dispatchEvent(event:string):Dispatcher;
    public dispatchEvent(event:Event):Dispatcher;
    public dispatchEvent(event:any):Dispatcher;
  }
}