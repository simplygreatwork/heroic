
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
