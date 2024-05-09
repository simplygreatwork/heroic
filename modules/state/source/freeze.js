
const frozen = () => { throw new TypeError('Object is frozen') }

export const deep_freeze = o => {
	
	if (typeof o !== 'object' || ! o || Object.isFrozen(o)) return o
	if (! [Object, Array, Map, Set].some(C => C.prototype === Object.getPrototypeOf(o))) return o
	if (o instanceof Map || o instanceof Set) {
		for (let method of ['add', 'set', 'clear', 'delete']) {
			Object.defineProperty(o, method, { value: frozen })
		}
		[...Object.freeze(o)].forEach(deep_freeze)
	} else {
		Object.freeze(o)
		Object.keys(o).forEach(key => deep_freeze(o[key]))
	}
	return o
}
