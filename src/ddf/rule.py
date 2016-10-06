"""A Rule for a field has Actions."""

from .action import Action
from .base import DictMixin


class Rule(DictMixin):
    """A rule applies actions if constraints pass."""

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
        for action in self.actions:
            action.execute(form, self.field)
