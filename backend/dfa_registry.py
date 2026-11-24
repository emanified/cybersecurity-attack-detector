from dfa import DFA
from dfa_serialize import serialize_dfa

from attacks.xss import xss_dfa
from attacks.command_injection import ls_dfa, cat_dfa
from attacks.traversal import traversal_dfa
from attacks.bruteforce import brute_dfa
from attacks.phishing import paypal_dfa, leet_dfa
from attacks.csrf import csrf_dfa
from attacks.dns_spoofing import ip_fragment_dfa
from attacks.session_hijacking import session_dfa
from attacks.xml_injection import tag_dfa
from attacks.sql_injection import (
    classic_dfa, union_dfa, comment_dfa, bool_dfa, time_dfa,
    stack_dfa, tautology_dfa, error_dfa, oob_dfa, hex_dfa,
)

buffer_overflow_dfa = DFA(
    states={'q0', 'q_accept'},
    alphabet={'any', 'len>100'},
    transitions={('q0', 'any'): 'q0', ('q0', 'len>100'): 'q_accept'},
    start_state='q0',
    accept_states={'q_accept'},
)

_REGISTRY = {
    'xss':                ('XSS', 'general', xss_dfa, None),
    'command_injection':  ('Command Injection', 'general', ls_dfa,
                           [(';ls', ls_dfa), (';cat', cat_dfa)]),
    'directory_traversal':('Directory Traversal', 'general', traversal_dfa, None),
    'brute_force':        ('Brute Force', 'general', brute_dfa, None),
    'phishing':           ('Phishing', 'general', paypal_dfa,
                           [('paypal spoof', paypal_dfa), ('leet domain', leet_dfa)]),
    'csrf':               ('CSRF', 'general', csrf_dfa, None),
    'buffer_overflow':    ('Buffer Overflow', 'general', buffer_overflow_dfa, None),
    'dns_spoofing':       ('DNS Spoofing', 'general', ip_fragment_dfa, None),
    'session_hijacking':  ('Session Hijacking', 'general', session_dfa, None),
    'xml_injection':      ('XML Injection', 'general', tag_dfa, None),

    'sql_classic':   ('Classic SQLi', 'sql', classic_dfa, None),
    'sql_union':     ('UNION-Based SQLi', 'sql', union_dfa, None),
    'sql_comment':   ('Comment-Based SQLi', 'sql', comment_dfa, None),
    'sql_bool':      ('Boolean-Blind SQLi', 'sql', bool_dfa, None),
    'sql_time':      ('Time-Based SQLi', 'sql', time_dfa, None),
    'sql_stacked':   ('Stacked-Query SQLi', 'sql', stack_dfa, None),
    'sql_tautology': ('Tautology SQLi', 'sql', tautology_dfa, None),
    'sql_error':     ('Error-Based SQLi', 'sql', error_dfa, None),
    'sql_oob':       ('Out-of-Band SQLi', 'sql', oob_dfa, None),
    'sql_hex':       ('Hex-Encoding SQLi', 'sql', hex_dfa, None),
}


def list_dfas():
    out = []
    for id, (label, group, _dfa, variants) in _REGISTRY.items():
        out.append({
            'id': id,
            'label': label,
            'group': group,
            'variants': [name for name, _ in variants] if variants else [],
        })
    return out


def get_dfa(id, variant=None):
    entry = _REGISTRY.get(id)
    if entry is None:
        return None
    label, group, default_dfa, variants = entry

    chosen = default_dfa
    if variant and variants:
        for name, vdfa in variants:
            if name == variant:
                chosen = vdfa
                break

    return serialize_dfa(
        chosen, id=id, label=label, group=group,
        variants=[name for name, _ in variants] if variants else [],
    )
