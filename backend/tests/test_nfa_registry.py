import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nfa_registry import list_nfas, get_nfa, convert_nfa


def test_list_has_23_entries():
    items = list_nfas()
    assert len(items) == 23
    ids = {i['id'] for i in items}
    assert {'xss', 'command_injection', 'directory_traversal', 'buffer_overflow',
            'sql_classic', 'sql_hex', 'ends_01', 'abb', 'a_or_b_star'} <= ids


def test_groups_split_10_10_3():
    items = list_nfas()
    attack = [i for i in items if i['group'] == 'attack']
    sql = [i for i in items if i['group'] == 'sql']
    classic = [i for i in items if i['group'] == 'classic']
    assert len(attack) == 10
    assert len(sql) == 10
    assert len(classic) == 3


def test_attack_nfa_detects_substring():
    from nfa_registry import _REGISTRY
    _, _, nfa = _REGISTRY['xss']
    assert nfa.run('sc<script>tt')[0] is True
    assert nfa.run('scriptscript')[0] is False


def test_get_nfa_returns_serialized():
    data = get_nfa('ends_01')
    assert data['id'] == 'ends_01'
    assert data['start'] == 'q0'
    assert {'from': 'q0', 'symbol': '0', 'to': 'q1'} in data['transitions']


def test_get_unknown_returns_none():
    assert get_nfa('nope') is None


def test_a_or_b_star_has_epsilon():
    data = get_nfa('a_or_b_star')
    assert data['epsilon'] is True


def test_convert_returns_nfa_dfa_table():
    result = convert_nfa('ends_01')
    assert result['nfa']['id'] == 'ends_01'
    assert result['dfa']['id'] == 'ends_01_dfa'
    assert result['dfa']['label'].endswith('→ DFA')
    assert len(result['table']) == len(result['dfa']['states'])


def test_convert_unknown_returns_none():
    assert convert_nfa('nope') is None
