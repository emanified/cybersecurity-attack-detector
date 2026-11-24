from flask import Flask, request, jsonify
from flask_cors import CORS

from classifier import classify_attack
from dfa_registry import list_dfas, get_dfa
from nfa_registry import list_nfas, get_nfa, convert_nfa

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Cybersecurity Automata Backend Running"


@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json()
    user_input = data.get("input", "")
    result = classify_attack(user_input)

    # classifier returns (attack_type, method) — method is "DFA" or None
    if isinstance(result, tuple) and len(result) == 2:
        attack_type, method = result
    else:
        attack_type, method = result, None

    # Get path from detailed detector for DFA state trace
    path = get_path(user_input, attack_type)

    return jsonify({
        "attack_type": attack_type,
        "method": method or "—",
        "details": attack_type if attack_type != "SAFE" else "Clean input",
        "pattern": get_pattern_label(attack_type),
        "path": path,
    })


@app.route("/dfa", methods=["GET"])
def dfa_list():
    return jsonify(list_dfas())


@app.route("/dfa/<dfa_id>", methods=["GET"])
def dfa_detail(dfa_id):
    variant = request.args.get("variant")
    data = get_dfa(dfa_id, variant=variant)
    if data is None:
        return jsonify({"error": f"unknown dfa id: {dfa_id}"}), 404
    return jsonify(data)


@app.route("/nfa", methods=["GET"])
def nfa_list():
    return jsonify(list_nfas())


@app.route("/nfa/<nfa_id>", methods=["GET"])
def nfa_detail(nfa_id):
    data = get_nfa(nfa_id)
    if data is None:
        return jsonify({"error": f"unknown nfa id: {nfa_id}"}), 404
    return jsonify(data)


@app.route("/nfa/<nfa_id>/dfa", methods=["GET"])
def nfa_to_dfa_route(nfa_id):
    data = convert_nfa(nfa_id)
    if data is None:
        return jsonify({"error": f"unknown nfa id: {nfa_id}"}), 404
    return jsonify(data)


def get_pattern_label(attack_type):
    patterns = {
        "XSS": "<script>…</script>",
        "Directory Traversal": "../../",
        "Brute Force": "FFFFF…S",
        "CSRF": "transfer?amount=",
        "DNS Spoofing": "domain → IP",
        "Session Hijacking": "session_token=…",
        "Buffer Overflow": "len > 100",
        "XML Injection (<role>)": "<role>…</role>",
        "XML Injection (close tag)": "</…>",
        "SAFE": "—",
    }
    if not attack_type:
        return "—"
    for k, v in patterns.items():
        if k in attack_type:
            return v
    if "SQLi" in attack_type or "SQL" in attack_type:
        return "SQL pattern"
    if "Command" in attack_type:
        return "; command"
    if "Phishing" in attack_type:
        return "lookalike URL"
    return "—"


def get_path(user_input, attack_type):
    """Re-run the specific detector to extract the DFA path."""
    if not attack_type or attack_type in ("SAFE", "ERROR"):
        return []
    try:
        if "XSS" in attack_type:
            from attacks.xss import detect_xss
            _, path = detect_xss(user_input)
            return path
        if "SQL" in attack_type or "SQLi" in attack_type:
            from attacks.sql_injection import detect_sql
            _, path = detect_sql(user_input)
            return path
        if "Command" in attack_type:
            from attacks.command_injection import detect_command_injection
            _, path = detect_command_injection(user_input)
            return path
        if "Traversal" in attack_type:
            from attacks.traversal import detect_traversal
            _, path = detect_traversal(user_input)
            return path
        if "Brute" in attack_type:
            from attacks.bruteforce import detect_bruteforce
            import re
            norm = re.sub(r"[Ff]", "F", user_input)
            norm = re.sub(r"[Ss]", "S", norm)
            attempt = re.sub(r"[^FS]", "", norm)
            _, path = detect_bruteforce(attempt)
            return path
        if "Phishing" in attack_type:
            from attacks.phishing import detect_phishing
            _, path = detect_phishing(user_input)
            return path
        if "CSRF" in attack_type:
            from attacks.csrf import detect_csrf
            _, path = detect_csrf(user_input)
            return path
        if "Buffer" in attack_type:
            from attacks.buffer_overflow import detect_buffer_overflow
            _, path = detect_buffer_overflow(user_input)
            return path
        if "DNS" in attack_type:
            from attacks.dns_spoofing import detect_dns_spoofing
            _, path = detect_dns_spoofing(user_input)
            return path
        if "Session" in attack_type:
            from attacks.session_hijacking import detect_session_hijacking
            _, path = detect_session_hijacking(user_input)
            return path
        if "XML" in attack_type:
            from attacks.xml_injection import detect_xml_injection
            _, path = detect_xml_injection(user_input)
            return path
    except Exception:
        pass
    return []


if __name__ == "__main__":
    app.run(debug=True, port=5001)
