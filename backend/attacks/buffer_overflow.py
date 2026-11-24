from dfa import DFA

THRESHOLD = 100

class LengthDFA:
    """Accepts any string longer than THRESHOLD characters."""

    def run(self, text):
        n = len(text)
        if n > THRESHOLD:
            # Return symbolic path: q0 → q_counting → q_overflow (accept)
            return True, ['q0', 'q_counting', f'q_{n}chars', 'q_overflow']
        return False, []

length_dfa = LengthDFA()

def detect_buffer_overflow(user_input):
    accepted, path = length_dfa.run(user_input)
    return ("Buffer Overflow", path) if accepted else (False, [])
