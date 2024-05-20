
import { Component } from 'component'

import { Bus } from 'bus'
import { install_selection, select_row } from '../shared/library/selection.js'

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
