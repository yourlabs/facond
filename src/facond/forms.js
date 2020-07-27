import debug from 'debug'

var log = debug('facond.form')

/**
 * Field
 */
class Field {
  constructor(form, name) {
    this.form = form
    this.name = name
  }

  get multiple() {
    // i can't believe this thing always return true, even on non multiple selects
    // this.element.multiple === true
    return this.element.attributes.multiple && this.element.attributes.multiple.value === 'multiple'
  }

  get selector() {
    return '[name=' + this.form.prefix + this.name + ']'
  }

  get element() {
    var result = this.form.element.querySelector(this.selector)
    if (result === undefined || result === null || result.name === undefined) {
      throw 'element ' + this.name + ' not found in ' + this.form.element
    }
    return result
  }

  get value() {
    let value = this.element.value

    if (this.multiple) {
      // wait until es7.comphrensions reach stage 2
      value = []
      for (let option of this.element.querySelectorAll('[selected=selected]'))
        value.push(option.value)
    }

    if (this._valueInitial === undefined) this._valueInitial = value
    return value
  }

  get values() {
    return this.multiple ? this.value : [this.value]
  }

  set value(value) {
    if (this.multiple) {
      let options = this.element.querySelectorAll('option')
      for (let i=0; i < options.length; i++) {
        let option = options[i]
        if (value.indexOf(option.value) >= 0)
          option.setAttribute('selected', 'selected')
        else
          option.removeAttribute('selected')
      }
    } else {
      this.element.value = value
    }
  }

  valueReset() {
    this.element.value = this._valueInitial
  }

  get labelSelector() {
    return 'label[for=' + this.element.id + ']'
  }

  get labelElement() {
    return this.form.element.querySelector(this.labelSelector)
  }

  get containerElement() {
    let htmlElement = this.element
    while (htmlElement = htmlElement.parentNode)
      if (htmlElement.querySelector(this.labelSelector) != undefined)
        return htmlElement
  }

  hide() {
    this.required = this.element.required
    this.containerElement.classList.add('facond-hide')
    this.element.required = false
  }

  show() {
    if (this.element.required)
      this.element.required = true
    this.containerElement.classList.remove('facond-hide')
    // might have been set on rendering
    this.element.classList.remove('facond-hide')
  }
}

/**
 * Form
 */
class Form {
  // A Form matches the Form instance in Django, has a form htmlElement, a
  // prefix and rules.
  constructor(element, rules, prefix) {
    this.element = element
    this.rules = rules
    this.prefix = prefix
    this.fields = {}
  }

  set prefix(value) {
    this._prefix = value || ''
  }

  get prefix() {
    return this._prefix ? this._prefix + '-' : ''
  }

  field(name) {
    // Make it up if it doesn't exist
    if (this.fields[name] === undefined)
      this.fields[name] = new Field(this, name)

    // Compensate for dumb hydratation done from JSON dict
    if (this.fields[name].form === undefined)
      this.fields[name].form = this
    if (this.fields[name].name === undefined)
      this.fields[name].name = name

    return this.fields[name]
  }

  // Update the form on instanciation to start with a clean state.
  bind(formElement) {
    // compensate for dumb json hydratation
    if (formElement !== undefined) this.element = formElement
    let update = this.update.bind(this)
    this.element.addEventListener('input', update)
  }

  // Update the UI.
  update() {
    console.log('[Form] ', this, '.update()')

    for (var i=0; i<this.actions.length; i++) {
      this.actions[i].execute(this)
    }
  }
}

export { Field, Form }
