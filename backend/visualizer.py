"""
DFA Visualisers — one per attack type.
Each class accepts a parent widget (Frame) and exposes .animate().
"""
import tkinter as tk

# ── shared colour scheme ──────────────────────────────────────────────────
BG_CANVAS  = "#161b22"
CLR_IDLE   = "#21262d"
CLR_ACTIVE = "#3fb950"
CLR_ACCEPT = "#f85149"
CLR_BORDER = "#58a6ff"
CLR_TEXT   = "#e6edf3"
CLR_ARROW  = "#8b949e"
DELAY_MS   = 600


# ── base class ────────────────────────────────────────────────────────────
class _BaseDFAViz:
    """
    Draws a horizontal chain of states with labelled arrows.

    Subclasses set:
        STATES  – list of state labels in order
        LABELS  – transition labels between consecutive states (len = len(STATES)-1)
        ACCEPT  – index of the accept state
        TITLE   – short description shown above the canvas
    """
    STATES  = []
    LABELS  = []
    ACCEPT  = -1
    TITLE   = "DFA"
    W       = 820
    H       = 170
    DELAY   = DELAY_MS

    def __init__(self, parent):
        self.parent  = parent
        self.canvas  = tk.Canvas(parent, width=self.W, height=self.H,
                                 bg=BG_CANVAS, highlightthickness=0)
        self.canvas.pack(padx=10, pady=6)
        self._ovals  = {}
        self._draw()

    def _draw(self):
        n   = len(self.STATES)
        gap = min(110, (self.W - 60) // max(n, 1))
        cx  = 50
        cy  = self.H // 2

        for i, label in enumerate(self.STATES):
            x, y = cx + i * gap, cy
            r    = 26
            oval = self.canvas.create_oval(
                x - r, y - r, x + r, y + r,
                fill=CLR_IDLE, outline=CLR_BORDER, width=2
            )
            if i == self.ACCEPT or (self.ACCEPT == -1 and i == n - 1):
                self.canvas.create_oval(
                    x - r + 4, y - r + 4, x + r - 4, y + r - 4,
                    outline=CLR_BORDER, width=1
                )
            self.canvas.create_text(x, y, text=label,
                                    font=("Consolas", 9, "bold"), fill=CLR_TEXT)
            self._ovals[i] = (oval, x, y)

            if i < len(self.LABELS):
                nx = cx + (i + 1) * gap
                mid = (x + nx) // 2
                self.canvas.create_line(x + r, y, nx - r, y,
                                        arrow=tk.LAST, fill=CLR_ARROW, width=2)
                self.canvas.create_text(mid, y - 16, text=self.LABELS[i],
                                        font=("Consolas", 9), fill=CLR_TEXT)

    def _colour(self, idx, colour):
        oval, *_ = self._ovals[idx]
        self.canvas.itemconfig(oval, fill=colour)
        self.canvas.update()

    def _reset(self):
        for i in self._ovals:
            self._colour(i, CLR_IDLE)

    def animate(self):
        self._reset()
        self._step(0)

    def _step(self, idx):
        n = len(self.STATES)
        if idx >= n:
            return
        is_accept = (idx == self.ACCEPT) or (self.ACCEPT == -1 and idx == n - 1)
        colour = CLR_ACCEPT if is_accept else CLR_ACTIVE
        self._colour(idx, colour)
        self.parent.after(self.DELAY, self._step, idx + 1)


# ── concrete visualisers ──────────────────────────────────────────────────

class XSSVisualizer(_BaseDFAViz):
    TITLE  = "XSS — <script> pattern"
    STATES = ["q0","q1","q2","q3","q4","q5","q6","q7","q8"]
    LABELS = ["<","s","c","r","i","p","t",">"]
    W      = 880

class BruteForceVisualizer(_BaseDFAViz):
    TITLE  = "Brute Force — 5 consecutive failures"
    STATES = ["q0","q1","q2","q3","q4","q5"]
    LABELS = ["F","F","F","F","F"]

class TraversalVisualizer(_BaseDFAViz):
    TITLE  = "Directory Traversal — ../ pattern"
    STATES = ["q0","q1","q2","q3"]
    LABELS = [".",".","/"]

class CommandInjectionVisualizer(_BaseDFAViz):
    TITLE  = "Command Injection — ;ls pattern"
    STATES = ["q0","q1","q2","q3"]
    LABELS = [";","l","s"]

class BufferOverflowVisualizer(_BaseDFAViz):
    TITLE  = "Buffer Overflow — input > 100 chars"
    STATES = ["start","counting","overflow"]
    LABELS = ["chars…","len>100"]

class PhishingVisualizer(_BaseDFAViz):
    TITLE  = "Phishing — paypa1 leet spoof"
    STATES = ["q0","q1","q2","q3","q4","q5","q6"]
    LABELS = ["p","a","y","p","a","1"]

class CSRFVisualizer(_BaseDFAViz):
    TITLE  = "CSRF — transfer?amount= pattern"
    STATES = ["q0","q1","q2","q3","q4","q5","q6","q7","q8",
              "q9","q10","q11","q12","q13","q14","q15","q16"]
    LABELS = list("transfer?amount=")
    W      = 880

class DNSSpoofingVisualizer(_BaseDFAViz):
    TITLE  = "DNS Spoofing — domain → fake IP"
    STATES = ["start","domain","dot","digits","dot2","fakeIP"]
    LABELS = ["a-z","·","0-9","·","0-9"]

class SessionHijackingVisualizer(_BaseDFAViz):
    TITLE  = "Session Hijacking — session_id= token"
    STATES = ["q0","q1","q2","q3","q4","q5","q6","q7"]
    LABELS = ["s","e","s","s","i","o","n"]

class XMLInjectionVisualizer(_BaseDFAViz):
    TITLE  = "XML Injection — <role> tag"
    STATES = ["q0","q1","q2","q3","q4","q5","q6"]
    LABELS = ["<","r","o","l","e",">"]

class SQLInjectionVisualizer(_BaseDFAViz):
    TITLE  = "SQL Injection — ' OR '1'='1 pattern"
    STATES = ["q0","q1","q2","q3","q4","q5","q6"]
    LABELS = ["'","OR","'1","'=","'1",""]
    ACCEPT = 6


# ── standalone test ───────────────────────────────────────────────────────
if __name__ == "__main__":
    root = tk.Tk()
    root.title("All DFA Visualisers")
    root.configure(bg="#0d1117")

    classes = [
        XSSVisualizer, BruteForceVisualizer, TraversalVisualizer,
        CommandInjectionVisualizer, BufferOverflowVisualizer,
        PhishingVisualizer, CSRFVisualizer, DNSSpoofingVisualizer,
        SessionHijackingVisualizer, XMLInjectionVisualizer,
        SQLInjectionVisualizer
    ]

    frames = []
    for cls in classes:
        f = tk.Frame(root, bg="#161b22", pady=4)
        f.pack(fill="x", padx=10, pady=2)
        tk.Label(f, text=cls.TITLE, font=("Consolas", 9),
                 bg="#161b22", fg="#8b949e").pack(anchor="w")
        viz = cls(f)
        frames.append(viz)

    tk.Button(root, text="Animate All",
              command=lambda: [v.animate() for v in frames],
              font=("Consolas", 11), bg="#58a6ff", fg="#0d1117").pack(pady=8)
    root.mainloop()
