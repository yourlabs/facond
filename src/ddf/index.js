import $ from "jquery"

function instanciate(attrs) {
  let cls = ddf.getClass(attrs.cls);
  let obj = new cls();

  for (key in attrs) {
      let value = attrs[key];

      if (attrs[key] === undefined || attrs[key] === null) {
          obj[key] = value;
      } else if (value instanceof Array && value.length && value[0].cls !== undefined) {
          obj[key] = value.map(ddf.instanciate);
      } else if (attrs[key].cls !== undefined) {
          obj[key] = ddf.instanciate(attrs);
      } else {
          obj[key] = value;
      }
  }

  if (ddf.debug) console.log('Instanciated', obj);
  return obj;
}

function getClass(name) {
  debugger
  let parts = name.split('.');
  let leaf = window;

  for(var i=0; i<parts.length; i++) {
      leaf = leaf[parts[i]];
  }

  if (ddf.debug) console.log('Found', leaf, 'for', name);
  return leaf
}

$(document).ready(function() {
  $.fn.ddf = function(configuration) {
    let form = ddf.instanciate(configuration);
    form.bind($(this));
    form.update();
  }

  $('script[type="text/ddf-configuration"]').each(function() {
    $(this).parents('form').ddf(JSON.parse($(this).text()));
  });
})

export {
  instanciate,
  getClass,
}
