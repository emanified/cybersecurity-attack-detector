def _label(state_set):
    if not state_set:
        return '∅'
    return '{' + ','.join(sorted(state_set)) + '}'


def subset_construction(nfa):
    """Convert an NFA to an equivalent DFA via subset construction.

    Returns {'dfa': <dfa_json>, 'table': [<row>, ...]}.
    The dfa_json uses the same shape as the existing serialized DFA so the
    frontend graph renders it unchanged. DFA state labels are '{q0,q1}'.
    """
    alphabet = sorted(nfa.alphabet)
    start_set = frozenset(nfa.epsilon_closure({nfa.start_state}))

    transitions = []
    accept_labels = []
    table = []
    state_labels = []

    seen = {start_set}
    worklist = [start_set]

    while worklist:
        current = worklist.pop(0)
        clabel = _label(current)
        state_labels.append(clabel)
        is_accept = bool(current & nfa.accept_states)
        if is_accept:
            accept_labels.append(clabel)

        moves = {}
        for sym in alphabet:
            target = frozenset(nfa.epsilon_closure(nfa.move(current, sym)))
            tlabel = _label(target)
            moves[sym] = tlabel
            transitions.append({'from': clabel, 'symbol': sym, 'to': tlabel})
            if target not in seen:
                seen.add(target)
                worklist.append(target)

        table.append({
            'dfa_state': clabel,
            'nfa_states': sorted(current),
            'moves': moves,
            'is_start': current == start_set,
            'is_accept': is_accept,
        })

    dfa = {
        'id': None,
        'label': None,
        'group': 'converted',
        'alphabet': alphabet,
        'states': sorted(set(state_labels)),
        'start': _label(start_set),
        'accept': sorted(accept_labels),
        'transitions': transitions,
    }
    return {'dfa': dfa, 'table': table}
