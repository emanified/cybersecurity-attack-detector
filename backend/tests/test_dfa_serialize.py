import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dfa import DFA
from dfa_serialize import serialize_dfa


def test_serialize_basic_fields():
    dfa = DFA(
        states={'q0', 'q1'},
        alphabet={'a'},
        transitions={('q0', 'a'): 'q1'},
        start_state='q0',
        accept_states={'q1'},
    )
    out = serialize_dfa(dfa, id='demo', label='Demo', group='general')
    assert out['id'] == 'demo'
    assert out['label'] == 'Demo'
    assert out['group'] == 'general'
    assert out['start'] == 'q0'
    assert out['accept'] == ['q1']
    assert out['alphabet'] == ['a']
    assert {'from': 'q0', 'symbol': 'a', 'to': 'q1'} in out['transitions']
    assert out['variants'] == []


def test_serialize_includes_states_only_referenced_in_transitions():
    dfa = DFA(
        states={'q0'},
        alphabet={'a'},
        transitions={('q0', 'a'): 'q9'},
        start_state='q0',
        accept_states={'q9'},
    )
    out = serialize_dfa(dfa, id='x', label='X', group='general')
    assert 'q9' in out['states']
