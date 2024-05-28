
export function cloud_install_store(cloud, store) {
	
	const { on_get, on_set, on_update, on_remove } = cloud
	const { change, on_change } = cloud
	const { on_undo, on_redo, on_travel } = cloud
	cloud.scope.plug(store.on_change((key, value, old) => change(key, value, old)))
	on_get((key, result) => result.value = store.get(key))
	on_set((key, value, result) => result.value = store.commit(({ set }) => set(key, value)))
	on_update((key, fn, result) => result.value = store.commit(({ update }) => update(key, fn)))
	on_remove((key, result) => result.value = store.commit(({ remove }) => remove(key)))
	on_undo(() => store.undo())
	on_redo(() => store.redo())
	on_travel((transaction) => store.travel(transaction))
}

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
