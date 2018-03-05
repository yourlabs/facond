/* global describe, jest, test, expect */
import { JSDOM } from 'jsdom'
import * as facond from './index'

const formConfiguration = {
  'cls': 'facond.forms.Form',
  'prefix': '',
  'fields': {
    'title': {
      'cls': 'facond.forms.Field',
    },
    'name': {
      'cls': 'facond.forms.Field',
    },
    'kind': {
      'cls': 'facond.forms.Field',
    }
  },
  'actions': [
    {
      'cls': 'facond.actions.RemoveField',
      'field': 'title',
      'conditions': [
        {
          'cls': 'facond.conditions.ValueEqual',
          'field': 'kind',
          'value': 'nonprofit'
        }
      ]
    }
  ]
}

const formConfigurationJSON = JSON.stringify(formConfiguration)

describe('JsDictClsRegistry', () => {
  let registry = new facond.JsDictClsRegistry()
  registry.register('foo.bar', {a: 123})
  expect(registry.get('foo.bar.a')).toEqual(123)
})

describe('convert(single values)', () => {
  test('null', () => {
    expect(facond.convert(null)).toBe(null)
  })
  test('undefined', () => {
    expect(facond.convert(undefined)).toBe(undefined)
  })
  test('string', () => {
    expect(facond.convert('aoeu')).toBe('aoeu')
  })
  test('list', () => {
    expect(facond.convert([])).toEqual([])
  })
  test('dict', () => {
    expect(facond.convert({'foo': 'bar'})).toEqual({'foo': 'bar'})
  })
  test('instance', () => {
    let expected = new facond.forms.Field()
    expected.cls = 'facond.forms.Field'
    expect(facond.convert({'cls': 'facond.forms.Field'})).toEqual(expected)
  })
})

describe('convert(complex structure)', () => {
  let subject = {
    'cls': 'facond.forms.Form',
    'str': 'a',
    'int': 1,
    'null': null,
    'false': false,
    'true': true,
    'undefined': undefined,
    'list': [1],
    'dict': {1: 2},
    'obj': {'cls': 'facond.forms.Field'},
    'objlist': [
      {'cls': 'facond.forms.Field'}
    ],
    'objdict': {
      foo: {'cls': 'facond.forms.Field'}
    }
  }
  let result = facond.convert(subject)

  test('instanciate a cls', () => {
    expect(result).toBeInstanceOf(facond.forms.Form)
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

  let expected = new facond.forms.Field()
  expected.cls = 'facond.forms.Field'

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
  test('facond.forms.Form', () => {
    expect(facond.jsRegistry.get('facond.forms.Form')).toBe(facond.forms.Form)
  })
  test('facond.actions.Action', () => {
    expect(facond.jsRegistry.get('facond.actions.Action')).toBe(facond.actions.Action)
  })
  test('facond.actions.RemoveField', () => {
    expect(facond.jsRegistry.get('facond.actions.RemoveField')).toBe(facond.actions.RemoveField)
  })
  test('facond.conditions.ValueEqual', () => {
    expect(facond.jsRegistry.get('facond.conditions.ValueEqual')).toBe(facond.conditions.ValueEqual)
  })
})

describe('instanciate()', () => {
  let result = facond.instanciate(formConfiguration)

  test('should instanciate a recursive tree', () => {
    expect(result.prefix).toBe('')
    expect(result.actions.length).toBe(1)
    expect(result.actions[0].conditions.length).toBe(1)
    expect(result.actions[0].conditions[0].field).toBe('kind')
    expect(result.actions[0].conditions[0].value).toBe('nonprofit')
    expect(result.fields['name']).toBeInstanceOf(facond.forms.Field)
    expect(result.fields['title']).toBeInstanceOf(facond.forms.Field)
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
    <script type="text/facond-configuration">
      ${formConfigurationJSON}
    </script>
  </form></body></html>
  `)

  test('should bind form', () => {
    let domFixture = dom()
    let script = domFixture.window.document.querySelector('script')
    let form = facond.setup(script)
    expect(form.element).toBe(domFixture.window.document.querySelector('form'))
  })
})
