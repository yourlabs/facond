import debug from 'debug'

var log = debug('facond.action')

/**
 * Apply a reversible action on the DOM if conditions apply, unapply otherwise.
 */
class Action {
  /**
  * @param conditions List of :js:cls:`Condition` objects
  */
  constructor(conditions) {
    this.conditions = conditions || []
  }

  /**
   * Call :js:meth:`apply()` if conditions validate, :js:meth:`unapply` otherwise.
   *
   * @param form :js:class:`Form` object to execute on.
   */
  execute(form) {
    let method = 'apply'

    for (var i=0; i<this.conditions.length; i++) {
      if (!this.conditions[i].validate(form)) {
        method = 'unapply'
        break
      }
    }

    log(this, '.', method, '(', this.field, ')')
    this[method](form)
  }

  /**
   * Modify the DOM, should save the state for :js:meth:`unapply()`.
   *
   * @param form :js:class:`Form` object to apply on.
   */
  apply(form) { // eslint-disable-line no-unused-vars
    console.log('not implemented')
  }

  /**
   * Restore the DOM prior to :js:meth:`apply()` call.
   *
   * @param form :js:class:`Form` object to unapply on.
   */
  unapply(form) { // eslint-disable-line no-unused-vars
    console.log('not implemented')
  }
}

/**
 * Remove a field from a form.
 */
class RemoveField extends Action {
  /**
  * @param conditions List of :js:class:`Condition` objects
  * @param :js:class:`Field` Subject Field instance.
  */
  constructor(conditions, field) {
    super(conditions)
    this.field = field
  }

  // Hide the field.
  apply(form) {
    form.field(this.field).hide()
  }

  // Show the field.
  unapply(form) {
    form.field(this.field).show()
  }
}


class ChoicesAction extends Action {
  /**
  * @param conditions List of :js:class:`Condition` objects
  */
  constructor(conditions, field, choices) {
    super(conditions)
    this.field = field
    this.choices = choices
  }

  // Hide options which are not in this.choices from a field.
  apply(form) {
    let field = form.field(this.field)

    if (!this.validate(field.value)) {
      field.valueReset()
    }

    for (let i=0; i < field.element.options.length; i++) {
      if (this.validate(field.element.options[i].value)) {
        field.element.options[i].classList.remove('facond-hide')
      } else {
        let option = field.element.options[i]
        option.classList.add('facond-hide')
        option.selected = false
      }
    }

    if (!field.multiple) {
      // If selected value was removed, empty the field
      if (!this.validate(field.value)) {
        let empty = field.element.querySelector('option[value=""]')
        if (empty === undefined) {
          field.element.prepend('<option value=""></option>')
        }
        field.value = ''
      }
    }
  }
}


/**
 * Remove given choices from a field.
 */
class RemoveChoices extends ChoicesAction {
  validate(value) {
    return this.choices.indexOf(value) < 0
  }

  // Show options which are not in this.choices from a field.
  unapply(form) {
    let  field = form.field(this.field)

    for (let i=0; i < field.element.options.length; i++) {
      if (!this.choices.indexOf(field.element.options[i].value)) {
        field.element.options[i].classList.remove('facond-hide')
      }
    }
  }
}

class SetChoices extends ChoicesAction {
  validate(value) {
    return this.choices.indexOf(value) >= 0
  }
}

export {
  Action,
  ChoicesAction,
  RemoveChoices,
  SetChoices,
  RemoveField,
}
