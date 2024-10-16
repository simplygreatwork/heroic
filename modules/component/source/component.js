
import { install as install_bus } from '../../bus/source/bus.js'
import { trace as trace_, deep, later } from './support.js'
import { $ as $_ } from './support.js'

const trace = trace_(false)

export class Component {
	
	static counter = 0
	static recent = null
	
	static start(fn) {
		
		const component = new Component({ content: document.body })
		component.once('ready', ({ component }) => fn(component))
		component.scan()
	}
	
	static ready(fn, options) {
		
		let component = Component.recent
		Object.assign(component, { fn, options: options || {} })
		component.content.style.removeProperty('visibility')									// prevents flicker
		component.element.appendChild(component.content)
		component.elements = Array.from(component.element.querySelectorAll(`*`))
		component.observe()
		component.once('ready', ({ component }) => component.invoke())
		component.scan()
	}
	
	constructor(props) {
		
		Object.assign(this, props || {})
		this.id = Component.counter++
		this.data = this.data || {}
		this.children = []
		if (this.element) this.element.dataset.id = this.id
		install_bus(this)
	}
	
	invoke() {
		
		if (this.is_template) return
		const $ = (selector) => $_(this, selector)
		const import_ = (base, path) => this.import_(base, path, this)
		this.$ = $
		this.fn.apply(this, [{ component: this, data: this.data, $, import_ }])
		this.emit('initialized', this)
	}
	
	scan() {
		
		this.children = []
		this.scan_child(Array.from(this.content.querySelectorAll(`[data-component]`)))
	}
	
	scan_child(elements) {
		
		const import_ = (base, path) => this.import_(base, path, this)
		if (elements.length === 0) return this.emit('ready', { component: this, data: this.data, $: this.$, import_ })
		const element = elements.pop()
		const child = new Component({
			element,
			path: element.dataset.component,
			name: element.getAttribute('name'),
			parent: this,
			base: this.base,
			is_template: element.hasAttribute('data-template') ? true : false
		})
		if (child.is_template) element.style.display = 'none'
		this.children.unshift(child)
		child.on('ready', () => this.scan_child(elements))
		child.load()
	}
	
	load() {
		
		this.fetch_((html) => {
			const span = document.createElement('span')
			span.appendChild(document.createRange().createContextualFragment(html))
			this.content = span.children[0]
			Component.recent = this
			this.element.innerHTML = ''
			this.content.style.visibility = 'hidden'											// prevents flicker
			document.body.appendChild(this.content)
		})
	}
	
	fetch_(fn) {
		
		const no_cache = true
		const path = this.resolve_path()
		const url = no_cache ? `${path}?time=${new Date().getTime()}` : path
		fetch(url)
		.then((response) => response.text())
		.then((html) => fn(this.resolve_links(html)))
	}
	
	redirect(path, data, then) {
		
		trace(`redirect: ${path}`)
		if (then) this.once('initialized', () => then())
		this.data = data ? data : this.data
		if (typeof path == 'string') {
			this.element.setAttribute('data-component', path)
		} else if (typeof path == 'function') {
			const fn = path
			const result = this.element.innerHTML = fn(data)
		}
	}
	
	observe() {
		
		if (this.observer) return
		this.observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type == 'attributes' && mutation.attributeName == 'data-component') {
					this.path = mutation.target.getAttribute('data-component')
					this.load()
				}
			})
		})
		this.observer.observe(this.element, { attributes: true, subtree: false })
	}
	
	child(key) {
		
		if (typeof key === 'number') return this.children[key]
		else if (typeof key === 'string') return this.children.filter((child) => child.name == key)[0]
	}
	
	clone(data, then) {
		
		const element = this.element.cloneNode(deep)
		const component = new Component({
			element,
			data,
			options: this.options,
			path: this.path,
			parent: this.parent,
			fn: this.fn,
			elements: Array.from(element.querySelectorAll(`*`)),
			is_template: false,
			base: this.base
		})
		this.parent.children.push(component)
		this.element.before(component.element)
		component.element.style.display = 'inline'
		component.observer = null
		component.observe()
		component.invoke()
		return component
	}
	
	remove() {
		
		this.parent.children = this.parent.children.filter(value => value !== this)
		this.element.remove()
	}
	
	rebase(base) {
		
		this.base = base
		return this
	}
	
	resolve_path() {
		return this.base && this.path.startsWith('./') ? this.base + this.path.slice(1) : this.path
	}
	
	resolve_links(text) {
		
		if (this.base) text = text.replace(`from './`, `from '${this.base}/`)
		if (this.base) text = text.replace(`from "./`, `from "${this.base}/`)
		return text
	}
	
	async import_(path, base) {
		
		let path_ = this.resolve_path().split('/')
		path_.pop()
		path_ = path_.join('/') + '/'		
		let url = new URL(window.location.origin + window.location.pathname)
		url = new URL(path_, url)
		url = new URL(path, url)
		return await import(url)
	}
}
