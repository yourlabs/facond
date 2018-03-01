/* global describe, jest, test, expect */

import jsdom from 'jsdom'
const { JSDOM } = jsdom

const domFixture = () => new JSDOM()
const submitUiFactory = () => new SubmitUi(
  domFixture().window.document.querySelector('body'))

describe('submit-ui dom tests', () => {
  test('showSubmitLoading', () => {
    const submitUi = submitUiFactory()
  })
})
