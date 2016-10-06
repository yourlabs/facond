from .base import DictMixin
from .action import Action
from .constraint import Constraint


class Rule(DictMixin):
    """A rule applies actions if constraints pass."""

    def __init__(self, field, actions):
        self.actions = actions
        self.field = field

        for action in actions:
            if isinstance(action, Action):
                continue
            raise Exception('%s is not an Action' % action)

    def apply(self, form):
        for action in self.actions:
            action.execute(form, self.field)
