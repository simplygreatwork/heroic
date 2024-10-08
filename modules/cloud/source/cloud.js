
import { Scope } from '../../scope/module.js'

export function Cloud(bus) {
	
	let cloud
	return cloud = {
		bus,
		scope: new Scope(bus),
		with: (fn) => fn(cloud),
		get: (key) => cloud_emit(cloud, 'get', [key]),
		on_get: (fn, key) => cloud_on(cloud, 'get', fn, key),
		set: (key, value) => cloud_emit(cloud, 'set', [key, value]),
		on_set: (fn) => cloud_on(cloud, 'set', fn),
		update: (key, fn) => cloud_emit(cloud, 'update', [key, fn]),
		on_update: (fn) => cloud_on(cloud, 'update', fn),
		remove: (key) => cloud_emit(cloud, 'remove', [key]),
		on_remove: (key) => cloud_on(cloud, 'remove', key),
		change: (key, value, old) => cloud_emit(cloud, 'change', [key, value, old]),
		on_change: (key, fn) => cloud_on(cloud, 'change', fn, key),
		undo: () => cloud_emit(cloud,	'undo'),
		on_undo: (fn) => cloud_on(cloud, 'undo', fn),
		redo: () => cloud_emit(cloud,	'redo'),
		on_redo: (fn) => cloud_on(cloud, 'redo', fn),
		travel: (transaction) => cloud_emit(cloud, 'travel', [transaction]),
		on_travel: (fn) => cloud_on(cloud, 'travel', fn),
		signal: (pattern) => cloud_emit(cloud,	pattern),
		on_signal: (pattern, fn) => cloud_on(cloud, pattern, fn),
	}
}

function cloud_emit(cloud, pattern, args) {
	
	if (! args) return cloud.scope.emit(pattern)
	const result = { value: null }
	cloud.scope.emit(pattern, ...args, result)
	cloud.scope.emit(`${pattern}:${args[0]}`, ...args, result)
	return result.value
}

function cloud_on(cloud, pattern, fn, key) {
	
	if (typeof key == 'function') { fn = key; key = null }
	if (key) cloud.scope.on(`${pattern}:${key}`, fn)
	else cloud.scope.on(pattern, fn)
}
