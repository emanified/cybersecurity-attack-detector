import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app


def client():
    app.testing = True
    return app.test_client()


def test_nfa_list_route():
    res = client().get('/nfa')
    assert res.status_code == 200
    assert len(res.get_json()) == 23


def test_nfa_detail_route():
    res = client().get('/nfa/ends_01')
    assert res.status_code == 200
    data = res.get_json()
    assert data['id'] == 'ends_01'
    assert data['start'] == 'q0'


def test_nfa_detail_unknown_404():
    res = client().get('/nfa/nope')
    assert res.status_code == 404
    assert 'error' in res.get_json()


def test_nfa_to_dfa_route():
    res = client().get('/nfa/ends_01/dfa')
    assert res.status_code == 200
    data = res.get_json()
    assert data['nfa']['id'] == 'ends_01'
    assert data['dfa']['id'] == 'ends_01_dfa'
    assert isinstance(data['table'], list)
    assert len(data['table']) == len(data['dfa']['states'])


def test_nfa_to_dfa_unknown_404():
    res = client().get('/nfa/nope/dfa')
    assert res.status_code == 404
    assert 'error' in res.get_json()
