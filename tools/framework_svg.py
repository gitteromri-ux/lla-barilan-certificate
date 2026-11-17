"""Generates the Evidence-to-Practice Model diagram (static SVG markup)."""
import math

R_SCOPE = 318
R_DOM_OUT, R_DOM_IN = 284, 228
R_APPR = 207
R_METHOD = 146
R_NODE = 40
R_CORE = 84

DOMAINS = [
    ("c1", "Biology of aging", "#6FA8FF", "Course 1 · The Science of Longevity"),
    ("c2", "Food & nutrition", "#E8A75A", "Course 2 · Food as Medicine"),
    ("c3", "Habits & behavior", "#F0BC7C", "Course 3 · Habits That Shape Health"),
    ("c4", "Sleep & stress", "#D9944A", "Course 4 · Sleep, Stress, and Healthy Aging"),
    ("c5", "Purpose & emotion", "#5FB6B0", "Course 5 · Purpose, Meaning, and Emotional Wellbeing"),
    ("c6", "Social connection", "#86CFC9", "Course 6 · Social Connection and Longevity"),
]
NODES = [("assess", "Assess", -90), ("plan", "Plan", 0), ("support", "Support", 90), ("review", "Review", 180)]


def pt(r, deg):
    a = math.radians(deg)
    return r * math.cos(a), r * math.sin(a)


def f(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def arc_path(r, a0, a1):
    x0, y0 = pt(r, a0)
    x1, y1 = pt(r, a1)
    large = 1 if abs(a1 - a0) > 180 else 0
    sweep = 1 if a1 > a0 else 0
    return f"M{f(x0)} {f(y0)} A{r} {r} 0 {large} {sweep} {f(x1)} {f(y1)}"


def ring_segment(r0, r1, a0, a1):
    xo0, yo0 = pt(r1, a0)
    xo1, yo1 = pt(r1, a1)
    xi1, yi1 = pt(r0, a1)
    xi0, yi0 = pt(r0, a0)
    large = 1 if (a1 - a0) > 180 else 0
    return (f"M{f(xo0)} {f(yo0)} A{r1} {r1} 0 {large} 1 {f(xo1)} {f(yo1)} "
            f"L{f(xi1)} {f(yi1)} A{r0} {r0} 0 {large} 0 {f(xi0)} {f(yi0)} Z")


def label_arc(r, center, span):
    """Path for textPath; reversed on the lower half so text stays upright."""
    a0, a1 = center - span / 2, center + span / 2
    if 0 < (center % 360) < 180:
        return arc_path(r, a1, a0)
    return arc_path(r, a0, a1)


def build():
    out = []
    out.append('<svg class="fw-svg draw" viewBox="-335 -335 670 670" role="img" aria-labelledby="fwTitle fwDesc">')
    out.append('<title id="fwTitle">The Evidence-to-Practice Model</title>')
    out.append('<desc id="fwDesc">Three layers: an outer evidence layer of six domains with evidence appraisal; a middle method layer, the advisory cycle of assess, plan, support and review; and a core of professional judgment covering boundaries, red flags and referral, all inside the approved non-clinical scope of practice.</desc>')
    out.append('<defs>'
               '<radialGradient id="fwCore" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#2B5C9E"/><stop offset=".55" stop-color="#123463"/><stop offset="1" stop-color="#081A38"/></radialGradient>'
               '<linearGradient id="fwAppr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8BB7EE" stop-opacity=".55"/><stop offset="1" stop-color="#E8F1FF" stop-opacity=".18"/></linearGradient>'
               '<filter id="fwGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
               '<marker id="fwArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="#E8F1FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker>'
               '</defs>')

    # Scope boundary (judgment layer)
    out.append('<g data-el data-layer="judgment" data-key="scope">')
    out.append(f'<circle r="{R_SCOPE}" fill="none" stroke="rgba(139,183,238,.45)" stroke-width="1.2" stroke-dasharray="2 7"/>')
    out.append(f'<path id="fwScopeTop" d="{arc_path(R_SCOPE - 14, -150, -30)}" fill="none"/>')
    out.append('<text class="ring-label"><textPath href="#fwScopeTop" startOffset="50%" text-anchor="middle">Approved non-clinical scope of practice</textPath></text>')
    out.append(f'<path id="fwScopeBot" d="{arc_path(R_SCOPE - 4, 150, 30)}" fill="none"/>')
    out.append('<text class="ring-label"><textPath href="#fwScopeBot" startOffset="50%" text-anchor="middle">Boundaries · ethics · referral</textPath></text>')
    out.append('</g>')

    # Evidence domains
    gap = 1.8
    for i, (key, label, color, course) in enumerate(DOMAINS):
        center = -90 + i * 60
        a0, a1 = center - 30 + gap / 2, center + 30 - gap / 2
        out.append(f'<g data-el data-layer="evidence" data-key="{key}" tabindex="0" role="button" aria-label="{label} — {course}">')
        out.append(f'<path d="{ring_segment(R_DOM_IN, R_DOM_OUT, a0, a1)}" fill="{color}" fill-opacity=".92" stroke="rgba(255,255,255,.35)" stroke-width=".8"/>')
        lid = f"fwL{key}"
        out.append(f'<path id="{lid}" d="{label_arc((R_DOM_IN + R_DOM_OUT) / 2 - 5, center, 56)}" fill="none"/>')
        out.append(f'<text class="arc-label"><textPath href="#{lid}" startOffset="50%" text-anchor="middle">{label}</textPath></text>')
        out.append('</g>')

    # Evidence appraisal band
    out.append('<g data-el data-layer="evidence" data-key="appraisal" tabindex="0" role="button" aria-label="Evidence appraisal">')
    out.append(f'<circle r="{R_APPR}" fill="none" stroke="url(#fwAppr)" stroke-width="18" stroke-opacity=".55"/>')
    out.append(f'<circle r="{R_APPR + 9}" fill="none" stroke="rgba(232,241,255,.35)" stroke-width=".8"/>')
    out.append(f'<circle r="{R_APPR - 9}" fill="none" stroke="rgba(232,241,255,.2)" stroke-width=".8"/>')
    out.append(f'<path id="fwApprTop" d="{arc_path(R_APPR - 3.5, -160, -20)}" fill="none"/>')
    out.append('<text class="ring-label" style="fill:#E8F1FF"><textPath href="#fwApprTop" startOffset="50%" text-anchor="middle">Evidence appraisal</textPath></text>')
    out.append(f'<path id="fwApprBot" d="{arc_path(R_APPR + 4.5, 160, 20)}" fill="none"/>')
    out.append('<text class="ring-label" style="fill:#E8F1FF"><textPath href="#fwApprBot" startOffset="50%" text-anchor="middle">Established · emerging · unsupported</textPath></text>')
    out.append('</g>')

    # Method cycle
    out.append('<g data-el data-layer="method" data-key="cycle">')
    out.append(f'<circle class="draw-c" r="{R_METHOD}" fill="none" stroke="rgba(232,241,255,.28)" stroke-width="1.2" style="--len:{2 * math.pi * R_METHOD:.0f}"/>')
    node_gap = math.degrees(R_NODE / R_METHOD) + 4
    for _, _, ang in NODES:
        a0, a1 = ang + node_gap, ang + 90 - node_gap
        out.append(f'<path d="{arc_path(R_METHOD, a0, a1)}" fill="none" stroke="#E8F1FF" stroke-width="1.6" marker-end="url(#fwArrow)" opacity=".85"/>')
    out.append(f'<circle class="orbit-dot" r="4.5" fill="#E8F1FF"><animateMotion dur="9s" repeatCount="indefinite" path="M0 -{R_METHOD} A{R_METHOD} {R_METHOD} 0 1 1 -0.01 -{R_METHOD}"/></circle>')
    out.append('</g>')
    for key, label, ang in NODES:
        x, y = pt(R_METHOD, ang)
        out.append(f'<g data-el data-layer="method" data-key="{key}" tabindex="0" role="button" aria-label="{label}">')
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{R_NODE}" fill="#0D2A52" stroke="#8BB7EE" stroke-width="1.5" filter="url(#fwGlow)"/>')
        out.append(f'<text class="node-label" x="{f(x)}" y="{f(y + 6)}" text-anchor="middle">{label}</text>')
        out.append('</g>')

    # Judgment core
    out.append('<g data-el data-layer="judgment" data-key="core" tabindex="0" role="button" aria-label="Professional judgment">')
    out.append(f'<circle r="{R_CORE}" fill="url(#fwCore)" stroke="rgba(232,241,255,.45)" stroke-width="1.2"/>')
    out.append(f'<circle r="{R_CORE + 8}" fill="none" stroke="rgba(139,183,238,.25)" stroke-width="1" stroke-dasharray="1 5"/>')
    out.append('<text class="core-t" x="0" y="2" text-anchor="middle">Judgment</text>')
    out.append('<text class="core-s" x="0" y="26" text-anchor="middle">Boundaries · red flags</text>')
    out.append('<text class="core-s" x="0" y="42" text-anchor="middle">referral</text>')
    out.append('</g>')
    out.append('</svg>')
    return "\n".join(out)


if __name__ == "__main__":
    print(build())
