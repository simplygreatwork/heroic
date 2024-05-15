
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

export function $(component, selector) {
	
	if (selector) return component.element.querySelector(selector)
	return get_elements(component.elements, true)
}

export function get_elements(elements, condense) {
	
	condense = condense || false
	if (! elements) return {}
	const result = {}
	elements.forEach((element) => {
		const tag = element.tagName.toLowerCase()
		if (! result[tag]) result[tag] = []
		result[tag].push(element)
	})
	if (condense) Object.keys(result).forEach((each) => {
		if (result[each] instanceof Array && result[each].length === 1) result[each] = result[each][0]
	})
	return result
}

export function print_elements(elements) {
	
	elements.forEach((each) => {
		console.log(`tag: ${each.tagName}`)
	})
}
