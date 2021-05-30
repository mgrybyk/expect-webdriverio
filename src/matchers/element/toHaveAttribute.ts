import { waitUntil, enhanceError, compareText, executeCommand, wrapExpectedWithArray, updateElementsArray } from '../../utils'
import { runExpect } from '../../util/expectAdapter'

async function conditionAttr(el: WebdriverIO.Element, attribute: string): Promise<any> {
    const attr = await el.getAttribute(attribute)
    if (typeof attr !== 'string') {
        return { result: false, value: attr }
    } else {
        return { result: true, value: attr }
    }
}

async function conditionAttrAndValue(el: WebdriverIO.Element, attribute: string, value: string, options: ExpectWebdriverIO.StringOptions): Promise<any> {
    const attr = await el.getAttribute(attribute)
    if (typeof attr !== 'string') {
        return { result: false, value: attr }
    }

    return compareText(attr, value, options)
}

export function toHaveAttributeAndValueFn(received: WebdriverIO.Element | WebdriverIO.ElementArray, attribute: string, value: string, options: ExpectWebdriverIO.StringOptions = {}): any {
    const isNot = this.isNot
    const { expectation = 'attribute', verb = 'have' } = this

    return browser.call(async () => {
        let el = await received
        let attr
        const pass = await waitUntil(async () => {
            const result = await executeCommand.call(this, el, conditionAttrAndValue, options, [attribute, value, options])
            el = result.el
            attr = result.values

            return result.success
        }, isNot, options)

        updateElementsArray(pass, received, el)

        let message: string
        if (typeof value === 'string') {
            const expected = wrapExpectedWithArray(el, attr, value)
            message = enhanceError(el, expected, attr, this, verb, expectation, attribute, options)
        } else {
            message = enhanceError(el, !isNot, pass, this, verb, expectation, attribute, options)
        }

        return {
            pass,
            message: (): string => message
        }
    })
}

export function toHaveAttributeFn(received: WebdriverIO.Element | WebdriverIO.ElementArray, attribute: string): any {
    const isNot = this.isNot
    const { expectation = 'attribute', verb = 'have' } = this

    return browser.call(async () => {
        let el = await received
        let attr
        const pass = await waitUntil(async () => {
            const result = await executeCommand.call(this, el, conditionAttr, {}, [attribute])
            el = result.el
            attr = result.values

            return result.success
        }, isNot, {})

        updateElementsArray(pass, received, el)

        let message: string
        message = enhanceError(el, !isNot, pass, this, verb, expectation, attribute, {})

        return {
            pass,
            message: (): string => message
        }
    })
}

export function toHaveAttribute(...args: any): any {
    if(typeof args[1] === 'string') {
        if(typeof args[2] === 'string') {
            // Name and value is passed in e.g. toHaveAttribute('attr', 'value')
            return runExpect.call(this, toHaveAttributeAndValueFn, args)
        } else {
            // Only name is passed in e.g. toHaveAttribute('attr')
            return runExpect.call(this, toHaveAttributeFn, args)
        }
    }
}

export const toHaveAttr = toHaveAttribute
