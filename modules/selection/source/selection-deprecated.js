
import { Bus } from 'bus'

export function install_selection(component, bus) {
	
	let state = { selections: [] }
	bus.on('row-will-select', (child) => {
		deselect_rows(component, state)
		state.selections = [child]
	})
	document.onkeydown = (event) => {
		if (event.key == 'ArrowDown') bus.emit('keydown:arrow-down')
		if (event.key == 'ArrowUp') bus.emit('keydown:arrow-up')
	}
	bus.on('keydown:arrow-down', () => select_adjacent_row(component, state, 1))
	bus.on('keydown:arrow-up', () => select_adjacent_row(component, state, -1))
}

export function select_row(child, bus) {
	
	bus.emit('row-will-select', child)
	child.element.querySelector('div.row').classList.add('selected')
	return true
}

function deselect_rows(component, state) {
	
	state.selections.forEach((each) => {
		each.element.querySelector('div.row').classList.remove('selected')
	})
}

function select_adjacent_row(component, state, direction) {
	
	let child = find_adjacent_row(component, state.selections[0], direction)
	if (! child) return
	window.location.hash = child.data.link
	return true
}

function find_adjacent_row(component, child, direction) {
	
	let children = component.children
	for (let i = 0; i < children.length; i++) {
		if (children[i] == child) return component.child(i + direction)
	}
}