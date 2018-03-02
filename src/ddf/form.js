import debug from 'debug'

var log = debug('ddf.form')

class Form {
  // A Form matches the Form instance in Django, has a form htmlElement, a
  // prefix and rules.
  constructor(form, rules, prefix) {
    this.form = form
    this.rules = rules
    this.prefix = prefix || ''
    this._fieldContainerDisplays = {}
  }

  //
  // Update the form on instanciation to start with a clean state.
  bind() {
    let update = this.update.bind(this)
    this.form.addEventListener('input', e => update)
  }

  fieldSelector(field) {
    return '[name=' + this.prefix + field + ']'
  }

  // Return the jQuery field instance for a field name.
  fieldElement(field) {
    return this.form.querySelector(this.fieldSelector(field))
  }

  fieldLabelSelector(field) {
    return 'label[for=' + this.fieldElement(field).id + ']'
  }

  // Return the jQuery field label instance for a field name.
  fieldLabelElement(field) {
    return this.form.querySelector(this.fieldLabelSelector(field))
  }

  // Return the jQuery field container for a field name, it's the element that
  // contains both the field and label.
  fieldContainerElement(field) {
    let htmlElement = this.fieldElement(field)
    while (htmlElement = htmlElement.parentNode)
      if (htmlElement.querySelector(this.fieldLabelSelector(field)) != undefined)
        return htmlElement
  }

  // Return the value of a field by name.
  fieldValueGet(field) {
    return this.fieldElement(field).value
  }

  // Clear the value of a field by name.
  fieldValueClear(field) {
    return this.fieldElement(field).reset()
  }

  // Hide a field container.
  fieldHide(field) {
    let container = this.fieldContainerElement(field)
    if (this._fieldContainerDisplays[field] === undefined)
      this._fieldContainerDisplays[field] = container.style.display
    this.fieldContainerElement(field).style.display = 'none'
  }

  // Show a field container.
  fieldShow(field) {
    this.fieldContainerElement(field).style.display = this._fieldContainerDisplays[field] || 'block'
  }

  // Update the UI.
  update() {
    log('[Form] ', this, '.update()')

    for (var i=0; i<this.rules.length; i++) {
      this.rules[i].apply(this)
    }
  }
}

export { Form }
