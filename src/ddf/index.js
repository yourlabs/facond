import * as forms from './forms'
import * as actions from './actions'
import * as conditions from './conditions'

import debug from 'debug'

var log = debug('ddf')

class JsDictClsRegistry {
  constructor() {
    this.modules = {}
  }

  register(name, module) {
    this.modules[name] = module
  }

  get(name) {
    let parts = name.split('.')
    let className = parts.slice(-1)[0]
    let moduleName = parts.slice(0, -1).join('.')
    let module = this.modules[moduleName]
    return module[className]
  }
}

var jsRegistry = window.jsRegistry = new JsDictClsRegistry()
window.jsRegistry.register('ddf.actions', actions)
window.jsRegistry.register('ddf.conditions', conditions)
window.jsRegistry.register('ddf.forms', forms)

function convert(value) {
  if (value === undefined || value === null) {
    // inhibit further type and attribute checks
    return value
  } else if (value.cls !== undefined) {
    return instanciate(value)
  } else if (Array.isArray(value)) {
    return value.map(convert)
  } else if (value && typeof value === 'object' && value.constructor === Object) {
    let newvalue = {}
    for (let key in value) {
      newvalue[key] = convert(value[key])
    }
    return newvalue
  } else {
    return value
  }
}

function instanciate(attrs) {
  let cls = jsRegistry.get(attrs.cls)
  let obj = new cls()

  for (let key in attrs) {
    obj[key] = convert(attrs[key])
  }

  log('Instanciated', obj)
  return obj
}

function setup(script) {
  // ensure a ddf-hide class exists
  if (!window.document.getElementById('ddf-style')) {
    let style = window.document.createElement('style')
    style.type = 'text/css'
    style.id = 'ddf-style'
    style.innerHTML = '.ddf-hide { display: none; }'
    window.document.getElementsByTagName('head')[0].appendChild(style)
  }

  // instanciate a form with the configuration in the script tag
  let form = instanciate(JSON.parse(script.textContent))

  // bind configured Form instance to form element
  let htmlElement = script
  while (htmlElement = htmlElement.parentElement)
    if (htmlElement.matches('form')) break

  form.bind(htmlElement)

  // trigger initial form setup
  form.update()

  return form
}

document.addEventListener('DOMContentLoaded', function() {
  for (let script of document.querySelectorAll('script[type="text/ddf-configuration"]')) {
    setup(script)
  }
})

export {
  convert,
  instanciate,
  jsRegistry,
  JsDictClsRegistry,
  actions,
  conditions,
  forms,
  setup
}
