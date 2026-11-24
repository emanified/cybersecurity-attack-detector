from nfa import NFA


def serialize_nfa(nfa, id, label, group):
    transitions = []
    has_eps = False
    for (state, symbol), targets in nfa.transitions.items():
        if symbol == NFA.EPSILON:
            has_eps = True
        for t in targets:
            transitions.append({'from': state, 'symbol': symbol, 'to': t})
    transitions.sort(key=lambda d: (d['from'], d['symbol'], d['to']))

    return {
        'id': id,
        'label': label,
        'group': group,
        'alphabet': sorted(nfa.alphabet),
        'epsilon': has_eps,
        'states': sorted(nfa.states),
        'start': nfa.start_state,
        'accept': sorted(nfa.accept_states),
        'transitions': transitions,
    }
