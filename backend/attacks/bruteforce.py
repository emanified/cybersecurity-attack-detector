from dfa import DFA

# Brute-force pattern: 5 or more consecutive failed login attempts
# Represented as five or more 'F' characters in sequence

states = {
    'q0', 'q1', 'q2', 'q3', 'q4', 'q5'
}

alphabet = {
    'F', 'S'
}

transitions = {
    ('q0', 'F'): 'q1',
    ('q1', 'F'): 'q2',
    ('q2', 'F'): 'q3',
    ('q3', 'F'): 'q4',
    ('q4', 'F'): 'q5',
    # Any success resets back to start
    ('q0', 'S'): 'q0',
    ('q1', 'S'): 'q0',
    ('q2', 'S'): 'q0',
    ('q3', 'S'): 'q0',
    ('q4', 'S'): 'q0',
    ('q5', 'S'): 'q0',
    # More failures stay in accept state
    ('q5', 'F'): 'q5',
}

start_state = 'q0'
accept_states = {'q5'}

brute_dfa = DFA(
    states,
    alphabet,
    transitions,
    start_state,
    accept_states
)

def detect_bruteforce(user_input):
    """
    Expects a login-attempt string like 'FFFFFSFF' (F=fail, S=success).
    Detects 5+ consecutive failures (per PDF spec).
    """
    accepted, path = brute_dfa.run(user_input)
    return accepted, path
