import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nfa import NFA
from nfa_to_dfa import subset_construction


def _ends_01():
    return NFA(
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


def test_start_state_label_is_closure_of_start():
    result = subset_construction(_ends_01())
    assert result['dfa']['start'] == '{q0}'


def test_dfa_is_deterministic_one_target_per_symbol():
    result = subset_construction(_ends_01())
    dfa = result['dfa']
    seen = set()
    for t in dfa['transitions']:
        key = (t['from'], t['symbol'])
        assert key not in seen, f'duplicate transition for {key}'
        seen.add(key)


def test_accept_states_contain_nfa_accept():
    result = subset_construction(_ends_01())
    for label in result['dfa']['accept']:
        assert 'q2' in label


def test_table_has_row_per_dfa_state():
    result = subset_construction(_ends_01())
    dfa_states = set(result['dfa']['states'])
    table_states = {row['dfa_state'] for row in result['table']}
    assert table_states == dfa_states


def test_table_start_and_accept_flags():
    result = subset_construction(_ends_01())
    start_rows = [r for r in result['table'] if r['is_start']]
    assert len(start_rows) == 1
    assert start_rows[0]['dfa_state'] == '{q0}'
    accept_rows = [r for r in result['table'] if r['is_accept']]
    assert all('q2' in r['dfa_state'] for r in accept_rows)


def test_epsilon_closure_used_in_construction():
    nfa = NFA(
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
    result = subset_construction(nfa)
    assert result['dfa']['start'] == '{q0,q1,q2}'
    assert '{q0,q1,q2}' in result['dfa']['accept']
