from dfa import DFA

# Session Hijacking: duplicate session token pattern
# Detects  session_id= or SESSIONID= appearing with a hex token
# DFA matches: 's' 'e' 's' 's' 'i' 'o' 'n'

session_dfa = DFA(
    states={f'q{i}' for i in range(8)},
    alphabet={'s','e','i','o','n','_','-','d','='},
    transitions={
        ('q0','s'): 'q1',
        ('q1','e'): 'q2',
        ('q2','s'): 'q3',
        ('q3','s'): 'q4',
        ('q4','i'): 'q5',
        ('q5','o'): 'q6',
        ('q6','n'): 'q7',
        # Allow optional _ or - and then 'id='
        ('q7','_'): 'q8',
        ('q7','-'): 'q8',
        ('q8','i'): 'q9',
        ('q9','d'): 'q10',
        ('q10','='): 'q11',  # accept
    },
    start_state='q0',
    accept_states={'q11'}
)

def detect_session_hijacking(user_input):
    import re
    low = user_input.lower()
    # session token pattern with a hex-like value
    if re.search(r'session[_\-]?id\s*=\s*[a-f0-9]{8,}', low):
        return "Session Hijacking", []
    accepted, path = session_dfa.run(low)
    return ("Session Hijacking", path) if accepted else (False, [])