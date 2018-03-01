/* global describe, jest, test, expect */

import * as ddf from './index'
import * as form from './form'

const formFixture = {
  'cls': 'ddf.form.Form',
  'prefix': null,
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

describe('getClass', () => {
  test('should instanciate Form from actions', () => {
    let result = ddf.getClass('ddf.form.Form')
  	expect(result).toBe(Form)
  })
})
