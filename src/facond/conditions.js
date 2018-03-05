import debug from 'debug'

var log = debug('facond.rule')


/**
 * Condition interface.
 */
class Condition {
  /**
   * Return true if this condition passes on this form.
   *
   * @param form :js:class:`Form` object to execute on.
   */
  validate(form) { // eslint-disable-line no-unused-vars
    'not implemented'
  }
}

/**
 * Validate if a field has a given value.
 */
class ValueEqual {
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
  Condition,
  ValueEqual,
}
