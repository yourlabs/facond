/* global describe, jest, test, expect */

import $ from 'jquery'
import * as ddf from './index'
import * as form from './form'
import * as action from './action'
import * as rule from './rule'
import * as condition from './condition'

describe('getClass()', () => {
  test('ddf.form.Form', () => {
    expect(ddf.getClass('ddf.form.Form')).toBe(form.Form)
  })
  test('ddf.action.Action', () => {
    expect(ddf.getClass('ddf.action.Action')).toBe(action.Action)
  })
  test('ddf.action.Remove', () => {
    expect(ddf.getClass('ddf.action.Remove')).toBe(action.Remove)
  })
  test('ddf.condition.ValueIs', () => {
    expect(ddf.getClass('ddf.condition.ValueIs')).toBe(condition.ValueIs)
  })
  test('ddf.rule.Rule', () => {
    expect(ddf.getClass('ddf.rule.Rule')).toBe(rule.Rule)
  })
})

describe('instanciate()', () => {
  test('should instanciate a recursive tree', () => {
    const subject = {
      'cls': 'ddf.form.Form',
      'prefix': 'test-',
      'rules': [
        {
          'cls': 'ddf.rule.Rule',
          'field': 'title',
          'actions': [
            {
              'cls': 'ddf.action.Remove',
              'conditions': [
                {
                  'cls': 'ddf.condition.ValueIs',
                  'field': 'kind',
                  'value': 'nonprofit'
                }
              ]
            }
          ]
        }
      ]
    }
    let result = ddf.instanciate(subject)

    expect(result.prefix).toBe('test-')
    expect(result.rules.length).toBe(1)
    expect(result.rules[0].field).toBe('title')
    expect(result.rules[0].actions.length).toBe(1)
    expect(result.rules[0].actions[0].conditions.length).toBe(1)
    expect(result.rules[0].actions[0].conditions[0].field).toBe('kind')
    expect(result.rules[0].actions[0].conditions[0].value).toBe('nonprofit')
  })
})

describe('setup()', () => {
  test('should register jquery plugin', () => {
    ddf.setup()
    expect($.fn.ddf).toBeDefined()
  })
})
