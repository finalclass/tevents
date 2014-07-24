var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _this = this;
var tevents;
(function (tevents) {
    tevents.CAPTURE_PHASE = 1;
    tevents.TARGET_PHASE = 2;
    tevents.BUBBLING_PHASE = 3;

    var Event = (function () {
        function Event(_type, bubble) {
            if (typeof bubble === "undefined") { bubble = false; }
            this._type = _type;
            this.bubble = bubble;
            this.isPropagationStopped = false;
        }
        Event.prototype.stopPropagation = function () {
            this.isPropagationStopped = true;
        };

        Object.defineProperty(Event.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        return Event;
    })();
    tevents.Event = Event;

    var DataEvent = (function (_super) {
        __extends(DataEvent, _super);
        function DataEvent(type, data) {
            _super.call(this, type);
            this.data = data;
        }
        return DataEvent;
    })(Event);
    tevents.DataEvent = DataEvent;

    var PropertyChangeEvent = (function (_super) {
        __extends(PropertyChangeEvent, _super);
        function PropertyChangeEvent(propertyName, oldValue, newValue) {
            if (typeof propertyName === "undefined") { propertyName = ''; }
            _super.call(this, 'propertyChange');
            this.propertyName = propertyName;
            this.oldValue = oldValue;
            this.newValue = newValue;
        }
        return PropertyChangeEvent;
    })(Event);
    tevents.PropertyChangeEvent = PropertyChangeEvent;

    var Handler = (function () {
        function Handler(handlerFunction, useCapture, once) {
            if (typeof once === "undefined") { once = false; }
            this.handlerFunction = handlerFunction;
            this.useCapture = useCapture;
            this.once = once;
        }
        return Handler;
    })();

    var Dispatcher = (function () {
        function Dispatcher() {
            this.listeners = {};
        }
        Dispatcher.prototype.initHandlersForType = function (eventType) {
            if (!this.listeners[eventType]) {
                this.listeners[eventType] = [];
            }
        };

        Dispatcher.prototype.indexOfEventHandler = function (eventType, func) {
            var listeners = this.listeners[eventType];

            if (!listeners) {
                return -1;
            }

            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i].handlerFunction === func) {
                    return i;
                }
            }

            return -1;
        };

        Dispatcher.prototype.on = function (eventType, func, useCapture) {
            if (typeof useCapture === "undefined") { useCapture = false; }
            this.initHandlersForType(eventType);
            this.listeners[eventType].push(new Handler(func, useCapture, false));
            return this;
        };

        Dispatcher.prototype.once = function (eventType, func, useCapture) {
            if (typeof useCapture === "undefined") { useCapture = false; }
            this.initHandlersForType(eventType);
            this.listeners[eventType].push(new Handler(func, useCapture, true));
            return this;
        };

        Dispatcher.prototype.removeEventListener = function (eventType, func) {
            var index = this.indexOfEventHandler(eventType, func);

            if (index !== -1) {
                this.listeners[eventType].splice(index, 1);
            }

            return this;
        };

        Dispatcher.prototype.hasEventListener = function (eventType) {
            return this.listeners[eventType] !== undefined && this.listeners[eventType].length > 0;
        };

        Dispatcher.prototype.callListeners = function (event) {
            if (event.currentTarget.hasEventListener(event.type)) {
                event.currentTarget.listeners[event.type].forEach(function (handler) {
                    if (handler.useCapture && event.phase !== tevents.CAPTURE_PHASE) {
                        return;
                    }
                    if (!handler.useCapture && event.phase === tevents.CAPTURE_PHASE) {
                        return;
                    }
                    handler.handlerFunction.call(event.currentTarget, event);
                    if (handler.once) {
                        event.currentTarget.removeEventListener(event.type, handler.handlerFunction);
                    }
                });
            }
        };

        Dispatcher.findParents = function (target) {
            var parents = [];
            while (target = target.parent) {
                parents.push(target);
            }
            return parents;
        };

        Dispatcher.prototype.capturePhase = function (event) {
            var parents = Dispatcher.findParents(event.target);
            event.phase = tevents.CAPTURE_PHASE;
            while (!event.isPropagationStopped && parents.length > 0) {
                event.currentTarget = parents.pop();
                this.callListeners(event);
            }
        };

        Dispatcher.prototype.targetPhase = function (event) {
            if (!event.isPropagationStopped) {
                event.phase = tevents.TARGET_PHASE;
                event.currentTarget = event.target;
                this.callListeners(event);
            }
        };

        Dispatcher.prototype.bubblingPhase = function (event) {
            event.phase = tevents.BUBBLING_PHASE;
            while (!event.isPropagationStopped && event.currentTarget.parent) {
                event.currentTarget = event.currentTarget.parent;
                this.callListeners(event);
            }
        };

        Dispatcher.prototype.dispatchEvent = function (event) {
            if (typeof event === 'string') {
                event = new Event(event);
            }
            event.target = this;

            this.capturePhase(event);
            this.targetPhase(event);
            this.bubblingPhase(event);

            return this;
        };
        return Dispatcher;
    })();
    tevents.Dispatcher = Dispatcher;
})(tevents || (tevents = {}));

if (!this['document']) {
    Object.keys(tevents).forEach(function (key) {
        _this[key] = tevents[key];
    });
}
//# sourceMappingURL=tevents.js.map
