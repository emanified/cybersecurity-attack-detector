# from dfa import DFA

# # Matches ../ (directory traversal sequence)
# states = {'q0', 'q1', 'q2', 'q3'}

# alphabet = {'.', '/'}

# transitions = {
#     ('q0', '.'): 'q1',
#     ('q1', '.'): 'q2',
#     ('q2', '/'): 'q3',
# }

# start_state = 'q0'
# accept_states = {'q3'}

# traversal_dfa = DFA(
#     states,
#     alphabet,
#     transitions,
#     start_state,
#     accept_states
# )

# def detect_traversal(user_input):
#     accepted, path = traversal_dfa.run(user_input)
#     return accepted, path

from dfa import DFA

states = {'q0', 'q1', 'q2', 'q3'}

alphabet = {'.', '/', '\\'}

transitions = {
    # basic ../
    ('q0', '.'): 'q1',
    ('q1', '.'): 'q2',

    # forward slash
    ('q2', '/'): 'q3',
    # backslash
    ('q2', '\\'): 'q3',

    # chaining ../../ or ..\\..\\
    ('q3', '.'): 'q1',
}

start_state = 'q0'
accept_states = {'q3'}

traversal_dfa = DFA(
    states,
    alphabet,
    transitions,
    start_state,
    accept_states
)

def detect_traversal(user_input):
    accepted, path = traversal_dfa.run(user_input)
    return accepted, path