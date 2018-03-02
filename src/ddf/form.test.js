import { JSDOM } from 'jsdom'
import { Form } from './form'
import $ from 'jquery'

const formElement = () => new JSDOM(`
<html><body>
<form>
  <div>
   <input id="id_name" name="name" />
   <label for="id_name">Name</label>
  </div>
</body></html>
`).querySelector('form')

describe('Form', () => {
  test('should bind form', () => {
    var subject = new Form([], 'bar')
    $.on = jest.fn()
    subject.bind(formElement)
    expect(subject.form).toBe($(formElement))
    expect($.on.mock.calls.length).toBe(4)
  })
})
