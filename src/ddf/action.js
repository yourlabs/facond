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

export default {
  action: {
    Action: Action
  }
}
