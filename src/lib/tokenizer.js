const specials = {
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

function newToken(type, content) {
	return {
		type,
		content
	}
}

function collectTextCharacters(from, end, characters) {
	return characters.slice(from, end).join('')
}

function transformToCollapsedTextTokens(
	{ firstTextCharacter, tokens },
	character,
	index,
	characters
) {
	const type = specials[character] || 'TEXT'

	if (type === 'TEXT') {
		return {
			firstTextCharacter: firstTextCharacter > -1 ? firstTextCharacter : index,
			tokens
		}
	}

	if (firstTextCharacter > -1) {
		tokens.push(newToken('TEXT', collectTextCharacters(firstTextCharacter, index, characters)))
		firstTextCharacter = -1
	}

	tokens.push(newToken(type, character))

	return { firstTextCharacter, tokens }
}

export function tokenize(input) {
	const characters = Array.from(input)
	const { firstTextCharacter, tokens } = characters.reduce(transformToCollapsedTextTokens, {
		firstTextCharacter: -1,
		tokens: []
	})

	if (firstTextCharacter > -1) {
		tokens.push(
			newToken('TEXT', collectTextCharacters(firstTextCharacter, characters.length, characters))
		)
	}

	return tokens
}
