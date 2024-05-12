
import { Bus } from '../../bus/source/bus.js'
import { clone } from './utility.js'
import { deep_freeze } from './freeze.js'

export function State(data) {
	return store_new(clone(data || {}))
}

function store_new(data) {
	
	const store = { bus: new Bus(), transactions: [], index: -1 }
	const path = ''
	return scope_new(store, data, path)
}

function store_undo(store, data) {
	
	if (store.index === 0) return
	let transaction = store.transactions[store.index]
	transaction.changes.forEach((change) => {
		let path = change.path.split('/').filter((each) => each.length > 0)
		ops_set_silently({ data, store }, path, change.old)
	})
	store.index--
}

function store_redo(store, data) {
	
	if (store.index + 1 === store.transactions.length) return
	store.index++
	const transaction = store.transactions[store.index]
	transaction.changes.forEach((change) => {
		let path = change.path.split('/').filter((each) => each.length > 0)
		ops_set_silently({ data, store }, path, change.value)
	})
}

function store_travel(store, data, transaction) {
	
	const index = store.transactions.indexOf(transaction)
	if (index == -1) return
	let delta = store.index - index
	while (delta > 0) {
		store_undo(store, data)
		delta--
	}
	while (delta < 0) {
		store_redo(store, data)
		delta++
	}
	store.index = index
}

function scope_new(store, data, path) {
	
	const scope = {
		transactions: () => store.transactions,
		path: path.split('/').filter((each) => each.length > 0),
		get: (path) => transaction_new(scope, store, data).ops.get(path),
		commit: (fn) => scope_commit(scope, store, data, fn),
		select: (path) => scope_select(scope, store, data, path),
		on_change: (path, fn) => scope_on_change(scope, store, path, fn),
		undo: () => store_undo(store, data),
		redo: () => store_redo(store, data),
		travel: (transaction) => store_travel(store, data, transaction)
	}
	return scope
}

function scope_commit(scope, store, data, fn) {
	
	let transaction = transaction_new(scope, store, data)
	fn(transaction.ops)
	if (transaction.changes.length) {
		store.transactions = store.transactions.slice(0, store.index + 1) // review this logic (+1)
		transaction = { changes: clone(transaction.changes)}
		store.transactions.push(transaction)
		store.index++
	}
	if (false) print(`..transactions`, store.transactions)
	return transaction
}

function scope_select(scope, store, data, path) {
	return scope_new(store, data, path)
}

function scope_on_change(scope, store, path, fn) {
	
	if (! fn) return store.bus.on(`change`, fn = path)
	else return store.bus.on(`change:${path}`, fn)
}

function scope_parts(scope, path) {
	return [...scope.path, ...path.split('/')].filter((each) => each.length > 0)
}

function transaction_new(scope, store, data) {
	
	const transaction = { changes: [], scope, store, data }
	transaction.ops = {
		get: (path) =>  ops_preprocess(transaction, ops_get, [path]),
		set: (path, value) =>  ops_preprocess(transaction, ops_set, [path, value]),
		update: (path, fn) =>  ops_preprocess(transaction, ops_update, [path, fn]),
		remove: (path) =>  ops_preprocess(transaction, ops_remove, [path]),
		apply: (path, fn) =>  ops_preprocess(transaction, ops_apply, [path, fn]),
	}
	return transaction
}

function ops_preprocess(transaction, fn, args) {
	
	let path = args.shift()
	path = scope_parts(transaction.scope, path || '')
	return fn(transaction, path, ...args)
}

function ops_get(transaction, path) {
	let result = ops_get_internal(transaction, path)
	return result ? deep_freeze(clone(result)) : null
}

function ops_get_internal(transaction, path) {
	return find(transaction.data, path)
}

function ops_set(transaction, path, value) {
	ops_set_internal(transaction, path, value, false)
}

function ops_set_silently(transaction, path, value) {
	
	let key = path.pop()
	let item = find(transaction.data, path)
	path.push(key)
	let old = ops_get_internal(transaction, path)
	item[key] = value
	const bus = transaction.store.bus
	path = path.join('/')
	bus.emit('change', path, value, old)
	bus.emit(`change:${path}`, path, value, old)
}

function ops_set_internal(transaction, path, value, silent) {
	
	let key = path.pop()
	let item = find(transaction.data, path)
	path.push(key)
	let old = ops_get_internal(transaction, path)
	item[key] = value
	path = path.join('/')
	if (value) value = clone(value)
	transaction.changes.push({ path, value, old })
	const bus = transaction.store.bus
	bus.emit('change', path, value, old)
	bus.emit(`change:${path}`, path, value, old)
}

function ops_update(transaction, path, fn) {
	ops_set(transaction, path, clone(fn(ops_get_internal(transaction, path))))
}

function ops_remove(transaction, path) {
	
	let old = ops_get_internal(transaction, path)
	let key = path.pop()
	let item = find(transaction.data, path)
	path.push(key)
	delete item[key]
	const value = undefined
	path = path.join('/')
	if (value) value = clone(value)
	transaction.changes.push({ path, value, old })
	const bus = transaction.store.bus
	bus.emit('change', path, value, old)
	bus.emit(`change:${path}`, path, value, old)
}

function ops_apply(transaction, path, fn) {
	
	path.forEach((each) => transaction.scope.path.push(each))
	fn(transaction.ops)
	path.forEach((each) => transaction.scope.path.pop())
}

function find(item, path) {
	
	path.forEach(key => {
		item = item[key]
	})
	return item
}

function print(label, value) {
	console.log(`${label}: ${JSON.stringify(value, null, 2)}`)
}
