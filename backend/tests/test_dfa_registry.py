import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dfa_registry import list_dfas, get_dfa


def test_list_has_20_entries():
    items = list_dfas()
    assert len(items) == 20
    ids = {i['id'] for i in items}
    assert 'xss' in ids
    assert 'sql_classic' in ids
    assert 'buffer_overflow' in ids


def test_groups_split_10_10():
    items = list_dfas()
    general = [i for i in items if i['group'] == 'general']
    sql = [i for i in items if i['group'] == 'sql']
    assert len(general) == 10
    assert len(sql) == 10


def test_get_xss_automaton():
    a = get_dfa('xss')
    assert a['start'] == 'q0'
    assert 'q8' in a['accept']
    assert {'from': 'q0', 'symbol': '<', 'to': 'q1'} in a['transitions']


def test_command_injection_has_variants():
    a = get_dfa('command_injection')
    assert len(a['variants']) == 2
    names = {v for v in a['variants']}
    assert names == {';ls', ';cat'}


def test_get_variant_returns_distinct_automaton():
    cat = get_dfa('command_injection', variant=';cat')
    assert any(t['symbol'] == 'a' for t in cat['transitions'])


def test_unknown_id_returns_none():
    assert get_dfa('nope') is None


def test_buffer_overflow_is_counter_automaton():
    a = get_dfa('buffer_overflow')
    assert a['start'] == 'q0'
    assert 'q_accept' in a['accept']
    syms = {t['symbol'] for t in a['transitions']}
    assert 'any' in syms
    assert 'len>100' in syms
