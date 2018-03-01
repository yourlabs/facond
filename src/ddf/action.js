class Action {
  constructor(conditions) {
    this.conditions = conditions || []
  }

  apply(form, field) {
    let method = 'apply';

    for (var i=0; i<this.conditions.length; i++) {
        if (!this.conditions[i].validate(form)) {
            method = 'unapply';
            break;
        }
    }

    if (ddf.debug) console.log('[Action] ', this, '.', method, '(', form, ',', field, ')');
    this[method](form, field);
  }
}

// Remove a field from a form.
class Remove extends Action {
  // Hide the field.
  apply(form, field) {
    form.fieldHide(field);
  }

  // Show the field.
  unapply(form, field) {
    form.fieldShow(field);
  }
}

// Remove given choices from a field.
class RemoveChoices extends Action {
  constructor(choices) {
    this.choices = choices;
  }

  // Hide options which are not in this.choices from a field.
  apply(form, field) {
    choices = this.choices;

    if (choices.indexOf(form.fieldValueGet(field)) >= 0) {
      form.fieldValueClear(field);
    }

    form.fieldGet(field).find('option').each(function() {
      if (choices.indexOf($(this).attr('value')) >= 0) {
         $(this).hide();
      }
    });
  }

  // Show options which are not in this.choices from a field.
  unapply(form, field) {
    choices = this.choices;
    form.fieldGet(field).find('option').each(function() {
        if (!$(this).attr('value').indexOf(choices)) {
            $(this).show();
        }
    });
  }
}

export default {
  Action: Action,
  Remove: Remove,
  RemoveChoices: RemoveChoices
}
