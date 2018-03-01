import $ from 'jquery'
import debug from 'debug'

var log = debug('ddf.form')

class Form {
  constructor(rules, prefix) {
    this.rules = rules
    this.prefix = prefix
  }

  // A Form matches the Form instance in Django, has a jQuery form object, a
  // prefix and rules.
  //
  // Update the form on instanciation to start with a clean state.
  bind(form) {
    this.form = $(form)
    form.on('change', ':input', $.proxy(this.update, this))
  }

  // Return the jQuery field instance for a field name.
  fieldGet(field) {
    let prefix = this.prefix ? this.prefix : ''
    return this.form.find(':input[name=' + prefix + field + ']')
  }

  // Return the jQuery field label instance for a field name.
  fieldLabelGet(field) {
    return $('label[for=' + this.fieldGet(field).attr('id') + ']')
  }

  // Return the jQuery field container for a field name, it's the element that
  // contains both the field and label.
  fieldContainerGet(field) {
    return this.fieldGet(field).parents().has(this.fieldLabelGet(field)).first()
  }

  // Return the value of a field by name.
  fieldValueGet(field) {
    return this.fieldGet(field).val()
  }

  // Clear the value of a field by name.
  fieldValueClear(field) {
    return this.fieldGet(field).val('')
  }

  // Hide a field container.
  fieldHide(field) {
    return this.fieldContainerGet(field).hide()
  }

  // Show a field container.
  fieldShow(field) {
    return this.fieldContainerGet(field).show()
  }

  // Update the UI.
  update() {
    log('[Form] ', this, '.update()')

    for (var i=0; i<this.rules.length; i++) {
      this.rules[i].apply(this)
    }
  }
}

export { Form }
