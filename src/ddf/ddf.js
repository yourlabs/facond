// Django admin jquery compat
if (typeof django !== 'undefined') var $ = django.jQuery;

var ddf = ddf || {}
ddf.rule = ddf.rule || {};
ddf.action = ddf.action || {};
ddf.condition = ddf.condition || {};
ddf.form = ddf.form || {};
ddf.debug = ddf.debug || false;

// Return the object for a dotted name, ie. ddf.rule.Rule
ddf.getClass = function(name) {
    let parts = name.split('.');
    let leaf = window;

    for(var i=0; i<parts.length; i++) {
        leaf = leaf[parts[i]];
    }

    if (ddf.debug) console.log('Found', leaf, 'for', name);
    return leaf
}

// Recursively convert DictMixin python objects into JS equivalents.
ddf.instanciate = function(attrs) {
    let cls = ddf.getClass(attrs.cls);
    let obj = new cls();

    for (key in attrs) {
        let value = attrs[key];

        if (attrs[key] === undefined || attrs[key] === null) {
            obj[key] = value;
        } else if (value instanceof Array && value.length && value[0].cls !== undefined) {
            obj[key] = value.map(ddf.instanciate);
        } else if (attrs[key].cls !== undefined) {
            obj[key] = ddf.instanciate(attrs);
        } else {
            obj[key] = value;
        }
    }

    if (ddf.debug) console.log('Instanciated', obj);
    return obj;
}


// Instanciate an action with a list of conditions.
ddf.action.Action = function(conditions) {
    this.conditions = conditions || [];
}

// Execute the action's apply() method if all conditions pass, unapply()
// otherwise.
ddf.action.Action.prototype.execute = function(form, field) {
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


// Remove a field from a form.
ddf.action.Remove = function() {}
ddf.action.Remove.prototype = Object.create(ddf.action.Action.prototype);

// Hide the field.
ddf.action.Remove.prototype.apply = function(form, field) {
    form.fieldHide(field);
}

// Show the field.
ddf.action.Remove.prototype.unapply = function(form, field) {
    form.fieldShow(field);
}


// Remove given choices from a field.
ddf.action.RemoveChoices = function(choices) {
    this.choices = choices;
}

ddf.action.RemoveChoices.prototype = Object.create(ddf.action.Action.prototype);

// Hide options which are not in this.choices from a field.
ddf.action.RemoveChoices.prototype.apply = function(form, field) {
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
ddf.action.RemoveChoices.prototype.unapply = function(form, field) {
    choices = this.choices;
    form.fieldGet(field).find('option').each(function() {
        if (!$(this).attr('value').indexOf(choices)) {
            $(this).show();
        }
    });
}

// Validate if a field has a given value.
ddf.condition.ValueIs = function(field, value) {
    this.field = field;
    this.value = value;
}

// Return true if the field's value is this.value
ddf.condition.ValueIs.prototype.validate = function(form) {
    let valid = form.fieldValueGet(this.field) == this.value;
    if (ddf.debug) console.log('[Condition]', this, '.validate(', form, ') = ', valid);
    return valid;
}


// A Rule has actions for a field.
ddf.rule.Rule = function(field, actions) {
    this.field = field;
    this.actions = actions;
}

// Execute all actions of this rule.
ddf.rule.Rule.prototype.apply = function(form) {
    if (ddf.debug) console.log('[Rule]', this, '.apply(', form, ')');
    for (var i=0; i<this.actions.length; i++) {
        this.actions[i].execute(form, this.field);
    }
}


// A Form matches the Form instance in Django, has a jQuery form object, a
// prefix and rules.
//
// Update the form on instanciation to start with a clean state.
ddf.form.Form = function(form, rules, prefix) {
    this.form = form;
    this.rules = rules;
    this.prefix = prefix;
}

ddf.form.Form.prototype.bind = function(form) {
    this.form = form;
    let that = this;
    form.on('change', ':input', function() {
        that.update($(this));
    });
}

// Return the jQuery field instance for a field name.
ddf.form.Form.prototype.fieldGet = function(field) {
    let prefix = this.prefix ? this.prefix : '';
    return this.form.find(':input[name=' + prefix + field + ']');
}

// Return the jQuery field label instance for a field name.
ddf.form.Form.prototype.fieldLabelGet = function(field) {
    return $('label[for=' + this.fieldGet(field).attr('id') + ']');
}

// Return the jQuery field container for a field name, it's the element that
// contains both the field and label.
ddf.form.Form.prototype.fieldContainerGet = function(field) {
    return this.fieldGet(field).parents().has(this.fieldLabelGet(field)).first();
}

// Return the value of a field by name.
ddf.form.Form.prototype.fieldValueGet = function(field) {
    return this.fieldGet(field).val();
}

// Clear the value of a field by name.
ddf.form.Form.prototype.fieldValueClear = function(field) {
    return this.fieldGet(field).val('');
}

// Hide a field container.
ddf.form.Form.prototype.fieldHide = function(field) {
    return this.fieldContainerGet(field).hide();
}

// Show a field container.
ddf.form.Form.prototype.fieldShow = function(field) {
    return this.fieldContainerGet(field).show();
}

// Update the UI.
ddf.form.Form.prototype.update = function() {
    if (ddf.debug) console.log('[Form] ', this, '.update()');

    for (var i=0; i<this.rules.length; i++) {
        this.rules[i].apply(this);
    }
}


;(function ($) {
    $.fn.ddf = function(configuration) {
        let form = ddf.instanciate(configuration);
        form.bind($(this));
        form.update();
    }

    $('script[type="text/ddf-configuration"]').each(function() {
        $(this).parents('form').ddf(JSON.parse($(this).text()));
    });
})($);
