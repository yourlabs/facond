import { JSDOM } from 'jsdom'
import { Form } from './form'
import * as ddf from './index'

const dom = () => new JSDOM(`
<html><body><form>
  <div id="name-container">
    <input id="id_name" name="name" />
    <label for="id_name">Name</label>
  </div>
</form></body></html>
`)

describe('Form', () => {
  test('fieldContainerElement()', () => {
    let form = new Form(dom().window.document.querySelector('form'))
    expect(form.fieldContainerElement('name').id).toBe('name-container')
  })
})
