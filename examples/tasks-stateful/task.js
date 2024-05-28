
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		const { id, item, link, realm, bus, cloud, selection } = data
		const { div, a } = $()
		
		Object.assign(a, { href: link, innerText: item.title })
		item.done ? a.classList.add('done') : a.classList.remove('done')
		div[1].onmousedown = () => {
			location.hash = link
			selection.add(component)
		}
		
		const { on_change } = cloud
		on_change((key, title) => a.innerText = title, `tasks/${id}/title`)
		on_change((key, done) => done ? a.classList.add('done') : a.classList.remove('done'), `tasks/${id}/done`)
		on_change((key, value) => {
			if (value !== undefined) return
			const nearest = selection.nearest()
			nearest ? false: location.hash = `#/${realm}`
			component.remove()
		}, `tasks/${id}`)
	})
}
