class Action {
  constructor(conditions) {
    this.conditions = conditions
  }

  apply(form, field) {
    console.log('apply()', form, field)
  }
}

export default {
  action: {
    Action: Action
  }
}
