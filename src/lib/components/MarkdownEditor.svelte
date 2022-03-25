<script>
	let source = ''
	let tokens = []

	const special = {
		'*': 'ASTERISK',
		'\\': 'BACKSLASH',
		'`': 'BACKTICK',
		_: 'UNDERSCORE',
		'{': 'LEFT_CURLY_BRACE',
		'}': 'RIGHT_CURLY_BRACE',
		'[': 'LEFT_BRACKET',
		']': 'RIGHT_BRACKET',
		'(': 'LEFT_PARENTHESIS',
		')': 'RIGHT_PARENTHESIS',
		'<': 'LESSER_THAN',
		'>': 'GREATER_THAN',
		'#': 'POUND_SIGN',
		'+': 'PLUS_SIGN',
		'-': 'MINUS_SIGN',
		'.': 'DOT',
		'!': 'EXCLAMATION_MARK',
		'|': 'PIPE',
		'\n': 'NEW_LINE'
	}

	function transformToToken(character, pos) {
		const type = special[character] || 'TEXT'

		return { type, content: character, pos }
	}

	function transformToTextToken(text, pos) {
		return { type: 'TEXT', content: text, pos }
	}

	function mergeTextTokens(tokens, from, to) {
		return tokens
			.slice(from, to)
			.map(({ content }) => content)
			.join('')
	}

	function collapseTextTokens({ pos, result }, token, index, tokens) {
		const { type } = token

		if (type === 'TEXT') {
			return { pos: pos > -1 ? pos : index, result }
		}

		if (pos > -1) {
			result.push(transformToTextToken(mergeTextTokens(tokens, pos, index), pos))
			pos = -1
		}
		result.push(token)

		return { pos, result }
	}

	function tokenize(input) {
		const characters = Array.from(input)
		const tokens = characters.map(transformToToken)
		const { pos, result } = tokens.reduce(collapseTextTokens, { pos: -1, result: [] })

		if (pos > -1) {
			result.push({
				type: 'TEXT',
				content: mergeTextTokens(tokens, pos, tokens.length),
				pos
			})
		}

		return result
	}

	$: {
		tokens = tokenize(source)
	}
</script>

<textarea bind:value={source} />
<div>{source}</div>
Tokens:
<ul>
	{#each tokens as { type, content, pos }}
		<li>({pos}) {type} - {content}</li>
	{/each}
</ul>
