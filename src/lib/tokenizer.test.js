import { Tokenizer } from './tokenizer'

describe('tokenizer', () => {
	test.each`
		character | token
		${'*'}    | ${'ASTERISK'}
		${'\\'}   | ${'BACKSLASH'}
		${'`'}    | ${'BACKTICK'}
		${'_'}    | ${'UNDERSCORE'}
		${'{'}    | ${'LEFT_CURLY_BRACE'}
		${'}'}    | ${'RIGHT_CURLY_BRACE'}
		${'['}    | ${'LEFT_BRACKET'}
		${']'}    | ${'RIGHT_BRACKET'}
		${'('}    | ${'LEFT_PARENTHESIS'}
		${')'}    | ${'RIGHT_PARENTHESIS'}
		${'<'}    | ${'LESSER_THAN'}
		${'>'}    | ${'GREATER_THAN'}
		${'#'}    | ${'POUND_SIGN'}
		${'+'}    | ${'PLUS_SIGN'}
		${'-'}    | ${'MINUS_SIGN'}
		${'.'}    | ${'DOT'}
		${'!'}    | ${'EXCLAMATION_MARK'}
		${'|'}    | ${'PIPE'}
		${'\n'}   | ${'NEW_LINE'}
	`('parses $character as $token', ({ character, token }) => {
		const tokenizer = new Tokenizer(character)
		expect(tokenizer.next()).toMatchObject({ type: token, content: character })
	})

	it('parses a multiple characters as multiple tokens', () => {
		const tokenizer = new Tokenizer('*+-')
		expect(tokenizer.next()).toMatchObject({ type: 'ASTERISK', content: '*' })
		expect(tokenizer.next()).toMatchObject({ type: 'PLUS_SIGN', content: '+' })
		expect(tokenizer.next()).toMatchObject({ type: 'MINUS_SIGN', content: '-' })
		expect(tokenizer.next()).toBeNull()
	})

	it('parses non special character as TEXT', () => {
		const tokenizer = new Tokenizer('a')
		expect(tokenizer.next()).toMatchObject({ type: 'TEXT', content: 'a' })
	})

	it('parses text characters into a single token', () => {
		const tokenizer = new Tokenizer('Hello, World')
		expect(tokenizer.next()).toMatchObject({ type: 'TEXT', content: 'Hello, World' })
	})

	it('parses text mixed with special characters into an array of tokens', () => {
		const tokenizer = new Tokenizer('Hello, **World**!')
		expect(tokenizer.next()).toMatchObject({ type: 'TEXT', content: 'Hello, ' })
		expect(tokenizer.next()).toMatchObject({ type: 'ASTERISK', content: '*' })
		expect(tokenizer.next()).toMatchObject({ type: 'ASTERISK', content: '*' })
		expect(tokenizer.next()).toMatchObject({ type: 'TEXT', content: 'World' })
		expect(tokenizer.next()).toMatchObject({ type: 'ASTERISK', content: '*' })
		expect(tokenizer.next()).toMatchObject({ type: 'ASTERISK', content: '*' })
		expect(tokenizer.next()).toMatchObject({ type: 'EXCLAMATION_MARK', content: '!' })
	})

	it('processes the multiline input', () => {
		const tokenizer = new Tokenizer(`Hello,

World!`)
		expect(tokenizer.next()).toMatchObject({ type: 'TEXT', content: 'Hello,' })
		expect(tokenizer.next()).toMatchObject({ type: 'NEW_LINE', content: '\n' })
		expect(tokenizer.next()).toMatchObject({ type: 'NEW_LINE', content: '\n' })
		expect(tokenizer.next()).toMatchObject({ type: 'TEXT', content: 'World' })
	})
})
