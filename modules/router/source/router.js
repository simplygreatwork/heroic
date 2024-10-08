
import { Bus } from '../../bus/source/bus.js'
import { trace as trace_, later, print_registry } from './support.js'

const trace = trace_(false)

export function Router() {
	
	let then = [], now = [], queue = [], offs = []
	let bus = new Bus(), enters_ = new Bus(), exits_ = new Bus()
	return install({
		register,
		exits,
		go,
		on: bus.on.bind(bus)
	})
	
	function install(router) {
		
		window.addEventListener('hashchange', () => {
			router.go(window.location.hash.split('/').filter((each) => {
				return each != '#'
			}).join('/'))
		}, false)
		return router
	}
	
	function register(path, { enter, exit }) {
		
		trace(`Router.register: ${path}`)
		const length = path.split('/').length
		const off = {}
		if (enter) off.enter = enters_.on(path, (data) => enter(data))
		if (exit) off.exit = exits_.on(path, (data) => {
			const offs_ = offs[length]
			if (offs_ && offs_.enter) offs_.enter()
			if (offs_ && offs_.exit) offs_.exit()
			exit(data, off.exit)
		})
		offs[length - 1] = off
	}
	
	function enters(path, enter, once) {
		
		const off = enters_.on(path, data => {
			enter(data)
			if (false) console.log(`enters ${path}`)
			if (once) off()
		})
	}
	
	function exits(path, exit, once) {
		
		const off = exits_.on(path, data => {
			exit(data)
			console.log(`exits ${path}`)
			if (once) off()
		})
	}
	
	function go(path) {
		
		trace(`Router.go: ${path}`)
		then = now
		now = now_coerce(path)
		const point = find_change_point(then, now)
		console.log(`Go from ${JSON.stringify(then.join('/'))} to ${JSON.stringify(now.join('/'))}.`)
		queue.push(...stage_exits(point))
		queue.push(...stage_enters(point))
		queue.push({ kind: 'complete', path: `#/${path}` })
		proceed()
	}
	
	function now_coerce(path) {
		
		const now = path.split('/')
		if (now[0] == '#') now == now.slice(1)
		return now.filter((each) => {
			if (each) return true
			else return false
		})
	}
	
	function find_change_point() {
		
		let point = null
		then.some((item, index) => {
			if (! is_same_part(then, now, index)) {
				point = index
				return true
			}
		})
		return (point !== null) ? point: then.length
	}
	
	function is_same_part(a, b, index) {
		
		if (a === null || (b === null)) return false
		if (index >= a.length || index >= b.length) return false
		if (a[index] != b[index]) return false
		return true
	}
	
	function stage_exits(point) {
		
		const path = then.slice(0, point)
		return then.slice(point).map((part, index) => {
			path.push(part)
			return { kind: 'exit', path: path.join('/'), part, index: point + index }
		}).reverse()
	}
	
	function stage_enters(point) {
		
		const path = now.slice(0, point)
		return now.slice(point).map((part, index) => {
			path.push(part)
			return { kind: 'enter', path: path.join('/'), part, index: point + index }
		})
	}
	
	function proceed() {
		
		if (queue.length === 0) return 
		const change = queue.shift()
		trace(`process: ${JSON.stringify(change)}`)
		later(() => {
			if (change.kind == 'complete') {
				bus.emit('change', change.path)
				proceed()	
			}
			else fire_change(change)
		})
	}
	
	function fire_change(change) {
		
		let found = false
		const bus = change.kind == 'enter' ? enters_ : exits_
		Object.keys(bus.channels).forEach((pattern) => {
			find_match(pattern, change.path, (result) => {
				trace(`${change.kind} pattern: ${pattern}`)
				bus.emit(pattern, Object.assign(change, { values: result, then: proceed }))
				found = true
			})
		})
		if (! found) {
			console.warn(`Pattern not found: ${change.path}`)
			proceed()
		}
	}
}

export function find_match(pattern, subject, fn) {
	
	let result = {}
	pattern = pattern.split('/')
	subject = subject.split('/')
	if (pattern.length != subject.length) return false
	pattern.forEach((each, index) => {
		if (each.startsWith(':')) {
			if (result) result[each.substring(1)] = subject[index]
		} else {
			if (each != subject[index]) result = false
		}
	})
	if (result) fn(result)
}

export function complete(fn) {
	
	return function(options) {
		fn(options)
		options.then()
	}
}
