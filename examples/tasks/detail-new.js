
<div>
	<div class="container">
		<section class="content">
			<header data-title class="title" style="display:none;">page-title</header>
			<section class="scroll">
				<input class="task-title">
				<button class="task-done">Complete Task</button>
				<button class="task-close">Close Task</button>
			</section>
		</section>
		<section name="void" class="void" data-component="../shared/views/empty.html"></section>
	</div>
	
	<script type="module">
		
		import { Component } from 'component'
		
		Component.ready(({ component, data, $ }) => {
			
			const { item, bus } = data
			const elements = component.get_elements(component.elements2)
			const { header, input, button } = elements
			
			header.innerText = item.title
			input.value = item.title
			input.oninput = () => {
				item.title = input.value
				bus.emit(`item-changed:${item.id}`, { item })
				header.innerText = item.title + '!'
				bus.emit('title-changed')
			}
			button[0].onclick = () => {
				item.done = true
				bus.emit(`item-changed:${item.id}`, { item })
			}
			button[1].onclick = () => {
				item.closed = true
				bus.emit(`item-changed:${item.id}`, { item })
				bus.emit(`item-changed`, { item })
			}
		})
		
	</script>
</div>
