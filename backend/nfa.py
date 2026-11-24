class NFA:
    """Nondeterministic finite automaton with epsilon transitions.

    transitions: dict mapping (state, symbol) -> set of target states.
    The epsilon symbol is the literal string NFA.EPSILON ('ε').
    """

    EPSILON = 'ε'

    def __init__(self, states, alphabet, transitions, start_state, accept_states):
        self.states = set(states)
        self.alphabet = set(alphabet)  # real input symbols, excludes EPSILON
        self.transitions = {k: set(v) for k, v in transitions.items()}
        self.start_state = start_state
        self.accept_states = set(accept_states)

    def epsilon_closure(self, states):
        closure = set(states)
        stack = list(states)
        while stack:
            s = stack.pop()
            for t in self.transitions.get((s, self.EPSILON), ()):
                if t not in closure:
                    closure.add(t)
                    stack.append(t)
        return closure

    def move(self, states, symbol):
        result = set()
        for s in states:
            result |= self.transitions.get((s, symbol), set())
        return result

    def run(self, text):
        active = self.epsilon_closure({self.start_state})
        path = [sorted(active)]
        for ch in text:
            active = self.epsilon_closure(self.move(active, ch))
            path.append(sorted(active))
            if not active:
                return False, path
        return bool(active & self.accept_states), path
