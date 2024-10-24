
import { bind } from 'bind'

export function initialize({ component, data, $ }) {
	
	const { item, bus, scope, cloud } = data
	const { div, h3, input } = $()
	
	Object.assign(h3, { innerText: `Question ${item.id}` })
	const id = component.path
	const answer = $('[data-answer]').dataset.answer
	$('[data-answer]').removeAttribute('data-answer')
	$(`[value="${answer}"]`).parentElement.style.color = 'green'
	input[0].checked = true
	
	listen()
	
	function listen() {
		
		bind($('[type=submit]'), 'click', event => {
			event.preventDefault()
			find_chosen((chosen) => {
				update_score(chosen == answer)
				component.remove()							// unbind?
			})
		}, scope)
		
		div[1].addEventListener('keydown', event => {
			console.log(`key:${String.fromCharCode(event.which)}`)
		})
	}
	
	function find_chosen(fn) {
		
		if ($(':checked') === undefined) return
		const chosen = $(':checked').value
		if (chosen !== undefined) fn(chosen)
	}
	
	function update_score(correct) {
		
		const { update } = cloud
		update(`score/counter`, value => ++value)
		if (correct) update(`score/correct`, value => ++value)
		update(`score/total`, value => ++value)
	}
}

// key bindings
// delete [data-answer] from the HTML after loading
// do not allow submission if no selection
// select an answer by default
// highlight correct answer by defaault
// dismiss quesion after submission; component.remove()
	// or move to the end?
// use class instead of parentElement.style.color = 'green'
