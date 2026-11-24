def serialize_dfa(dfa, id, label, group, variants=None):
    """Convert a DFA object into a JSON-safe dict.

    transitions are flattened from {(state, char): state} to a list of
    {from, symbol, to}. The states set is unioned with every state referenced
    by transitions/start/accept, because some backend DFAs declare an
    incomplete `states` set (e.g. classic_dfa omits q10-q12).
    """
    transitions = [
        {'from': src, 'symbol': sym, 'to': dst}
        for (src, sym), dst in dfa.transitions.items()
    ]

    states = set(dfa.states) | {dfa.start_state} | set(dfa.accept_states)
    for (src, _sym), dst in dfa.transitions.items():
        states.add(src)
        states.add(dst)

    return {
        'id': id,
        'label': label,
        'group': group,
        'states': sorted(states),
        'alphabet': sorted(dfa.alphabet),
        'start': dfa.start_state,
        'accept': sorted(dfa.accept_states),
        'transitions': transitions,
        'variants': variants or [],
    }
