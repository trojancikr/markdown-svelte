<script>
	import { Tokenizer } from '$lib/tokenizer'
	let source = ''
	let tokens = []

	$: {
		tokens = [...(new Tokenizer(source))]
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
