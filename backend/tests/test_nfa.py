import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nfa import NFA


def _eps_union_nfa():
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


def test_epsilon_closure_follows_eps_edges():
    nfa = _eps_union_nfa()
    assert nfa.epsilon_closure({'q0'}) == {'q0', 'q1', 'q2'}


def test_epsilon_closure_without_eps_is_identity():
    nfa = _eps_union_nfa()
    assert nfa.epsilon_closure({'q1'}) == {'q1'}


def test_move_unions_targets():
    nfa = NFA(
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
    assert nfa.move({'q0'}, '0') == {'q0', 'q1'}


def test_run_accepts_empty_string_via_eps():
    nfa = _eps_union_nfa()
    accepted, _ = nfa.run('')
    assert accepted is True


def test_run_accepts_a_star():
    nfa = _eps_union_nfa()
    accepted, _ = nfa.run('aaa')
    assert accepted is True


def test_run_rejects_mixed():
    nfa = _eps_union_nfa()
    accepted, _ = nfa.run('ab')
    assert accepted is False
