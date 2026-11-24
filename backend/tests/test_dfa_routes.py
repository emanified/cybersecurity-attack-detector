import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app


def client():
    app.testing = True
    return app.test_client()


def test_list_route():
    res = client().get('/dfa')
    assert res.status_code == 200
    assert len(res.get_json()) == 20


def test_detail_route():
    res = client().get('/dfa/xss')
    assert res.status_code == 200
    data = res.get_json()
    assert data['id'] == 'xss'
    assert data['start'] == 'q0'


def test_detail_variant_route():
    res = client().get('/dfa/command_injection?variant=;cat')
    assert res.status_code == 200
    assert res.get_json()['id'] == 'command_injection'


def test_unknown_id_404():
    res = client().get('/dfa/nope')
    assert res.status_code == 404
    assert 'error' in res.get_json()
