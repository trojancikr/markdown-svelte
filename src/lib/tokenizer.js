import { ASTERISK, BACKSLASH, BACKTICK, UNDERSCORE, LEFT_CURLY_BRACE, RIGHT_CURLY_BRACE, LEFT_BRACKET, RIGHT_BRACKET, LEFT_PARENTHESIS, RIGHT_PARENTHESIS, LESSER_THAN, GREATER_THAN, POUND_SIGN, PLUS_SIGN, MINUS_SIGN, DOT, EXCLAMATION_MARK, PIPE, NEW_LINE, TEXT } from "./token"

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
		const nextCharacter = () => this.characters[pos++]
		const collectText = (firstCharacter) => {
			const buffer = [firstCharacter]

			for (let i = pos; i < this.characters.length; i++) {
				const character = nextCharacter()
				const type = specials[character] ?? TEXT

				if (type !== TEXT) break

				buffer.push(character)
			}

			pos--
			return { type: TEXT, content: buffer.join('') }
		}

		return {
			next() {
				const character = nextCharacter()

				if (!character)
					return { done: true, value: null }

				const type = specials[character] ?? TEXT

				if (type === TEXT)
					return { done: false, value: collectText(character) }

				return {
					done: false,
					value: { type, content: character },
				}
			}
		}
	}
}
