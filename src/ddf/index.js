import $ from 'jquery'
import debug from 'debug'

var log = debug('ddf')

function instanciate(attrs) {
  let cls = ddf.getClass(attrs.cls)
  let obj = new cls()

  for (let key in attrs) {
    let value = attrs[key]

    if (attrs[key] === undefined || attrs[key] === null) {
      obj[key] = value
    } else if (value instanceof Array && value.length && value[0].cls !== undefined) {
      obj[key] = value.map(ddf.instanciate)
    } else if (attrs[key].cls !== undefined) {
      obj[key] = ddf.instanciate(attrs)
    } else {
      obj[key] = value
    }
  }

  log('Instanciated', obj)
  return obj
}

function getClass(name) {
  log('getClass', name)

  let parts = name.split('.')
  let pkg = parts[0]
  let map = {
    ddf: './'
  }
  let path = map['ddf'] + parts[1]
  let classname = parts[2]
  import { * } as tmp from path
  let cls = tmp[classname]

  log('Found', cls, 'for', name)
  return cls
}

$(document).ready(function() {
  $.fn.ddf = function(configuration) {
    let form = ddf.instanciate(configuration)
    form.bind($(this))
    form.update()
  }

  $('script[type="text/ddf-configuration"]').each(function() {
    $(this).parents('form').ddf(JSON.parse($(this).text()))
  })
})

export {
  instanciate,
  getClass,
}
