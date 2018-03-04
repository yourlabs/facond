import debug from 'debug'

var log = debug('ddf.form')

class Field {
  constructor(form, name) {
    this.form = form
    this.name = name
  }

  get selector() {
    return '[name=' + this.form.prefix + this.name + ']'
  }

  get element() {
    var result = this.form.element.querySelector(this.selector)
    if (! result instanceof HTMLElement) {
      throw 'element ' + this.name + ' not found in ' + this.form.element
    }
    return result
  }

  get value() {
    let value = this.element.value
    if (this.element.attributes.multiple) {
      // wait until es7.comphrensions reach stage 2
      value = []
      for (let option of this.element.selectedOptions) value.push(option.value)
    }

    if (this._valueInitial === undefined) this._valueInitial = value
    return value
  }

  set value(value) {
    if (this.element.attributes.multiple) {
      let options = this.element.querySelectorAll('option')
      for (let i=0; i < options.length; i++) {
        options[i].selected = value.indexOf(options[i].value) > 0
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
    this.containerElement.classList.add('ddf-hide')
    this.element.required = false
  }

  show() {
    if (this.element.required)
      this.element.required = true
    this.containerElement.classList.remove('ddf-hide')
    // might have been set on rendering
    this.element.classList.remove('ddf-hide')
  }
}

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

    return this.fields[name]
  }

  // Update the form on instanciation to start with a clean state.
  bind(formElement) {
    // compensate for dumb json hydratation
    if (formElement !== undefined) this.element = formElement
    let update = this.update.bind(this)
    this.element.addEventListener('input', update)
    this.element.addEventListener('change', update)
  }

  // Update the UI.
  update() {
    log('[Form] ', this, '.update()')

    for (var i=0; i<this.rules.length; i++) {
      this.rules[i].apply(this)
    }
  }
}

export { Field, Form }
