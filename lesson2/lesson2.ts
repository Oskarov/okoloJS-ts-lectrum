interface EventType {
	type: string;
	timeStamp: Date;
}

interface EventsObj {
	[type: string]: Function[];
}

type Emmiters = ['on' | 'off' | 'trigger'];

interface EmitterType {
	events: {};
	on: (type: string, handler: Function) => Emitter;
	off: (type?: string, handler?: Function) => Emitter;
	trigger: <T>(event: string | EventType, args: Array<T>) => Emitter;
	// offAll: () => Emitter;
	// offByType: (type: string) => Emitter;
	// dispatch: (event: EventType, args: any[]) => Emitter;
	// offByHandler: (type: string, handler: Function) => Emitter;
	// mixin: <T extends keyof EventType>(event: EventType, args: Array<T>) => void;
}

class EventConstructor implements EventType {
	type: string;
	timeStamp: Date;

	constructor(type: string) {
		this.type = type;
		this.timeStamp = new Date();
	}
}

class Emitter implements EmitterType {
	events: EventsObj;

	constructor() {
		this.events = {};
	}

	on(type: string, handler: Function) {
		if (this.events.hasOwnProperty(type)) {
			this.events[type].push(handler);
		} else {
			this.events[type] = [handler];
		}
		return this;
	}

	off(type?: string, handler?: Function) {
		if (arguments.length === 0) {
			return this.offAll();
		}

		if (handler === undefined && type) {
			return this.offByType(type);
		}

		if (type && handler) {
			return this.offByHandler(type, handler);
		}

		return this;
	}

	trigger<T>(event: string | EventConstructor, args: Array<T>) {
		const newEvent =
			event instanceof EventConstructor ? event : new EventConstructor(event);

		return this.dispatch(newEvent, args);
	}

	private dispatch(event: EventType, args: any[]) {
		if (!this.events.hasOwnProperty(event.type)) return this;
		args = args || [];
		// args.unshift(event);  Я вот хз зачем это тут

		const handlers = this.events[event.type] || [];
		handlers.forEach((handler) => handler.apply(null, args));
		return this;
	}

	private offByHandler(type: string, handler: Function) {
		if (!this.events.hasOwnProperty(type)) return this;
		const i = this.events[type].indexOf(handler);
		if (i > -1) {
			this.events[type].splice(i, 1);
		}
		return this;
	}

	private offByType(type: string) {
		if (this.events.hasOwnProperty(type)) {
			delete this.events[type];
		}
		return this;
	}

	private offAll() {
		this.events = {};
		return this;
	}

	static Event = EventConstructor;

	// static mixin(obj: { [name: string]: any }, arr: Emmiters) {
	// 	const emitter = new Emitter(); // создаём новый объект с методами для подписки/удаления событий
	// 	arr.map(function (name) {
	// 		// идём по массиву имён событий
	// 		obj[name] = function () {
	// 			// добавляем в переданный объект новое свойство с именем события
	// 			//функция вызывается в контексте emitter для добавления/удаления события
	// 			return emitter[name].apply(emitter, arguments); // возвращает объект emitter?
	// 		};
	// 	});
	// }
}