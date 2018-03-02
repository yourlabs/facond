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

function setup() {
  $.fn.ddf = function(configuration) {
    let form = instanciate(configuration)
    form.bind($(this))
    form.update()
  }

  $('script[type="text/ddf-configuration"]').each(function() {
    $(this).parents('form').ddf(JSON.parse($(this).text()))
  })
}

$(document).ready(setup)

export {
  instanciate,
  getClass,
  action,
  condition,
  form,
  rule,
  setup
}
