import debug from 'debug'

var log = debug('ddf.action')

class Action {
  constructor(conditions) {
    this.conditions = conditions || []
  }

  execute(form, field) {
    let method = 'apply'

    for (var i=0; i<this.conditions.length; i++) {
      if (!this.conditions[i].validate(form)) {
        method = 'unapply'
        break
      }
    }

    log(this, '.', method, '(', form, ',', field, ')')
    this[method](form, field)
  }
}

// Remove a field from a form.
class Remove extends Action {
  // Hide the field.
  apply(form, field) {
    form.fieldHide(field)
  }

  // Show the field.
  unapply(form, field) {
    form.fieldShow(field)
  }
}

// Remove given choices from a field.
class RemoveChoices extends Action {
  constructor(choices) {
    super()
    this.choices = choices
  }

  // Hide options which are not in this.choices from a field.
  apply(form, field) {
    if (this.choices.indexOf(form.fieldValueGet(field)) >= 0) {
      form.fieldValueClear(field)
    }

    form.fieldElement(field).find('option').each(function() {
      if (this.choices.indexOf($(this).attr('value')) >= 0) {
        $(this).hide()
      }
    })
  }

  // Show options which are not in this.choices from a field.
  unapply(form, field) {
    form.fieldElement(field).find('option').each(function() {
      if (!$(this).attr('value').indexOf(this.choices)) {
        $(this).show()
      }
    })
  }
}

export {
  Action,
  Remove,
  RemoveChoices
}
