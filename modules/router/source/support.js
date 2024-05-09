
export function trace(trace_) {
	
	trace_ = trace_ || false
	return function(string) {
		if (trace_) console.log(string)
	}
}

export function later(fn) {
	window.setTimeout(fn, 1)
}

export function complete(fn) {
	
	return function(options) {
		fn(options)
		options.then()
	}
}

export function print_registry(bus) {
	
	let array = Object.keys(bus.channels).map((key) => {
		return { key: key, size: bus.channels[key].length }
	})
	console.log(`array: ${JSON.stringify(array)}`)
}
