
import { Component } from 'component'
import { bind } from 'bind'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		const { id, item, link, realm, cloud, selection } = data
		const { div, a } = $()
		
		Object.assign(a, { href: link, innerText: item.title })
		apply_done(item.done)
		bind(div[1], 'mousedown', () => {
			location.hash = link
			selection.add(component)
		}, cloud.scope)
		
		const { on_change } = cloud
		on_change(`tasks/${id}/title`, (key, title) => a.innerText = title)
		on_change(`tasks/${id}/done`, (key, done) => apply_done(done))
		on_change(`tasks/${id}`, (key, value) => {
			if (value !== undefined) return
			const nearest = selection.nearest()
			nearest ? false : location.hash = `#/${realm}`
			component.remove()
		})
		
		function apply_done(done) {
			done ? a.classList.add('done') : a.classList.remove('done')
		}
	})
}
