import {
	ASTERISK,
	BACKSLASH,
	BACKTICK,
	UNDERSCORE,
	LEFT_CURLY_BRACE,
	RIGHT_CURLY_BRACE,
	LEFT_BRACKET,
	RIGHT_BRACKET,
	LEFT_PARENTHESIS,
	RIGHT_PARENTHESIS,
	LESSER_THAN,
	GREATER_THAN,
	POUND_SIGN,
	PLUS_SIGN,
	MINUS_SIGN,
	DOT,
	EXCLAMATION_MARK,
	PIPE,
	NEW_LINE,
	TEXT
} from './token'

const specials = {
	'*': ASTERISK,
	'\\': BACKSLASH,
	'`': BACKTICK,
	_: UNDERSCORE,
	'{': LEFT_CURLY_BRACE,
	'}': RIGHT_CURLY_BRACE,
	'[': LEFT_BRACKET,
	']': RIGHT_BRACKET,
	'(': LEFT_PARENTHESIS,
	')': RIGHT_PARENTHESIS,
	'<': LESSER_THAN,
	'>': GREATER_THAN,
	'#': POUND_SIGN,
	'+': PLUS_SIGN,
	'-': MINUS_SIGN,
	'.': DOT,
	'!': EXCLAMATION_MARK,
	'|': PIPE,
	'\n': NEW_LINE
}

export class Tokenizer {
	constructor(input) {
		this.characters = Array.from(input)
	}

	[Symbol.iterator]() {
		let pos = 0
		const moveBack = () => pos--
		const nextCharacter = () => this.characters[pos++]
		const moveAsFarAsLongItIsText = () => {
			while (pos < this.characters.length) {
				const character = nextCharacter()
				const type = specials[character] ?? TEXT

				if (type !== TEXT) {
					moveBack()
					break
				}
			}

			return pos
		}
		const collectText = () => {
			const beginning = pos - 1
			const end = moveAsFarAsLongItIsText()

			return { type: TEXT, content: this.characters.slice(beginning, end).join('') }
		}

		return {
			next() {
				const character = nextCharacter()

				if (!character) return { done: true }

				const type = specials[character] ?? TEXT

				if (type === TEXT) return { done: false, value: collectText() }

				return {
					done: false,
					value: { type, content: character }
				}
			}
		}
	}
}
