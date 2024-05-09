
export const deep = true

export function trace(trace_) {
	
	trace_ = trace_ || false
	return function(string) {
		if (trace_) console.log(string)
	}
}

export function later(fn) {
	window.setTimeout(fn, 1)
}
