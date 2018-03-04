import debug from 'debug'

var log = debug('ddf.rule')

// A Rule has actions for a field.
class Rule {
  constructor(field, actions) {
    this.field = field
    this.actions = actions
  }

  // Execute all actions of this rule.
  apply(form) {
    log('[Rule]', this, '.apply(', form, ')')
    for (var i=0; i<this.actions.length; i++) {
      this.actions[i].execute(form.field(this.field))
    }
  }
}

export {
  Rule,
}
