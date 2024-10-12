
export class Scope {
	
	constructor(bus) {
		
		this.bus = bus
		this.unpluggables = []
	}
	
	plug(fn) {
		this.unpluggables.push(fn)
	}
	
	unplug() {	
		this.unpluggables.forEach(unplug => unplug())
	}
	
	on(key, fn) {
		this.plug(this.bus.on(key, fn))
	}
	
	once(key, fn) {
		this.bus.on(key, fn)
	}
	
	unshift(key, fn) {
		this.plug(this.bus.unshift(key, fn))
	}
	
	has(key) {
		return this.bus.has(key)
	}
	
	emit(key) {
		this.bus.emit(...arguments)
	}
}
