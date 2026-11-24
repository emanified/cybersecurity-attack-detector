from dfa import DFA

# ── DFA 1: Classic  ' OR '1'='1  /  ' OR 1=1 ────────────────────────────
classic_dfa = DFA(
    states={'q0','q1','q2','q3','q4','q5','q6','q7','q8','q9'},
    alphabet={"'", 'o', 'r', ' ', '1', '='},
    transitions={
        ('q0', "'"): 'q1',
        ('q1', ' '): 'q1',
        ('q1', 'o'): 'q2',
        ('q2', 'r'): 'q3',
        ('q3', ' '): 'q3',
     # quoted path: ' OR '1'='1

        ('q3', "'"): 'q4',
        ('q4', '1'): 'q5',
        ('q5', "'"): 'q6',
        ('q6', '='): 'q7',
        ('q7', "'"): 'q8',
        ('q8', '1'): 'q9',
        # unquoted path: ' OR 1=1
        ('q3', '1'): 'q10',
        ('q10', '='): 'q11',
        ('q11', '1'): 'q12',
    },
    start_state='q0',
    accept_states={'q9','q12'}
)

# ── DFA 2: UNION-based  ' UNION SELECT ──────────────────────────────────
union_dfa = DFA(
    states={'u0','u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12','u13','u14'},
    alphabet={"'",' ','u','n','i','o','s','e','l','c','t'},
    transitions={
    ('u0',"'"): 'u1',
    ('u1',' '): 'u2',  
    ('u2','u'): 'u3',
    ('u3','n'): 'u4',
    ('u4','i'): 'u5',
    ('u5','o'): 'u6',
    ('u6','n'): 'u7',
    ('u7',' '): 'u8',
    ('u8','s'): 'u9',
    ('u9','e'): 'u10',
    ('u10','l'): 'u11',
    ('u11','e'): 'u12',
    ('u12','c'): 'u13',
    ('u13','t'): 'u14',},
    start_state='u0',
    accept_states={'u14'}
)

# ── DFA 3: Comment-based  admin'-- ──────────────────────────────────────
comment_dfa = DFA(
    states={'c0','c1','c2','c3'},
    alphabet={"'",'-'},
    transitions={
        ('c0',"'"): 'c1',
        ('c1','-'): 'c2',
        ('c2','-'): 'c3',
    },
    start_state='c0',
    accept_states={'c3'}
)

# ── DFA 4: Boolean-blind  ' AND 1=1 ─────────────────────────────────────
bool_dfa = DFA(
    states={'b0','b1','b2','b3','b4','b5','b6','b7','b8','b9'},
    alphabet={"'",' ','a','n','d','1','='},
    transitions={ ('b0',"'"): 'b1',
                  ('b1',' '): 'b2',
                  ('b2','a'): 'b3',
                  ('b3','n'): 'b4', 
                  ('b4','d'): 'b5', 
                  ('b5',' '): 'b6', 
                  ('b6','1'): 'b7', 
                  ('b7','='): 'b8', 
                  ('b8','1'): 'b9', },
    start_state='b0',
    accept_states={'b9'}
)

# ── DFA 5: Time-based  '; WAITFOR DELAY ─────────────────────────────────
time_dfa = DFA(
    states={'t0','t1','t2','t3','t4','t5','t6','t7','t8','t9','t10','t11','t12','t13','t14','t15','t16'},
    alphabet={"'",' ',';','w','a','i','t','f','o','r','d','e','l','y'},
    transitions={
        ('t0',"'"): 't1',
        ('t1',';'): 't2',
        ('t2',' '): 't3',
        ('t3','w'): 't4',
        ('t4','a'): 't5',
        ('t5','i'): 't6',
        ('t6','t'): 't7',
        ('t7','f'): 't8',
        ('t8','o'): 't9',
        ('t9','r'): 't10',
        ('t10',' '): 't11',
        ('t11','d'): 't12',
        ('t12','e'): 't13',
        ('t13','l'): 't14',
        ('t14','a'): 't15',
        ('t15','y'): 't16',
    },
    start_state='t0',
    accept_states={'t16'}
)

# ── DFA 6: Stacked queries  '; DROP TABLE ────────────────────────────────
stack_dfa = DFA(
    states={'s0','s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12','s13'},
    alphabet={"'",' ',';','d','r','o','p','t','a','b','l','e'},
    transitions={
        ('s0',"'"): 's1',
        ('s1',';'): 's2',
        ('s2',' '): 's3',
        ('s3','d'): 's4',
        ('s4','r'): 's5',
        ('s5','o'): 's6',
        ('s6','p'): 's7',
        ('s7',' '): 's8',
        ('s8','t'): 's9',
        ('s9','a'): 's10',
        ('s10','b'): 's11',
        ('s11','l'): 's12',
        ('s12','e'): 's13',
    },
    start_state='s0',
    accept_states={'s13'}
)

# ── DFA 7: Tautology  ' OR 'x'='x ──────────────────────────────
tautology_dfa = DFA(
    states={'ta0','ta1','ta2','ta3','ta4','ta5','ta6','ta7','ta8','ta9'},
    alphabet={"'",'o','r','x','=',' '},
    transitions={
        ('ta0',"'"): 'ta1',
        ('ta1',' '): 'ta1',
        ('ta1','o'): 'ta2',
        ('ta2','r'): 'ta3',
        ('ta3',' '): 'ta3',
        ('ta3',"'"): 'ta4',
        ('ta4','x'): 'ta5',
        ('ta5',"'"): 'ta6',
        ('ta6','='): 'ta7',
        ('ta7',"'"): 'ta8',
        ('ta8','x'): 'ta9',
    },
    start_state='ta0',
    accept_states={'ta9'}
)

# ── DFA 8: Error-Based  ' AND 1=CONVERT(int,@@version)-- ─────
error_dfa = DFA(
    states={
        'e0','e1','e2','e3','e4','e5','e6','e7','e8',
        'e9','e10','e11','e12','e13','e14'
    },
    alphabet={"'",' ','a','n','d','1','=','c','o','v','e','r','t'},
    transitions={
        ('e0',"'"):'e1',
        ('e1',' '):'e2',
        ('e2','a'):'e3',
        ('e3','n'):'e4',
        ('e4','d'):'e5',
        ('e5',' '):'e6',
        ('e6','1'):'e7',
        ('e7','='):'e8',
        ('e8','c'):'e9',
        ('e9','o'):'e10',
        ('e10','n'):'e11',
        ('e11','v'):'e12',
        ('e12','e'):'e13',
        ('e13','r'):'e14',
    },
    start_state='e0',
    accept_states={'e14'}
)

# ── DFA 9: Out-of-Band  '; EXEC xp_cmdshell ───────────────────
oob_dfa = DFA(
    states={
        'o0','o1','o2','o3','o4','o5','o6','o7',
        'o8','o9','o10','o11','o12','o13','o14'
    },
    alphabet={
        "'",';',' ','e','x','c','p','_','m','d','s','h','l'
    },
    transitions={
        ('o0',"'"):'o1',
        ('o1',';'):'o2',
        ('o2',' '):'o3',
        ('o3','e'):'o4',
        ('o4','x'):'o5',
        ('o5','e'):'o6',
        ('o6','c'):'o7',
        ('o7',' '):'o8',
        ('o8','x'):'o9',
        ('o9','p'):'o10',
        ('o10','_'):'o11',
        ('o11','c'):'o12',
        ('o12','m'):'o13',
        ('o13','d'):'o14',
    },
    start_state='o0',
    accept_states={'o14'}
)

# ── DFA 8: Hex-encoding  0x ─────────────────────────────────────────────
hex_dfa = DFA(
    states={'h0','h1','h2'},
    alphabet={'0','x'},
    transitions={
        ('h0','0'): 'h1',
        ('h1','x'): 'h2',
    },
    start_state='h0',
    accept_states={'h2'}
)


def detect_sql(user_input):
    low = user_input.lower()

    checks = [
        ("Classic SQLi", classic_dfa, low),
        ("UNION-Based SQLi", union_dfa, low),
        ("Boolean-Blind SQLi", bool_dfa, low),
        ("Time-Based SQLi", time_dfa, low),
        ("Stacked-Query SQLi", stack_dfa, low),

        ("Tautology SQLi", tautology_dfa, low),
        ("Error-Based SQLi", error_dfa, low),
        ("Out-of-Band SQLi", oob_dfa, low),

        ("Hex-Encoding SQLi", hex_dfa, low),
        # generic "--" comment check goes last so more specific variants win
        ("Comment-Based SQLi", comment_dfa, low),
    ]

    for label, dfa, text in checks:
        accepted, path = dfa.run(text)
        if accepted:
            return label, path

    return False, []
