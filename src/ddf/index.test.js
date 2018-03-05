/* global describe, jest, test, expect */
import { JSDOM } from 'jsdom'
import * as ddf from './index'

const formConfiguration = {
  'cls': 'ddf.forms.Form',
  'prefix': '',
  'fields': {
    'title': {
      'cls': 'ddf.forms.Field',
    },
    'name': {
      'cls': 'ddf.forms.Field',
    },
    'kind': {
      'cls': 'ddf.forms.Field',
    }
  },
  'actions': [
    {
      'cls': 'ddf.actions.Remove',
      'field': 'title',
      'conditions': [
        {
          'cls': 'ddf.conditions.ValueIs',
          'field': 'kind',
          'value': 'nonprofit'
        }
      ]
    }
  ]
}

const formConfigurationJSON = JSON.stringify(formConfiguration)

describe('JsDictClsRegistry', () => {
  let registry = new ddf.JsDictClsRegistry()
  registry.register('foo.bar', {a: 123})
  expect(registry.get('foo.bar.a')).toEqual(123)
})

describe('convert(single values)', () => {
  test('null', () => {
    expect(ddf.convert(null)).toBe(null)
  })
  test('undefined', () => {
    expect(ddf.convert(undefined)).toBe(undefined)
  })
  test('string', () => {
    expect(ddf.convert('aoeu')).toBe('aoeu')
  })
  test('list', () => {
    expect(ddf.convert([])).toEqual([])
  })
  test('dict', () => {
    expect(ddf.convert({'foo': 'bar'})).toEqual({'foo': 'bar'})
  })
  test('instance', () => {
    let expected = new ddf.forms.Field()
    expected.cls = 'ddf.forms.Field'
    expect(ddf.convert({'cls': 'ddf.forms.Field'})).toEqual(expected)
  })
})

describe('convert(complex structure)', () => {
  let subject = {
    'cls': 'ddf.forms.Form',
    'str': 'a',
    'int': 1,
    'null': null,
    'false': false,
    'true': true,
    'undefined': undefined,
    'list': [1],
    'dict': {1: 2},
    'obj': {'cls': 'ddf.forms.Field'},
    'objlist': [
      {'cls': 'ddf.forms.Field'}
    ],
    'objdict': {
      foo: {'cls': 'ddf.forms.Field'}
    }
  }
  let result = ddf.convert(subject)

  test('instanciate a cls', () => {
    expect(result).toBeInstanceOf(ddf.forms.Form)
  })

  test('with a list attribute', () => {
    expect(result.list).toEqual([1])
  })

  test('with a str attribute', () => {
    expect(result.str).toEqual('a')
  })

  test('with a int attribute', () => {
    expect(result.int).toEqual(1)
  })

  test('with a null attribute', () => {
    expect(result.null).toEqual(null)
  })

  test('with a undefined attribute', () => {
    expect(result.undefined).toEqual(undefined)
  })

  test('with a bool true attribute', () => {
    expect(result.true).toEqual(true)
  })

  test('with a bool false attribute', () => {
    expect(result.false).toEqual(false)
  })

  test('with a dict attribute', () => {
    expect(result.dict).toEqual({1: 2})
  })

  let expected = new ddf.forms.Field()
  expected.cls = 'ddf.forms.Field'

  test('with an obj attribute', () => {
    expect(result.obj).toEqual(expected)
  })

  test('with an obj list attribute', () => {
    expect(result.objdict.foo).toEqual(expected)
  })

  test('with an obj dict attribute', () => {
    expect(result.objdict.foo).toEqual(expected)
  })
})

describe('JsDictClsRegistry.get()', () => {
  test('ddf.forms.Form', () => {
    expect(ddf.jsRegistry.get('ddf.forms.Form')).toBe(ddf.forms.Form)
  })
  test('ddf.actions.Action', () => {
    expect(ddf.jsRegistry.get('ddf.actions.Action')).toBe(ddf.actions.Action)
  })
  test('ddf.actions.Remove', () => {
    expect(ddf.jsRegistry.get('ddf.actions.Remove')).toBe(ddf.actions.Remove)
  })
  test('ddf.conditions.ValueIs', () => {
    expect(ddf.jsRegistry.get('ddf.conditions.ValueIs')).toBe(ddf.conditions.ValueIs)
  })
})

describe('instanciate()', () => {
  let result = ddf.instanciate(formConfiguration)

  test('should instanciate a recursive tree', () => {
    expect(result.prefix).toBe('')
    expect(result.actions.length).toBe(1)
    expect(result.actions[0].conditions.length).toBe(1)
    expect(result.actions[0].conditions[0].field).toBe('kind')
    expect(result.actions[0].conditions[0].value).toBe('nonprofit')
    expect(result.fields['name']).toBeInstanceOf(ddf.forms.Field)
    expect(result.fields['title']).toBeInstanceOf(ddf.forms.Field)
  })
})

describe('setup()', () => {
  const dom = () => new JSDOM(`
  <html><body><form>
    <div>
     <div id="name-container">
       <input id="id_name" name="name" />
       <label for="id_name">Name</label>
     </div>
     <div>
       <input id="id_title" name="title" />
       <label for="id_title">Title</label>
     </div>
     <div>
       <input type="radio" id="id_kind_corporate" name="kind">
       <label for="id_kind_corporate">Corporate</label>
     </div>
     <div>
       <input type="radio" id="id_kind_nonprofit" name="kind">
       <label for="id_kind_nonprofit">Corporate</label>
     </div>
    </div>
    <script type="text/ddf-configuration">
      ${formConfigurationJSON}
    </script>
  </form></body></html>
  `)

  test('should bind form', () => {
    let domFixture = dom()
    let script = domFixture.window.document.querySelector('script')
    let form = ddf.setup(script)
    expect(form.element).toBe(domFixture.window.document.querySelector('form'))
  })
})
