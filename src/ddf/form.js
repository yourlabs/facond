import debug from 'debug'

var log = debug('ddf.form')

class Field {
  constructor(form, name) {
    this.form = form
    this.name = name
  }

  selector() {
    return '[name=' + this.form.prefix + this.name + ']'
  }

  element() {
    var result = this.form.element.querySelector(this.selector())
    if (! result instanceof HTMLElement) {
      throw 'element ' + this.name + ' not found in ' + this.form.element
    }
    return result
  }

  value() {
    return this.element().value
  }

  valueClear() {
    return this.element().reset()
  }

  labelSelector() {
    return 'label[for=' + this.element().id + ']'
  }

  labelElement() {
    return this.form.element.querySelector(this.labelSelector())
  }

  containerElement() {
    let htmlElement = this.element()
    while (htmlElement = htmlElement.parentNode)
      if (htmlElement.querySelector(this.labelSelector()) != undefined)
        return htmlElement
  }

  hide() {
    let container = this.containerElement()
    this._oldDisplay = container.style.display == 'none' ? 'block' : container.style.display
    container.style.display = 'none'
  }

  show() {
    this.containerElement().style.display = this._oldDisplay
  }
}

class Form {
  // A Form matches the Form instance in Django, has a form htmlElement, a
  // prefix and rules.
  constructor(element, rules, prefix) {
    this.element = element
    this.rules = rules
    this.prefix = prefix || ''
    this.fields = {}
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
    this.element.addEventListener('input', () => update)
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
