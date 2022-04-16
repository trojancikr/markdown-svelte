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
		this.pos = 0
	}

	nextCharacter() {
		return this.characters[this.pos++]
	}

	collectText(firstCharacter) {
		const buffer = [firstCharacter]
		// eslint-disable-next-line no-constant-condition
		while (true) {
			let character = this.nextCharacter()
			if (!character) break
			const type = specials[character] ?? TEXT
			if (type !== TEXT) break
			buffer.push(character)
		}
		this.pos--
		return { type: TEXT, content: buffer.join('') }
	}

	next() {
		const character = this.nextCharacter()

		if (!character) return null

		const type = specials[character] ?? TEXT

		if (type === TEXT)
			return this.collectText(character)

		return { type, content: character }
	}
}
