interface IEmitterObject {
	events: IEvents;
	on: (type: string, handler: () => void) => IEmitterObject;
	off: (type?: string, handler?: () => void) => IEmitterObject;
	trigger: <T>(event: string | IEventType, args: Array<T>) => IEmitterObject;
	_offAll: () => IEmitterObject;
	_offByType: (type: string | undefined) => IEmitterObject;
	_dispatch: (event: IEventType, args: any[]) => IEmitterObject;
	_offByHandler: (type: string | undefined, handler: () => void) => IEmitterObject;
}

interface IEventType {
	type: string;
	timeStamp: Date;
}

interface IEvents {
	[type: string]: Function[];
}

interface IEmitter {
	(): (obj: any, arr: any[]) => void;
}


const emitter: IEmitterObject = {
	events: {},
	on: function (type, handler) {
		if (this.events.hasOwnProperty(type)) {
			this.events[type].push(handler);
		} else {
			this.events[type] = [handler];
		}
		return this;
	},
	off: function (type, handler) {
		if (arguments.length === 0) {
			return this._offAll();
		}
		if (handler === undefined) {
			return this._offByType(type);
		}
		return this._offByHandler(type, handler);
	},
	trigger: function (event, args) {
		if (!(event instanceof EventDi) && typeof event === 'string') {
			event = new EventDi(event);
		}
		return this._dispatch(event, args);
	},
	_dispatch: function (event, args) {
		if (this.events.hasOwnProperty(event.type)) {
			args = args || [];
			args.unshift(event);
			let handlers = this.events[event.type] || [];
			handlers.forEach(handler => handler.apply(null, args));
		}
		return this;
	},
	_offByType: function (type) {
		if (type && this.events.hasOwnProperty(type)) {
			delete this.events[type];
		}
		return this;
	},
	_offByHandler: function (type, handler) {
		if (type && this.events.hasOwnProperty(type)) {
			let i = this.events[type].indexOf(handler);
			if (i > -1) {
				this.events[type].splice(i, 1);
			}
		}
		return this;
	},
	_offAll: function () {
		this.events = {};
		return this;
	}
};

function EmitterDi(): IEmitter {
	let e = Object.create(emitter);
	e.events = {};
	return e;
}

class EventDi {
	timeStamp: Date;
	type: string;

	constructor(type: string) {
		this.type = type;
		this.timeStamp = new Date();
	}
}



EmitterDi.mixin = function (obj: any, arr: Array<keyof Omit<IEmitterObject, 'events'>>) {
	let emitter = Object.create(EmitterDi);
	arr.map(function (name) {
		obj[name] = function () {
			return emitter[name].apply(emitter, arguments);
		};
	});
};