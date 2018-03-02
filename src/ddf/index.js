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

function instanciate(attrs) {
  let cls = getClass(attrs.cls)
  log(cls)
  let obj = new cls()

  for (let key in attrs) {
    let value = attrs[key]

    if (attrs[key] === undefined || attrs[key] === null) {
      obj[key] = value
    } else if (value instanceof Array && value.length && value[0].cls !== undefined) {
      obj[key] = value.map(instanciate)
    } else if (attrs[key].cls !== undefined) {
      obj[key] = instanciate(attrs)
    } else {
      obj[key] = value
    }
  }

  log('Instanciated', obj)
  return obj
}

function setup(script) {
  // instanciate a form with the configuration in the script tag
  let form = instanciate(JSON.parse(script.textContent))

  // bind parent element as form
  form.form = script.parentElement

  // bind configured Form instance to form element
  form.bind()

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
  instanciate,
  getClass,
  action,
  condition,
  form,
  rule,
  setup
}
