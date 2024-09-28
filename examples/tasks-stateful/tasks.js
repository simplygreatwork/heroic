
export function place_row(component, id, fn) {
	
	rows(component, './task.html').some((each) => {
		if (each.data.item.id > id) {
			fn(each)
			return true
		}
	})
}

export function find_row(component, id, fn) {
	
	rows(component, './task.html').some((each) => {
		if (each.data.item.id === id) {
			fn(each)
			return true
		}
	})
}

export function rows(component, kind) {
	
	return component.children
	.filter((each) => each.path == kind)
	.filter((each) => each.data.item)
	.sort((a, b) => {
		a = a.data.item.id
		b = b.data.item.id
		if (a < b) return -1
		if (a > b) return 1
		return 0
	})
}

export function on_task_added(cloud, fn) {
	on_item_added(cloud, 'tasks', fn)
}

export function on_task_removed(cloud, fn) {
	on_item_removed(cloud, 'tasks', fn)
}

export function on_item_added(cloud, kind, fn) {
	
	cloud.on_change((key, value, old) => {
		key = key.split('/')
		if (key[0] != kind) return
		if (key.length != 2) return
		if (old !== undefined) return
		fn(key[1], value)
	})
}

export function on_item_removed(cloud, kind, fn) {
	
	cloud.on_change((key, value, old) => {
		key = key.split('/')
		if (key[0] != kind) return
		if (key.length != 2) return
		if (value !== undefined) return
		fn(key[1], value)
	})
}

export function trace(enabled, cloud, store) {
	
	if (! enabled) return
	cloud.on_change((key, value, old) => {
		console.log(`cloud.on_change key ${key}`)
		console.log(`store.transactions(): ${JSON.stringify(store.transactions(), null, 2)}`)
	})
}
