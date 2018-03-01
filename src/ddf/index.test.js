/* global describe, jest, test, expect */

import { ddf } from './index'

const formFixture = {
  "cls": "ddf.form.Form",
  "prefix": null,
  "rules": [
    {
	  "cls": "ddf.rule.Rule",
	  "field": "title"
 	  "actions": [
	    {
		  "cls": "ddf.action.Remove",
		  "conditions": [
			{
			  "cls": "ddf.condition.ValueIs",
			  "field": "kind",
			  "value": "nonprofit"
			}
		  ]
		}
	  ]
	}
  ]
}

describe('instanciate formFixture', () => {
  test('showSubmitLoading', () => {
    const submitUi = submitUiFactory()
  })
})
