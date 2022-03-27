<script>
	import { tokenize } from '$lib/tokenizer'
	let source = ''
	let tokens = []

	$: {
		tokens = tokenize(source)
	}
</script>

<textarea bind:value={source} />
<div>{source}</div>
Tokens:
<ul>
	{#each tokens as { type, content }}
		<li>{type} - {content}</li>
	{/each}
</ul>
