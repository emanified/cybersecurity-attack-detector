class DFA:

    def __init__(
        self,
        states,
        alphabet,
        transitions,
        start_state,
        accept_states
    ):
        self.states = states
        self.alphabet = alphabet
        self.transitions = transitions
        self.start_state = start_state
        self.accept_states = accept_states

    def run(self, text):
     for start in range(len(text)):
        current_state = self.start_state
        path = [current_state]

        for ch in text[start:]:
            key = (current_state, ch)

            if key not in self.transitions:
                break

            current_state = self.transitions[key]
            # Only append if this state differs from the previous one
            # (avoids duplicate nodes from self-loop transitions)
            if current_state != path[-1]:
                path.append(current_state)

        if current_state in self.accept_states:
            return True, path

     return False, [self.start_state]