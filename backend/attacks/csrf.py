from dfa import DFA

# Matches transfer?amount=  (CSRF pattern in URL/request)
# t-r-a-n-s-f-e-r-?-a-m-o-u-n-t-=
csrf_dfa = DFA(
    states={f'q{i}' for i in range(17)},
    alphabet={'t','r','a','n','s','f','e','?','m','o','u','='},
    transitions={
        ('q0','t'): 'q1',
        ('q1','r'): 'q2',
        ('q2','a'): 'q3',
        ('q3','n'): 'q4',
        ('q4','s'): 'q5',
        ('q5','f'): 'q6',
        ('q6','e'): 'q7',
        ('q7','r'): 'q8',
        ('q8','?'): 'q9',
        ('q9','a'): 'q10',
        ('q10','m'): 'q11',
        ('q11','o'): 'q12',
        ('q12','u'): 'q13',
        ('q13','n'): 'q14',
        ('q14','t'): 'q15',
        ('q15','='): 'q16',
    },
    start_state='q0',
    accept_states={'q16'}
)

def detect_csrf(user_input):
    accepted, path = csrf_dfa.run(user_input.lower())
    return ("CSRF", path) if accepted else (False, [])