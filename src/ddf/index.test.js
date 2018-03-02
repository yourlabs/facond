/* global describe, jest, test, expect */

import { formConfiguration, dom } from './conftest'
import * as ddf from './index'

describe('getClass()', () => {
  test('ddf.form.Form', () => {
    expect(ddf.getClass('ddf.form.Form')).toBe(ddf.form.Form)
  })
  test('ddf.action.Action', () => {
    expect(ddf.getClass('ddf.action.Action')).toBe(ddf.action.Action)
  })
  test('ddf.action.Remove', () => {
    expect(ddf.getClass('ddf.action.Remove')).toBe(ddf.action.Remove)
  })
  test('ddf.condition.ValueIs', () => {
    expect(ddf.getClass('ddf.condition.ValueIs')).toBe(ddf.condition.ValueIs)
  })
  test('ddf.rule.Rule', () => {
    expect(ddf.getClass('ddf.rule.Rule')).toBe(ddf.rule.Rule)
  })
})

describe('instanciate()', () => {
  test('should instanciate a recursive tree', () => {
    let result = ddf.instanciate(formConfiguration)

    expect(result.prefix).toBe('')
    expect(result.rules.length).toBe(1)
    expect(result.rules[0].field).toBe('title')
    expect(result.rules[0].actions.length).toBe(1)
    expect(result.rules[0].actions[0].conditions.length).toBe(1)
    expect(result.rules[0].actions[0].conditions[0].field).toBe('kind')
    expect(result.rules[0].actions[0].conditions[0].value).toBe('nonprofit')
  })
})

describe('setup()', () => {
  test('should bind form', () => {
    let domFixture = dom()
    let form = ddf.setup(domFixture.window.document.querySelector('script'))
    expect(form.form).toBe(domFixture.window.document.querySelector('form'))
  })
})
