
export class Bus {
	
	constructor(warn) {
		
		this.warn = warn || false
		this.channels = {}
	}
	
	on(key, fn, scope) {
		
		this.channels[key] = this.channels[key] || []
		this.channels[key].push(fn)
		const off = () => {
			const index = this.channels[key].indexOf(fn)
			this.channels[key].splice(index, 1)
		}
		if (scope) scope.plug(off)
		return off
	}
	
	once(key, fn) {
		
		const off = this.on(key, function() {
			fn(...arguments)
			off()
		})
	}
	
	unshift(key, fn, scope) {
		
		this.channels[key] = this.channels[key] || []
		this.channels[key].unshift(fn)
		const off = () => {
			const index = this.channels[key].indexOf(fn)
			this.channels[key].splice(index, 1)
		}
		if (scope) scope.plug(off)
		return off
	}
	
	has(key) {
		
		if (! this.channels[key]) return false
		return true
	}
	
	emit(key) {
		
		let state = {}
		let arguments_ = Array.from(arguments)
		arguments_ = arguments_.splice(1)
		arguments_.push(this.interruptable(state))
		this.iterate(key, state, function(fn) {
			fn.apply(this, arguments_)
		}.bind(this))
	}
	
	iterate(key, state, fn) {
		
		let found = false
		if (! this.channels[key]) return
		this.channels[key].forEach(function(fn_) {
			found = true
			if (! state.interrupted) fn(fn_)
		}.bind(this))
		if (this.warn && ! found) console.warn(`The bus could not find any handler for key: ${key}`)
	}
	
	interruptable(state) {
		
		return function() {
			state.interrupted = true
		}
	}
}

export function install(target) {
	
	target.bus = new Bus()
	Object.assign(target, {
		on() {
			return this.bus.on(...arguments)
		},
		once() {
			return this.bus.once(...arguments)
		},
		emit() {
			return this.bus.emit(...arguments)
		}
	})
}
