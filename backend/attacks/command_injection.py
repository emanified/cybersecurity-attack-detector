from dfa import DFA

# Matches ;ls  or  ;cat  (semicolon + shell command)
# DFA 1: ; followed by optional space then 'ls'
ls_dfa = DFA(
    states={'q0','q1','q2','q3'},
    alphabet={';',' ','l','s'},
    transitions={
        ('q0',';'): 'q1',
        ('q1',' '): 'q1',
        ('q1','l'): 'q2',
        ('q2','s'): 'q3',
    },
    start_state='q0',
    accept_states={'q3'}
)

# DFA 2: ; followed by optional space then 'cat'
cat_dfa = DFA(
    states={'q0','q1','q2','q3','q4'},
    alphabet={';',' ','c','a','t'},
    transitions={
        ('q0',';'): 'q1',
        ('q1',' '): 'q1',
        ('q1','c'): 'q2',
        ('q2','a'): 'q3',
        ('q3','t'): 'q4',
    },
    start_state='q0',
    accept_states={'q4'}
)

def detect_command_injection(user_input):
    low = user_input.lower()
    for label, dfa in [("Command Injection (ls)", ls_dfa),
                        ("Command Injection (cat)", cat_dfa)]:
        accepted, path = dfa.run(low)
        if accepted:
            return label, path
    return False, []