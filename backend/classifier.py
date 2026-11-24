import re

from attacks.xss import detect_xss
from attacks.traversal import detect_traversal
from attacks.sql_injection import detect_sql
from attacks.bruteforce import detect_bruteforce
from attacks.command_injection import detect_command_injection
from attacks.buffer_overflow import detect_buffer_overflow
from attacks.phishing import detect_phishing
from attacks.csrf import detect_csrf
from attacks.dns_spoofing import detect_dns_spoofing
from attacks.session_hijacking import detect_session_hijacking
from attacks.xml_injection import detect_xml_injection


def classify_attack(user_input):

    lower = user_input.lower()

    # ── 1. XSS — <script> tag ────────────────────────────────────────────
    if "<" in user_input and "script" in lower:
        accepted, path = detect_xss(user_input)
        if accepted:
            return "XSS", "DFA"

    # ── 2. Command Injection — ;ls or ;cat ───────────────────────────────
    if ";" in user_input:
        label, path = detect_command_injection(user_input)
        if label:
            return label, "DFA"

    # ── 3. Directory Traversal — ../../ ──────────────────────────────────
    if "../" in user_input or "..\\" in user_input:
        accepted, path = detect_traversal(user_input)
        if accepted:
            return "Directory Traversal", "DFA"

    # ── 4. Brute Force — 5+ consecutive failed logins ────────────────────
    if re.search(r"[Ff]{5}", user_input):
        normalised = re.sub(r"[Ff]", "F", user_input)
        normalised = re.sub(r"[Ss]", "S", normalised)
        attempt_string = re.sub(r"[^FS]", "", normalised)
        if attempt_string:
            accepted, path = detect_bruteforce(attempt_string)
            if accepted:
                return "Brute Force", "DFA"

    # ── 5. Phishing — paypa1.com / leet substitution ─────────────────────
    if re.search(r"[a-z0-9]+\.[a-z]{2,}", lower):
        label, path = detect_phishing(user_input)
        if label:
            return label, "DFA"

    # ── 6. CSRF — transfer?amount= ───────────────────────────────────────
    if "transfer" in lower and "amount" in lower:
        label, path = detect_csrf(user_input)
        if label:
            return label, "DFA"

    # ── 7. Buffer Overflow — input > 100 chars ────────────────────────────
    if len(user_input) > 100:
        label, path = detect_buffer_overflow(user_input)
        if label:
            return label, "DFA"

    # ── 8. DNS Spoofing — known domain → fake IP ─────────────────────────
    if re.search(r"[a-z]{3,}\.[a-z]{2,}\s*(->|=>|\u2192|:)\s*\d", lower):
        label, path = detect_dns_spoofing(user_input)
        if label:
            return label, "DFA"

    # ── 9. Session Hijacking — duplicate session token ───────────────────
    if "session" in lower:
        label, path = detect_session_hijacking(user_input)
        if label:
            return label, "DFA"

    # ── 10. XML Injection — <role> in input ──────────────────────────────
    if "<" in user_input:
        label, path = detect_xml_injection(user_input)
        if label:
            return label, "DFA"

    # ── 11. SQL Injection — all 10 variants ──────────────────────────────
    if ("'" in user_input or "0x" in lower or "union" in lower or "select" in lower
            or "convert" in lower or "xp_cmdshell" in lower or "nslookup" in lower
            or "extractvalue" in lower or "updatexml" in lower or "cast(" in lower):
        label, path = detect_sql(user_input)
        if label:
            return label, "DFA"

    return "SAFE", None
