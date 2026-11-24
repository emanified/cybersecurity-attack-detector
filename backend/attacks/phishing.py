from dfa import DFA

# Matches common leet-substitution phishing patterns like paypa1.com
# DFA: detects digit replacing a letter inside a known domain word
# Pattern: word char, then a digit (1,0,3,4) where a letter is expected
# Simple heuristic: 'paypa1' → p-a-y-p-a-1

paypal_dfa = DFA(
    states={'q0','q1','q2','q3','q4','q5','q6'},
    alphabet={'p','a','y','1','l'},
    transitions={
        ('q0','p'): 'q1',
        ('q1','a'): 'q2',
        ('q2','y'): 'q3',
        ('q3','p'): 'q4',
        ('q4','a'): 'q5',
        ('q5','1'): 'q6',   # '1' substituted for 'l'
    },
    start_state='q0',
    accept_states={'q6'}
)

# Generic leet pattern: any letter followed by '0' (o→0) or '1' (l/i→1)
# Detect 'arnazon', 'g00gle', 'micros0ft' etc.
leet_dfa = DFA(
    states={'l0','l1','l2'},
    alphabet={'0','g','o'},
    transitions={
        ('l0','g'): 'l1',
        ('l1','o'): 'l1',
        ('l1','0'): 'l2',   # 'o' replaced by '0'
    },
    start_state='l0',
    accept_states={'l2'}
)

def detect_phishing(user_input):
    low = user_input.lower()
    for label, dfa in [("Phishing (paypal spoof)", paypal_dfa),
                        ("Phishing (leet domain)",  leet_dfa)]:
        accepted, path = dfa.run(low)
        if accepted:
            return label, path
    return False, []