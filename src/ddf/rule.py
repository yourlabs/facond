"""A Rule for a field has Actions."""

from .action import Action
from .js import JsDictMixin


class Rule(JsDictMixin):
    """A rule applies actions if constraints pass."""

    js_attrs = ['actions', 'field']

    def __init__(self, field, actions):
        """List the actions to apply on the field."""
        self.actions = actions
        self.field = field

        for action in actions:
            if isinstance(action, Action):
                continue
            raise Exception('%s is not an Action' % action)

    def apply(self, form):
        """Execute each action on the form."""
        applied = []
        for action in self.actions:
            if action.execute(form.fields[self.field]):
                applied.append(action)
        return applied
