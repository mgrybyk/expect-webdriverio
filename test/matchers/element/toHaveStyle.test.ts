import { getExpectMessage, getReceived } from '../../__fixtures__/utils';
import { toHaveStyle } from '../../../src/matchers/element/toHaveStyle'
import { stringify } from 'jest-matcher-utils';

describe('toHaveStyle', () => {
    let el: WebdriverIO.Element

    beforeEach(async () => {
        el = await $('sel')
        el.getCSSProperty = jest.fn().mockImplementation((property: string) => {
            const mockStyle: { [key: string]: string; } = {
                "font-family": "Faktum",
                "font-size": "26px",
                "color": "#000"
            }
            return { value: mockStyle[property] }
        })
    })

    test('success', async () => {
        const result = await toHaveStyle(el, {
            "font-family": "Faktum",
            "font-size": "26px",
            "color": "#000"
        }, { ignoreCase: true });
        expect(result.pass).toBe(true)
    })

    test('failure', async () => {
        const result = await toHaveStyle(el, {
            "font-family": "Faktum",
            "font-size": "100px",
            "color": "#000"
        }, { ignoreCase: true });
        expect(result.pass).toBe(false)
    })

    // test('wait but failure', async () => {
    //     const el = await $('sel')
    //     el._text = function (): string {
    //         throw new Error('some error')
    //     }

    //     const result = await toHaveText(el, 'WebdriverIO', { ignoreCase: true })
    //     expect(result.pass).toBe(false)
    // })

    // test('success on the first attempt', async () => {
    //     const el = await $('sel')
    //     el._attempts = 0
    //     el._text = function (): string {
    //         this._attempts++
    //         return 'WebdriverIO'
    //     }

    //     const result = await toHaveText(el, 'WebdriverIO', { ignoreCase: true })
    //     expect(result.pass).toBe(true)
    //     expect(el._attempts).toBe(1)
    // })

    // test('no wait - failure', async () => {
    //     const el = await $('sel')
    //     el._attempts = 0
    //     el._text = function ():string {
    //         this._attempts++
    //         return 'webdriverio'
    //     }

    //     const result = await toHaveText(el, 'WebdriverIO', { wait: 0 })
    //     expect(result.pass).toBe(false)
    //     expect(el._attempts).toBe(1)
    // })

    // test('no wait - success', async () => {
    //     const el = await $('sel')
    //     el._attempts = 0
    //     el._text = function (): string {
    //         this._attempts++
    //         return 'WebdriverIO'
    //     }

    //     const result = await toHaveText(el, 'WebdriverIO', { wait: 0 })
    //     expect(result.pass).toBe(true)
    //     expect(el._attempts).toBe(1)
    // })

    // test('not - failure', async () => {
    //     const el = await $('sel')
    //     el._text = function (): string {
    //         return 'WebdriverIO'
    //     }
    //     const result = await toHaveText.call({ isNot: true }, el, 'WebdriverIO', { wait: 0 })
    //     const received = getReceived(result.message())

    //     expect(received).not.toContain('not')
    //     expect(result.pass).toBe(true)
    // })

    // test('should return false if texts dont match', async () => {
    //     const el = await $('sel')
    //     el._text = function (): string {
    //         return 'WebdriverIO'
    //     }

    //     const result = await toHaveText.bind({ isNot: true })(el, 'foobar', { wait: 1 })
    //     expect(result.pass).toBe(false)
    // })

    // test('should return true if texts match', async () => {
    //     const el = await $('sel')
    //     el._text = function (): string {
    //         return 'WebdriverIO'
    //     }

    //     const result = await toHaveText.bind({ isNot: true })(el, 'WebdriverIO', { wait: 1 })
    //     expect(result.pass).toBe(true)
    // })

    // test('message', async () => {
    //     const el = await $('sel')
    //     el._text = function (): string {
    //         return ''
    //     }
    //     const result = await toHaveText(el, 'WebdriverIO')
    //     expect(getExpectMessage(result.message())).toContain('to have text')
    // })

    // test('success if array matches with text and ignoreCase', async () => {
    //     const el = await $('sel')
    //     el._attempts = 0
    //     el._text = function (): string {
    //         this._attempts++
    //         return 'WebdriverIO'
    //     }

    //     const result = await toHaveText(el, ['WDIO', 'Webdriverio'], { ignoreCase: true })
    //     expect(result.pass).toBe(true)
    //     expect(el._attempts).toBe(1)
    // })

    // test('success if array matches with text and trim', async () => {
    //     const el = await $('sel')
    //     el._attempts = 0
    //     el._text = function (): string {
    //         this._attempts++
    //         return '   WebdriverIO   '
    //     }

    //     const result = await toHaveText(el, ['WDIO', 'WebdriverIO', 'toto'], { trim: true })
    //     expect(result.pass).toBe(true)
    //     expect(el._attempts).toBe(1)
    // })

    // test('failure if array does not match with text', async () => {
    //     const el = await $('sel')
    //     el._attempts = 0
    //     el._text = function (): string {
    //         this._attempts++
    //         return 'WebdriverIO'
    //     }

    //     const result = await toHaveText(el, ['WDIO', 'Webdriverio'], { wait: 1 })
    //     expect(result.pass).toBe(false)
    //     expect(el._attempts).toBe(1)
    // })
})
