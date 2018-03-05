import debug from 'debug'

var log = debug('facond.rule')

/**
 * Validate if a field has a given value.
 */
class ValueIs {
  /**
   * @param field Name of the field to test.
   * @param value Value to test.
   */
  constructor(field, value) {
    this.field = field
    this.value = value
  }

  /**
   * Return true if the field's value is this.value
   */
  validate(form) {
    let valid = form.field(this.field).value == this.value
    log('[Condition]', this, '.validate(', form, ') = ', valid)
    return valid
  }
}

export {
  ValueIs,
}
