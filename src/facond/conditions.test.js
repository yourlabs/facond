import { JSDOM } from 'jsdom'
import { ValueEqual } from './conditions'
import { Form } from './forms'

const dom = () => new JSDOM(`
<html><body><form>
  <div id="name-container">
    <input id="id_name" name="name" />
    <label for="id_name">Name</label>
  </div>
</form></body></html>
`)

describe('ValueEqual', () => {
  let formElement = dom().window.document.querySelector('form')
  let form = new Form(formElement)
  let condition = new ValueEqual('name', 'test')

  test('validate() -> false', () => {
    expect(condition.validate(form)).toBe(false)
  })

  test('validate() -> true', () => {
    formElement.querySelector('[name=name]').value = 'test'
    expect(condition.validate(form)).toBe(true)
  })
})
