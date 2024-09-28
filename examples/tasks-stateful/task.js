
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		const { id, item, link, realm, bus, cloud, selection } = data
		const { div, a } = $()
		
		Object.assign(a, { href: link, innerText: item.title })
		apply_done(item.done)
		const fn = () => { location.hash = link; selection.add(component); }
		div[1].addEventListener('mousedown', fn)
		cloud.scope.plug(() => { div[1].removeEventListener('mousedown', fn); })
		
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
