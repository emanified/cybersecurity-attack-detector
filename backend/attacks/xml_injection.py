# from dfa import DFA

# # XML Injection: detects <role> or other injected XML tags in input
# # DFA: < r o l e >

# role_dfa = DFA(
#     states={f'q{i}' for i in range(7)},
#     alphabet={'<','r','o','l','e','>'},
#     transitions={
#         ('q0','<'): 'q1',
#         ('q1','r'): 'q2',
#         ('q2','o'): 'q3',
#         ('q3','l'): 'q4',
#         ('q4','e'): 'q5',
#         ('q5','>'): 'q6',
#     },
#     start_state='q0',
#     accept_states={'q6'}
# )

# # Also detect </  (closing tag injection)
# close_tag_dfa = DFA(
#     states={'t0','t1','t2'},
#     alphabet={'<','/'},
#     transitions={
#         ('t0','<'): 't1',
#         ('t1','/'): 't2',
#     },
#     start_state='t0',
#     accept_states={'t2'}
# )

# def detect_xml_injection(user_input):
#     low = user_input.lower()
#     for label, dfa in [("XML Injection (<role>)", role_dfa),
#                         ("XML Injection (close tag)", close_tag_dfa)]:
#         accepted, path = dfa.run(low)
#         if accepted:
#             return label, path
#     return False, []


from dfa import DFA
import re

HTML_TAGS = {'div','p','h1','h2','h3','h4','h5','h6','span','a','img',
             'table','tr','td','th','ul','ol','li','form','input','button',
             'script','style','head','body','html','br','hr','b','i','u'}

# matches any <tag> or </tag>
tag_dfa = DFA(
    states={'q0','q1','q2','q3'},
    alphabet={'<','>'} | set('abcdefghijklmnopqrstuvwxyz'),
    transitions={
        ('q0','<'): 'q1',
        **{('q1', c): 'q2' for c in 'abcdefghijklmnopqrstuvwxyz'},
        **{('q2', c): 'q2' for c in 'abcdefghijklmnopqrstuvwxyz'},
        ('q2','>'): 'q3',
    },
    start_state='q0',
    accept_states={'q3'}
)

def detect_xml_injection(user_input):
    low = user_input.lower()
    # extract tag names and skip if known html tag
    tag_match = re.findall(r'</?([a-z]+)', low)
    for tag in tag_match:
        if tag not in HTML_TAGS:
            accepted, path = tag_dfa.run(low)
            if accepted:
                return "XML Injection", path
    return False, []