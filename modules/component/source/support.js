
export const deep = true

export function $(component, selector) {
	
	if (selector) return component.element.querySelector(selector)
	return get_elements(component.elements)
}

export function get_elements(elements) {
	
	if (! elements) return {}
	const result = {}
	elements.forEach((element) => {
		const tag = element.tagName.toLowerCase()
		if (! result[tag]) result[tag] = []
		result[tag].push(element)
	})
	Object.keys(result).forEach((each) => {
		if (result[each] instanceof Array && result[each].length === 1) {
			result[each] = result[each][0]
		}
	})
	return result
}

export function trace(trace_) {
	
	trace_ = trace_ || false
	return function(string) {
		if (trace_) console.log(string)
	}
}

export function later(fn) {
	window.setTimeout(fn, 1)
}
