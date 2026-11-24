import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nfa import NFA
from nfa_serialize import serialize_nfa


def _nfa():
    return NFA(
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


def test_serialize_basic_fields():
    data = serialize_nfa(_nfa(), 'demo', 'Demo NFA', 'classic')
    assert data['id'] == 'demo'
    assert data['label'] == 'Demo NFA'
    assert data['group'] == 'classic'
    assert data['start'] == 'q0'
    assert data['states'] == ['q0', 'q1', 'q2']
    assert data['accept'] == ['q1', 'q2']


def test_alphabet_excludes_epsilon_and_flag_set():
    data = serialize_nfa(_nfa(), 'demo', 'Demo NFA', 'classic')
    assert data['alphabet'] == ['a', 'b']
    assert data['epsilon'] is True


def test_epsilon_transition_serialized_with_symbol():
    data = serialize_nfa(_nfa(), 'demo', 'Demo NFA', 'classic')
    assert {'from': 'q0', 'symbol': 'ε', 'to': 'q1'} in data['transitions']
    assert {'from': 'q0', 'symbol': 'ε', 'to': 'q2'} in data['transitions']


def test_epsilon_flag_false_when_no_eps():
    nfa = NFA(
        states={'q0', 'q1'},
        alphabet={'a'},
        transitions={('q0', 'a'): {'q1'}},
        start_state='q0',
        accept_states={'q1'},
    )
    data = serialize_nfa(nfa, 'x', 'X', 'classic')
    assert data['epsilon'] is False
