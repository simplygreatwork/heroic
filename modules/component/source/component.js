
import { install as install_bus } from '../../bus/source/bus.js'
import { trace as trace_, deep, later } from './support.js'

const trace = trace_(false)

export class Component {
	
	static counter = 0
	static recent = null
	
	static start(fn) {
		
		const component = new Component({ content: document.body })
		component.once('ready', fn)
		component.scan()
	}
	
	static ready(fn, options) {
		
		const component = Component.recent
		Object.assign(component, { fn, options: options || {} })
		component.element.appendChild(component.content)
		component.observe()
		component.once('ready', (component) => component.invoke())
		component.scan()
	}
	
	constructor(props) {
		
		Object.assign(this, props || {})
		this.id = Component.counter++
		this.data = this.data || {}
		this.children = []
		install_bus(this)
	}
	
	invoke() {
		
		if (this.is_template) return
		const $ = this.$.bind(this)
		this.elements = Array.from(this.element.querySelectorAll(`*`))
		this.fn.apply(this, [{ component: this, data: this.data, $ }])
		this.emit('initialized', this)
	}
	
	$(selector) {
		
		if (selector) return this.element.querySelector(selector)
		return this.get_elements(this.elements)
	}
	
	get_elements(elements) {
		
		if (! elements) return {}
		const result = {}
		elements.forEach((element) => {
			const tag = element.tagName.toLowerCase()
			if (! result[tag]) result[tag] = []
			result[tag].push(element)
		})
		Object.keys(result).forEach((each) => {
			if (result[each].length === 1) result[each] = result[each][0]
		})
		return result
	}
	
	scan() {
		
		this.children = []
		this.scan_child(Array.from(this.content.querySelectorAll(`[data-component]`)))
	}
	
	scan_child(elements) {
		
		if (elements.length === 0) return this.emit('ready', this, this.path)
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
			const div = document.createElement('div')
			div.appendChild(document.createRange().createContextualFragment(html))
			this.content = div.children[0]
			Component.recent = this
			this.element.innerHTML = ''
			document.body.appendChild(this.content)
			this.emit('attached')
		})
	}
	
	fetch_(fn) {
		
		fetch(`${this.resolve_path()}?time=${new Date().getTime()}`)
		.then((response) => response.text())
		.then((html) => fn(this.resolve_links(html)))
	}
	
	redirect(path, data, then) {
		
		trace(`redirect: ${path}`)
		if (then) this.once('initialized', () => then())
		this.emit('will-redirect')
		this.data = data
		this.element.setAttribute('data-component', path)
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
		this.observer.observe(this.element, { attributes: true })
	}
	
	child(key) {
		
		if (typeof key === 'number') return this.children[key]
		else if (typeof key === 'string') return this.children.filter((child) => child.name == key)[0]
	}
	
	clone(data) {
		
		const element = this.element.cloneNode(deep)
		const component = new Component({
			element,
			data,
			options: this.options,
			path: this.path,
			parent: this.parent,
			fn: this.fn,
			elements: Array.from(element.querySelectorAll(`*`)),
			is_template: false
		})
		this.parent.children.push(component)
		this.element.before(component.element)
		component.element.style.display = 'block'
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
}
