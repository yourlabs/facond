import { JSDOM } from 'jsdom'
import * as actions from './actions'
import { Form } from './forms'
import { ValueEqual } from './conditions'

describe('Action', () => {
  const dom = new JSDOM(`
  <html><body><form>
    <div id="name-container">
      <input id="id_name" name="name" />
      <label for="id_name">Name</label>
    </div>
  </form></body></html>
  `)

  function makeAction() {
    let a = new actions.Action([new ValueEqual('name', 'test')])
    a.apply = jest.fn()
    a.unapply = jest.fn()
    return a
  }

  let formElement = dom.window.document.querySelector('form')
  let form = new Form(formElement)

  test('execute() -> unapply', () => {
    let a = makeAction()
    a.execute(form)
    expect(a.unapply.mock.calls.length).toBe(1)
    expect(a.apply.mock.calls.length).toBe(0)
  })

  test('execute() -> apply', () => {
    let a = makeAction()
    formElement.querySelector('[name=name]').value = 'test'
    a.execute(form)
    expect(a.unapply.mock.calls.length).toBe(0)
    expect(a.apply.mock.calls.length).toBe(1)
  })
})

describe('RemoveField', () => {
  const dom = new JSDOM(`
  <html><body><form>
    <div id="name-container">
      <input id="id_name" name="name" />
      <label for="id_name">Name</label>
    </div>
  </form></body></html>
  `)

  let formElement = dom.window.document.querySelector('form')
  let form = new Form(formElement)

  function makeField() {
    let field = form.field('name')
    field.hide = jest.fn()
    field.show = jest.fn()
    return field
  }

  test('apply()', () => {
    let field = makeField()
    let a = new actions.RemoveField([], 'name')
    a.apply(form)
    expect(field.hide.mock.calls.length).toEqual(1)
    expect(field.show.mock.calls.length).toEqual(0)
  })

  test('unapply()', () => {
    let field = makeField()
    let a = new actions.RemoveField([], 'name')
    a.unapply(form)
    expect(field.show.mock.calls.length).toEqual(1)
    expect(field.hide.mock.calls.length).toEqual(0)
  })
})

describe('RemoveChoices', () => {
  const dom = new JSDOM(`
  <html><body><form>
    <div id="name-container">
      <select id="id_name" name="name">
        <option value="a">A</option>
        <option selected="selected" value="b">B</option>
      </select>
      <label for="id_name">Name</label>
    </div>
  </form></body></html>
  `)

  let formElement = dom.window.document.querySelector('form')
  let form = new Form(formElement)
  let a = new actions.RemoveChoices([], 'name', ['a'])

  test('constructor()', () => {
    expect(a.choices).toEqual(['a'])
    expect(a.conditions).toEqual([])
  })

  test('apply()', () => {
    a.apply(form)
  })

  test('unapply()', () => {
    a.unapply(form)
  })
})
