from dfa import DFA

# Matches <script> (case-insensitive via normalisation in detect_xss)
states = {
    'q0', 'q1', 'q2', 'q3',
    'q4', 'q5', 'q6', 'q7', 'q8'
}

alphabet = {
    '<', 's', 'c', 'r',
    'i', 'p', 't', '>'
}

transitions = {
    ('q0', '<'): 'q1',
    ('q1', 's'): 'q2',
    ('q2', 'c'): 'q3',
    ('q3', 'r'): 'q4',
    ('q4', 'i'): 'q5',
    ('q5', 'p'): 'q6',
    ('q6', 't'): 'q7',
    ('q7', ' '): 'q7',  # Allow spaces before the closing >
    ('q7', '>'): 'q8',
}

start_state = 'q0'
accept_states = {'q8'}

xss_dfa = DFA(
    states,
    alphabet,
    transitions,
    start_state,
    accept_states
)

def detect_xss(user_input):
    # Lowercase so <SCRIPT> is caught as well
    accepted, path = xss_dfa.run(user_input.lower())
    return accepted, path
