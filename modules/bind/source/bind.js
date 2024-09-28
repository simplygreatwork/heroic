
export function bind_text_field(input, cloud, key, parse, format, scope) {
	
	parse = parse || (value => value)
	format = format || (value => value)
	scope = scope || cloud.scope
	const { set, on_change } = cloud
	on_change(key, (key, value) => input.value = format(value))
	const fn = input.addEventListener('input', (event) => set(key, parse(event.target.value)))
	scope.plug(() => input.removeEventListener('input', fn))
}

export function bind_click(element, fn, scope) {
	
	element.addEventListener('click', fn)
	scope.plug(() => element.removeEventListener('click', fn))
}
