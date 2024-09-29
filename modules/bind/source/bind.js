
export function bind(element, type, fn, scope) {
	
	element.addEventListener(type, fn)
	if (scope) scope.plug(() => element.removeEventListener(type, fn))
}

export function bind_text_field(input, cloud, key, parse, format, scope) {
	
	parse = parse || (value => value)
	format = format || (value => value)
	scope = scope || cloud.scope
	const { set, on_change } = cloud
	on_change(key, (key, value) => input.value = format(value))
	bind(input, 'input', () => {
		set(key, parse(event.target.value))
	}, scope)	
}
