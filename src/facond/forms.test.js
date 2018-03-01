import { JSDOM } from 'jsdom'
import { Field, Form } from './forms'

let dom = new JSDOM(`
  <html><body><form>
    <div id="name-container">
      <input id="id_name" name="name" />
      <label for="id_name">Name</label>
    </div>
  </form></body></html>
`)
let formElement = dom.window.document.querySelector('form')
let fieldElement = formElement.querySelector('#id_name')
let labelElement = formElement.querySelector('label[for=id_name]')
let containerElement = formElement.querySelector('#name-container')

describe('Form', () => {
  let form = new Form(formElement)

  test('field()', () => {
    let result = form.field('name')

    expect(result).toBeInstanceOf(Field)
    expect(result.form).toEqual(form)
    expect(result.element).toEqual(fieldElement)
  })

  test('prefix should always be a string', () => {
    form.prefix = null
    expect(form.prefix).toEqual('')
  })
})

describe('Field no prefix', () => {
  let form = new Form(formElement, [], null)
  let field = new Field(form, 'name')

  test('selector', () => {
    expect(field.selector).toEqual('[name=name]')
  })

  test('element', () => {
    expect(field.element).toEqual(fieldElement)
  })

  test('labeElement', () => {
    expect(field.labelElement).toEqual(labelElement)
  })

  test('containerElement', () => {
    expect(field.containerElement).toEqual(containerElement)
  })

  test('value', () => {
    expect(field.value).toEqual('')
    field.value = 'test'
    expect(field.value).toEqual('test')
  })
})

describe('Field with prefix', () => {
  let form = new Form(formElement, [], 'test')
  let field = new Field(form, 'name')

  test('selector', () => {
    expect(field.selector).toEqual('[name=test-name]')
  })
})

describe('select Field', () => {
  function fixture(multiple) {
    multiple = multiple === true ? 'multiple' : ''
    const dom = new JSDOM(`
    <html><body><form>
      <div id="name-container">
        <select id="id_name" multiple="${multiple}" name="name">
          <option value="a">A</option>
          <option selected="selected" value="b">B</option>
        </select>
        <label for="id_name">Name</label>
      </div>
    </form></body></html>
    `)

    let formElement = dom.window.document.querySelector('form')
    let form = new Form(formElement)
    return form.field('name')
  }

  test('single value', () => {
    let field = fixture()
    expect(field.value).toEqual('b')
    expect(field.element.value).toEqual('b')
  })

  test('set single value', () => {
    let field = fixture()
    field.value = 'a'
    expect(field.value).toEqual('a')
    expect(field.element.value).toEqual('a')
  })

  test('get multiple value', () => {
    let field = fixture(true)
    expect(field.value).toEqual(['b'])
    expect(field.element.selectedOptions.length).toEqual(1)
  })

  test('set multiple value', () => {
    let field = fixture(true)
    field.value = ['a', 'b']
    expect(field.value).toEqual(['a', 'b'])
    expect(field.element.selectedOptions.length).toEqual(2)
  })
})
