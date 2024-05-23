
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		const { item, link, selection } = data
		const { div, a } = $()
		
		Object.assign(a, { href: link, innerText: item.title })
		div[1].onmousedown = () => {
			selection.add(component)
			window.location.hash = link
		}
	})
}
