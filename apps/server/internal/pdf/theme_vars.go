package pdf

import (
	"fmt"
	"strconv"
	"strings"
)

func resolveThemeStyle(t themeData) string {
	heroTone := t.HeroTone
	if heroTone == "" {
		heroTone = "light"
	}
	heroText := t.HeroText
	heroTextMuted := t.HeroTextMuted
	if heroText == "" {
		if heroTone == "dark" {
			heroText = "#0f172a"
		} else {
			heroText = "#ffffff"
		}
	}
	if heroTextMuted == "" {
		if heroTone == "dark" {
			heroTextMuted = "#334155"
		} else {
			heroTextMuted = "#f1f5f9"
		}
	}

	gradient := t.Gradient
	if gradient == "" {
		if t.BackgroundColor != "" {
			gradient = t.BackgroundColor
		} else {
			gradient = "linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #7c3aed 100%)"
		}
	}
	accent := t.Accent
	if accent == "" {
		accent = "#5b5bd6"
	}

	vars := map[string]string{
		"--resume-gradient": gradient,
		"--r-accent":        accent,
		"--r-accent-soft":   accentAlpha(accent, 0.1),
		"--r-accent-border": accentAlpha(accent, 0.24),
		"--r-hover":         accentAlpha(accent, 0.06),
		"--r-focus":         accentAlpha(accent, 0.12),
		"--r-on-gradient":   heroText,
	}

	if heroTone == "light" {
		vars["--r-on-gradient-muted"] = heroTextMuted
		vars["--r-on-gradient-soft"] = "rgba(255, 255, 255, 0.16)"
		vars["--r-on-gradient-pill"] = "rgba(255, 255, 255, 0.22)"
		vars["--r-on-gradient-pill-border"] = "rgba(255, 255, 255, 0.38)"
		vars["--r-on-gradient-shadow"] = "0 1px 2px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.22)"
		vars["--r-hero-overlay"] = "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 45%, rgba(0,0,0,0.14) 100%)"
		vars["--r-meta-icon-color"] = heroText
		vars["--r-pill-shadow"] = "0 1px 3px rgba(0, 0, 0, 0.2)"
	} else {
		vars["--r-on-gradient-muted"] = heroTextMuted
		vars["--r-on-gradient-soft"] = "rgba(255, 255, 255, 0.45)"
		vars["--r-on-gradient-pill"] = "rgba(255, 255, 255, 0.62)"
		vars["--r-on-gradient-pill-border"] = "rgba(255, 255, 255, 0.75)"
		vars["--r-on-gradient-shadow"] = "0 1px 2px rgba(255, 255, 255, 0.85)"
		vars["--r-hero-overlay"] = "linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0.08) 100%)"
		vars["--r-meta-icon-color"] = heroTextMuted
		vars["--r-pill-shadow"] = "0 1px 2px rgba(15, 23, 42, 0.06)"
	}

	parts := make([]string, 0, len(vars))
	for k, v := range vars {
		parts = append(parts, fmt.Sprintf("%s:%s", k, v))
	}
	return strings.Join(parts, ";")
}

func accentAlpha(hex string, alpha float64) string {
	r, g, b, ok := hexToRGB(hex)
	if !ok {
		return fmt.Sprintf("rgba(91, 110, 234, %g)", alpha)
	}
	return fmt.Sprintf("rgba(%d, %d, %d, %g)", r, g, b, alpha)
}

func hexToRGB(hex string) (int, int, int, bool) {
	h := strings.TrimPrefix(strings.TrimSpace(hex), "#")
	if len(h) == 3 {
		h = string([]byte{h[0], h[0], h[1], h[1], h[2], h[2]})
	}
	if len(h) != 6 {
		return 0, 0, 0, false
	}
	r, err1 := strconv.ParseInt(h[0:2], 16, 64)
	g, err2 := strconv.ParseInt(h[2:4], 16, 64)
	b, err3 := strconv.ParseInt(h[4:6], 16, 64)
	if err1 != nil || err2 != nil || err3 != nil {
		return 0, 0, 0, false
	}
	return int(r), int(g), int(b), true
}
