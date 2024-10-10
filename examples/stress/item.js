
import { Component } from 'component'
import { bind } from 'bind'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		const { item, link, scope } = data
		const { div, a } = $()
		
		Object.assign(a, { href: link, innerText: item.title })
		bind(div[1], 'mousedown', () => location.hash = link, scope)
	})
}
