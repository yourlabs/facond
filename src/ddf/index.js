import * as form from './form'
import * as action from './action'
import * as rule from './rule'
import * as condition from './condition'

import debug from 'debug'

var log = debug('ddf')

function getClass(name) {
  log('getClass(%s)', name)

  let parts = name.split('.')
  let map = {
    ddf: './'
  }
  let pkg = parts[0]
  let path = map[pkg] + parts[1]
  let classname = parts[2]
  var tmp = require(path)
  let cls = tmp[classname]

  if (cls === undefined) {
    throw 'Could not load ' + name
  }

  return cls
}

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
  let cls = getClass(attrs.cls)
  let obj = new cls()

  for (let key in attrs) {
    obj[key] = convert(attrs[key])
  }

  log('Instanciated', obj)
  return obj
}

function setup(script) {
  // instanciate a form with the configuration in the script tag
  let form = instanciate(JSON.parse(script.textContent))

  // bind configured Form instance to form element
  form.bind(script.parentElement)

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
  getClass,
  action,
  condition,
  form,
  rule,
  setup
}
