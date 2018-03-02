import { JSDOM } from 'jsdom'
import * as action from './action'
import { Form } from './form'
import { ValueIs } from './condition'

const dom = () => new JSDOM(`
<html><body><form>
  <div id="name-container">
    <input id="id_name" name="name" />
    <label for="id_name">Name</label>
  </div>
</form></body></html>
`)

function makeAction() {
  let a = new action.Action([new ValueIs('name', 'test')])
  a.apply = jest.fn()
  a.unapply = jest.fn()
  return a
}

describe('Action', () => {
  let formElement = dom().window.document.querySelector('form')
  let form = new Form(formElement)
  let field = form.field('name')

  test('execute() -> unapply', () => {
    let a = makeAction()
    a.execute(field)
    expect(a.unapply.mock.calls.length).toBe(1)
    expect(a.apply.mock.calls.length).toBe(0)
  })

  test('execute() -> apply', () => {
    let a = makeAction()
    formElement.querySelector('[name=name]').value = 'test'
    a.execute(field)
    expect(a.unapply.mock.calls.length).toBe(0)
    expect(a.apply.mock.calls.length).toBe(1)
  })
})

describe('Remove', () => {

})
