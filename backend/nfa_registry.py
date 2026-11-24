from nfa import NFA
from nfa_serialize import serialize_nfa
from nfa_to_dfa import subset_construction


# ── "contains <pattern>" NFA builder ───────────────────────────────────
# Start state self-loops on every alphabet symbol AND branches into a
# linear chain spelling the pattern -> nondeterminism on the first symbol.
# Subset construction turns this into the equivalent (KMP-style) DFA.
def contains_nfa(pattern):
    n = len(pattern)
    width = max(2, len(str(n)))
    name = lambda i: f'q{i:0{width}d}'
    states = {name(i) for i in range(n + 1)}
    alphabet = set(pattern)

    trans = {}
    for sym in alphabet:                       # q0 loops on all symbols
        trans[(name(0), sym)] = {name(0)}
    for i, ch in enumerate(pattern):           # branch/advance along chain
        key = (name(i), ch)
        trans[key] = trans.get(key, set()) | {name(i + 1)}
    for sym in alphabet:                        # accept state loops on all
        key = (name(n), sym)
        trans[key] = trans.get(key, set()) | {name(n)}

    return NFA(states, alphabet, trans, name(0), {name(n)})


# ── Attack NFAs: same ids + labels + signatures as the DFA Simulator ────
# Each detects its attack signature as a substring. buffer_overflow is
# special-cased below: its alphabet is meta-symbols ('any', 'len>100').
_ATTACK_SIGNATURES = {
    'xss':                 ('XSS', 'attack', '<script>'),
    'command_injection':   ('Command Injection', 'attack', ';ls'),
    'directory_traversal': ('Directory Traversal', 'attack', '../'),
    'brute_force':         ('Brute Force', 'attack', 'FFFFF'),
    'phishing':            ('Phishing', 'attack', 'paypa1'),
    'csrf':                ('CSRF', 'attack', 'transfer?amount='),
    'dns_spoofing':        ('DNS Spoofing', 'attack', 'a.0.0'),
    'session_hijacking':   ('Session Hijacking', 'attack', 'session_id='),
    'xml_injection':       ('XML Injection', 'attack', '<a>'),

    'sql_classic':   ('Classic SQLi', 'sql', "'or1=1"),
    'sql_union':     ('UNION-Based SQLi', 'sql', "' union select"),
    'sql_comment':   ('Comment-Based SQLi', 'sql', "'--"),
    'sql_bool':      ('Boolean-Blind SQLi', 'sql', "' and 1=1"),
    'sql_time':      ('Time-Based SQLi', 'sql', "'; waitfor delay"),
    'sql_stacked':   ('Stacked-Query SQLi', 'sql', "'; drop table"),
    'sql_tautology': ('Tautology SQLi', 'sql', "'or'x'='x"),
    'sql_error':     ('Error-Based SQLi', 'sql', "' and 1=conver"),
    'sql_oob':       ('Out-of-Band SQLi', 'sql', "'; exec xp_cmd"),
    'sql_hex':       ('Hex-Encoding SQLi', 'sql', '0x'),
}

# buffer_overflow: meta-alphabet ('any' = any char, 'len>100' = length > 100).
# Already deterministic; included so the converter covers all 10 general attacks.
buffer_overflow = NFA(
    states={'q0', 'q_accept'},
    alphabet={'any', 'len>100'},
    transitions={
        ('q0', 'any'): {'q0'},
        ('q0', 'len>100'): {'q_accept'},
    },
    start_state='q0',
    accept_states={'q_accept'},
)


# ── Classic group: textbook NFAs (one demonstrates ε) ──────────────────

# binary strings ending in 01
ends_01 = NFA(
    states={'q0', 'q1', 'q2'},
    alphabet={'0', '1'},
    transitions={
        ('q0', '0'): {'q0', 'q1'},
        ('q0', '1'): {'q0'},
        ('q1', '1'): {'q2'},
    },
    start_state='q0',
    accept_states={'q2'},
)

# (a|b)*abb
abb = NFA(
    states={'q0', 'q1', 'q2', 'q3'},
    alphabet={'a', 'b'},
    transitions={
        ('q0', 'a'): {'q0', 'q1'},
        ('q0', 'b'): {'q0'},
        ('q1', 'b'): {'q2'},
        ('q2', 'b'): {'q3'},
    },
    start_state='q0',
    accept_states={'q3'},
)

# a*|b* via epsilon union
a_or_b_star = NFA(
    states={'q0', 'q1', 'q2'},
    alphabet={'a', 'b'},
    transitions={
        ('q0', 'ε'): {'q1', 'q2'},
        ('q1', 'a'): {'q1'},
        ('q2', 'b'): {'q2'},
    },
    start_state='q0',
    accept_states={'q1', 'q2'},
)

# id -> (label, group, NFA)
_REGISTRY = {
    id: (label, group, contains_nfa(pattern))
    for id, (label, group, pattern) in _ATTACK_SIGNATURES.items()
}
_REGISTRY.update({
    'buffer_overflow': ('Buffer Overflow', 'attack', buffer_overflow),
    'ends_01': ('Ends in 01', 'classic', ends_01),
    'abb': ('(a|b)*abb', 'classic', abb),
    'a_or_b_star': ('a*|b* (ε-union)', 'classic', a_or_b_star),
})


def list_nfas():
    return [
        {'id': k, 'label': v[0], 'group': v[1]}
        for k, v in _REGISTRY.items()
    ]


def get_nfa(nfa_id):
    entry = _REGISTRY.get(nfa_id)
    if entry is None:
        return None
    label, group, nfa = entry
    return serialize_nfa(nfa, nfa_id, label, group)


def convert_nfa(nfa_id):
    entry = _REGISTRY.get(nfa_id)
    if entry is None:
        return None
    label, group, nfa = entry
    nfa_json = serialize_nfa(nfa, nfa_id, label, group)
    result = subset_construction(nfa)
    result['dfa']['id'] = f'{nfa_id}_dfa'
    result['dfa']['label'] = f'{label} → DFA'
    return {'nfa': nfa_json, 'dfa': result['dfa'], 'table': result['table']}
