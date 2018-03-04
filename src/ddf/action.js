import debug from 'debug'

var log = debug('ddf.action')

class Action {
  constructor(conditions) {
    this.conditions = conditions || []
  }

  execute(field) {
    let method = 'apply'

    for (var i=0; i<this.conditions.length; i++) {
      if (!this.conditions[i].validate(field.form)) {
        method = 'unapply'
        break
      }
    }

    log(this, '.', method, '(', field, ')')
    this[method](field)
  }
}

// Remove a field from a form.
class Remove extends Action {
  // Hide the field.
  apply(field) {
    field.hide()
  }

  // Show the field.
  unapply(field) {
    field.show()
  }
}

// Remove given choices from a field.
class RemoveChoices extends Action {
  constructor(conditions, choices) {
    super(conditions)
    this.choices = choices
  }

  // Hide options which are not in this.choices from a field.
  apply(field) {
    if (this.choices.indexOf(field.value) >= 0) {
      field.valueClear()
    }

    for (let i=0; i < field.element.options.length; i++) {
      if (this.choices.indexOf(field.element.options[i].value) >= 0) {
        field.element.options[i].classList.add('ddf-hide')
      }
    }
  }

  // Show options which are not in this.choices from a field.
  unapply(field) {
    for (let i=0; i < field.element.options.length; i++) {
      if (!this.choices.indexOf(field.element.options[i].value)) {
        field.element.options[i].classList.remove('ddf-hide')
      }
    }
  }
}

export {
  Action,
  Remove,
  RemoveChoices
}
