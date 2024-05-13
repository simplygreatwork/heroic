
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $, elements }) => {
		
		const { id, item, link, realm, bus, cloud } = data
		const { div, a } = elements()
		
		Object.assign(a, { href: link, innerText: item.title })
		item.done ? a.classList.add('done') : a.classList.remove('done')
		div[1].onmousedown = () => location.hash = link
		
		const { on_change } = cloud
		on_change((key, title) => a.innerText = title, `tasks/${id}/title`)
		on_change((key, done) => done ? a.classList.add('done') : a.classList.remove('done'), `tasks/${id}/done`)
		on_change((key, value) => {
			if (value != undefined) return
			component.remove()
			window.location.hash = `#/${realm}`
		}, `tasks/${id}`)
	})
}
