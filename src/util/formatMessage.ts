import { printExpected, printReceived, printDiffOrStringify } from 'jest-matcher-utils';

const EXPECTED_LABEL = 'Expected';
const RECEIVED_LABEL = 'Received';
const NOT_SUFFIX = ' [not]'
const NOT_EXPECTED_LABEL = EXPECTED_LABEL + NOT_SUFFIX

export const enhanceError = (
    subject: string | WebdriverIO.Element | WebdriverIO.ElementArray,
    expected: any,
    actual: any,
    context: { isNot: boolean },
    verb: string,
    expectation: string,
    arg2 = '', {
        message = '',
        containing = false
    }) => {
    const { isNot } = context

    subject = typeof subject === 'string' ? subject : getSelectors(subject)

    let contain = ''
    if (containing) {
        contain = ' containing'
    }

    if (verb) {
        verb += ' '
    }

    let diffString
    if (isNot && actual === expected) {
        diffString = `${EXPECTED_LABEL}: ${printExpected(expected)}\n` +
            `${RECEIVED_LABEL}: ${printReceived(actual)}`
    } else {
        // TODO this.extend should be configurable! The last param that is always true
        diffString = printDiffOrStringify(expected, actual, EXPECTED_LABEL, RECEIVED_LABEL, true)
    }
    if (isNot) {
        diffString = diffString
            .replace(EXPECTED_LABEL, NOT_EXPECTED_LABEL)
            .replace(RECEIVED_LABEL, RECEIVED_LABEL + ' '.repeat(NOT_SUFFIX.length))
    }

    if (message) {
        message += '\n'
    }

    if (arg2) {
        arg2 = ` ${arg2}`
    }

    const msg = `${message}Expect ${subject} ${not(isNot)}to ${verb}${expectation}${arg2}${contain}\n\n${diffString}`
    return msg
}

export const enhanceErrorBe = (
    subject: string | WebdriverIO.Element | WebdriverIO.ElementArray,
    pass: boolean,
    context: any,
    verb: string,
    expectation: string,
    options: ExpectWebdriverIO.CommandOptions) => {
    return enhanceError(subject, not(context.isNot) + expectation, not(!pass) + expectation, context, verb, expectation, '', options)
}

export const getSelectors = (el: WebdriverIO.Element | WebdriverIO.ElementArray) => {
    const selectors = []
    let parent: WebdriverIO.Element | WebdriverIO.BrowserObject | undefined

    if (Array.isArray(el)) {
        selectors.push(`${el.foundWith}(\`${getSelector(el)}\`)`)
        parent = el.parent
    } else {
        parent = el
    }

    while (parent && 'selector' in parent) {
        const selector = getSelector(parent)
        const index = parent.index ? `[${parent.index}]` : ''
        selectors.push(`${parent.index ? '$' : ''}$(\`${selector}\`)${index}`)

        parent = parent.parent
    }

    return selectors.reverse().join('.')
}

export const getSelector = (el: WebdriverIO.Element | WebdriverIO.ElementArray) => {
    let result = typeof el.selector === 'string' ? el.selector : '<fn>'
    if (Array.isArray(el) && el.props.length > 0) {
        // todo handle custom$ selector
        result += ', <props>'
    }
    return result
}

export const not = (isNot: boolean) => {
    return `${isNot ? 'not ' : ''}`
}

export const numberError = (gte: number, lte: number, eq?: number) => {
    if (typeof eq === 'number') {
        return eq
    }

    let error = ''
    error = `>= ${gte}`
    error += lte ? ` && <= ${lte}` : ''
    return error
}