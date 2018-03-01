// A Rule has actions for a field.
class Rule {
  constructor(field, actions) {
    this.field = field
    this.actions = actions
  }

  // Execute all actions of this rule.
  apply(form) {
    if (ddf.debug) console.log('[Rule]', this, '.apply(', form, ')')
    for (var i=0; i<this.actions.length; i++) {
      this.actions[i].execute(form, this.field)
    }
  }
}

export default {
  Rule: Rule,
}
