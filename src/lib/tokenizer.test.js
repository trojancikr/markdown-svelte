import { Tokenizer } from './tokenizer'

describe('tokenizer', () => {
	test.each`
		character | type
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
	`('parses $character as $type', ({ character, type }) => {
		const tokenizer = new Tokenizer(character)
		const [token] = tokenizer
		expect(token).toMatchObject({ type, content: character })
	})

	it('parses a multiple characters as multiple tokens', () => {
		const tokenizer = new Tokenizer('*+-')
		const [first, second, third, fourth] = tokenizer
		expect(first).toMatchObject({ type: 'ASTERISK', content: '*' })
		expect(second).toMatchObject({ type: 'PLUS_SIGN', content: '+' })
		expect(third).toMatchObject({ type: 'MINUS_SIGN', content: '-' })
		expect(fourth).toBeUndefined()
	})

	it('parses non special character as TEXT', () => {
		const tokenizer = new Tokenizer('a')
		const [token] = tokenizer
		expect(token).toMatchObject({ type: 'TEXT', content: 'a' })
	})

	it('parses text characters into a single token', () => {
		const tokenizer = new Tokenizer('Hello, World')
		const [token] = tokenizer
		expect(token).toMatchObject({ type: 'TEXT', content: 'Hello, World' })
	})

	it('parses text mixed with special characters into an array of tokens', () => {
		const tokenizer = new Tokenizer('Hello, **World**!')
		const [first, second, third, fourth, fifth, sixth, seventh ] = tokenizer
		expect(first).toMatchObject({ type: 'TEXT', content: 'Hello, ' })
		expect(second).toMatchObject({ type: 'ASTERISK', content: '*' })
		expect(third).toMatchObject({ type: 'ASTERISK', content: '*' })
		expect(fourth).toMatchObject({ type: 'TEXT', content: 'World' })
		expect(fifth).toMatchObject({ type: 'ASTERISK', content: '*' })
		expect(sixth).toMatchObject({ type: 'ASTERISK', content: '*' })
		expect(seventh).toMatchObject({ type: 'EXCLAMATION_MARK', content: '!' })
	})

	it('processes the multiline input', () => {
		const tokenizer = new Tokenizer(`Hello,

World!`)
		const [first, second, third, fourth] = tokenizer
		expect(first).toMatchObject({ type: 'TEXT', content: 'Hello,' })
		expect(second).toMatchObject({ type: 'NEW_LINE', content: '\n' })
		expect(third).toMatchObject({ type: 'NEW_LINE', content: '\n' })
		expect(fourth).toMatchObject({ type: 'TEXT', content: 'World' })
	})
})
