
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		if (! data.item ) return												// because the template has no data
		const { id, item, link, realm, bus, cloud } = data
		const a = $('a.row'), div = $('div.row')
		a.href = link
		a.innerText = item.title
		item.done ? a.classList.add('done') : a.classList.remove('done')
		div.onmousedown = () => window.location.hash = link
		cloud.on_change((key, title) => a.innerText = title, `tasks/${id}/title`)
		cloud.on_change((key, done) => done ? a.classList.add('done') : a.classList.remove('done'), `tasks/${id}/done`)
		cloud.on_change((key, value) => {
			if (value != undefined) return
			component.remove()
			window.location.hash = `#/${realm}`
		}, `tasks/${id}`)
	})
}
