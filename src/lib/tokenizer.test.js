import { tokenize } from './tokenizer'

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
		const result = tokenize(character)
		expect(result[0]).toMatchObject({ type: token, content: character })
	})

	it('parses a multiple characters as multiple tokens', () => {
		const result = tokenize('*+-')
		expect(result).toHaveLength(3)
	})

	it('parses non special character as TEXT', () => {
		const result = tokenize('a')
		expect(result[0]).toMatchObject({ type: 'TEXT', content: 'a' })
	})

	it('parses text characters into a single token', () => {
		const result = tokenize('Hello, World')
		expect(result[0]).toMatchObject({ type: 'TEXT', content: 'Hello, World' })
	})

  it('parses text mixed with special characters into an array of tokens', () => {
    const result = tokenize('Hello, **World**!')
    expect(result[0]).toMatchObject({type: 'TEXT', content: 'Hello, '})
    expect(result[1]).toMatchObject({type: 'ASTERISK', content: '*'})
    expect(result[2]).toMatchObject({type: 'ASTERISK', content: '*'})
    expect(result[3]).toMatchObject({type: 'TEXT', content: 'World'})
    expect(result[4]).toMatchObject({type: 'ASTERISK', content: '*'})
    expect(result[5]).toMatchObject({type: 'ASTERISK', content: '*'})
    expect(result[6]).toMatchObject({type: 'EXCLAMATION_MARK', content: '!'})
  })

  it('processes the multiline input', () => {
    const result = tokenize(`Hello,

World!`)
    expect(result[0]).toMatchObject({type: 'TEXT', content: 'Hello,'})
    expect(result[1]).toMatchObject({type: 'NEW_LINE', content: '\n'})
    expect(result[2]).toMatchObject({type: 'NEW_LINE', content: '\n'})
    expect(result[3]).toMatchObject({type: 'TEXT', content: 'World'})
  })
})
