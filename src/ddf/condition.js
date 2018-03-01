import debug from 'debug'

var log = debug('ddf.rule')

// Validate if a field has a given value.
class ValueIs {
  constructor(field, value) {
    this.field = field
    this.value = value
  }

  // Return true if the field's value is this.value
  validate(form) {
    let valid = form.fieldValueGet(this.field) == this.value
    log('[Condition]', this, '.validate(', form, ') = ', valid)
    return valid
  }
}

export {
  ValueIs,
}
