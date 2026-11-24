from dfa import DFA

# DNS Spoofing DFA: matches domain.tld patterns
ip_fragment_dfa = DFA(
    states={'q0','q1','q2','q3','q4','q5'},
    alphabet=set('abcdefghijklmnopqrstuvwxyz0123456789.-'),
    transitions={
        **{('q0', c): 'q1' for c in 'abcdefghijklmnopqrstuvwxyz'},
        **{('q1', c): 'q1' for c in 'abcdefghijklmnopqrstuvwxyz'},
        ('q1', '.'): 'q2',
        **{('q2', c): 'q3' for c in '0123456789'},
        **{('q3', c): 'q3' for c in '0123456789'},
        ('q3', '.'): 'q4',
        **{('q4', c): 'q5' for c in '0123456789'},
        **{('q5', c): 'q5' for c in '0123456789'},
    },
    start_state='q0',
    accept_states={'q5'}
)

def detect_dns_spoofing(user_input):
    import re
    # Match ASCII arrows (->, =>) and unicode arrow (→) and colon separator
    pattern = r'([a-z0-9]{3,}\.[a-z]{2,})\s*(->|=>|\u2192|:)\s*(\d{1,3}\.\d{1,3})'
    m = re.search(pattern, user_input.lower())
    if m:
        domain = m.group(1)
        arrow = m.group(2)
        ip_part = m.group(3)
        # Build a meaningful symbolic DFA path
        path = ['q0_start', f'q_domain({domain})', f'q_arrow({arrow})', f'q_ip({ip_part})', 'q_accept']
        return "DNS Spoofing", path
    return False, []
