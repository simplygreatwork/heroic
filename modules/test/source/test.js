
import { Bus } from "bus"

export function Test(options) {
	
	options = options || {}
	let test
	return test = {
		name: options.name,
		suite: (fn) => suite(test, fn),
		run: (fn) => run(test, fn),
		items : []
	}
}

function suite(test, fn) {
	
	const it = (label, fn) => test.items.push({ label, fn })
	const wait = (label, fn) => test.items.push({ label, fn, wait: true})
	fn(it, wait)
	return test
}

function run(test, fn) {
	
	let pass = true
	const bus = new Bus()
	fn ? fn(bus) : install(bus)
	bus.emit('begin', test.name || "")
	run_each(test, fn, bus, pass)
}

function run_each(test, fn, bus, pass) {
	
	if (test.items.length === 0) return bus.emit('end', pass)
	const item = test.items.shift()
	if (item.wait) item.fn((result) => run_each_result(test, fn, bus, pass, item, result))
	else run_each_result(test, fn, bus, pass, item, item.fn())
}

function run_each_result(test, fn, bus, pass, item, result) {
	
	item.result = result
	if (item.result === false) pass = false
	bus.emit('item', item.result, item.label)
	run_each(test, fn, bus, pass)
}

function install(bus) {
	
	bus.on('begin', (name) => console.log(`\nRunning test "${name}".`))
	bus.on('item', (pass, label) => console.log(`${ pass ? 'Passed' : 'Failed'}: "${label}".`))
	bus.on('end', (pass) => {
		if (pass) console.log(`All tests passed.`)
		else console.log(`Some tests failed.`)
	})
}
