
import { Component } from 'component'

import { Bus } from 'bus'
import { install_selection, select_row } from '../shared/library/selection.js'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		const { item, link, bus } = data
		const { div, a } = $()
		
		Object.assign(a, { href: link, innerText: item.title })
		div[1].onmousedown = () => {
			select_row(component, bus)
			window.location.hash = link
		}
		bus.on(`item-changed:${item.id}`, ({ item }) => a.innerText = item.title)
	})
}
