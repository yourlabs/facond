import debug from 'debug'

var log = debug('facond.action')

/**
 * Execute if conditions apply.
 */
class Action {
  constructor(field, conditions) {
    this.field = field
    this.conditions = conditions || []
  }

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
}

// Remove a field from a form.
class Remove extends Action {
  // Hide the field.
  apply(form) {
    form.field(this.field).hide()
  }

  // Show the field.
  unapply(form) {
    form.field(this.field).show()
  }
}

// Remove given choices from a field.
class RemoveChoices extends Action {
  constructor(field, conditions, choices) {
    super(conditions)
    this.field = field
    this.choices = choices
  }

  // Hide options which are not in this.choices from a field.
  apply(form) {
    let field = form.field(this.field)

    if (this.choices.indexOf(field).value >= 0) {
      field.valueReset()
    }

    for (let i=0; i < field.element.options.length; i++) {
      if (this.choices.indexOf(field.element.options[i].value) >= 0) {
        let option = field.element.options[i]
        option.classList.add('facond-hide')
        option.selected = false
      }
    }

    if (!field.multiple) {
      // If selected value was removed, empty the field
      if (this.choices.indexOf(field.value) >= 0) {
        let empty = field.element.querySelector('option[value=""]')
        if (empty === undefined) {
          field.element.prepend('<option value=""></option>')
        }
        field.value = ''
      }
    }
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

export {
  Action,
  Remove,
  RemoveChoices
}
