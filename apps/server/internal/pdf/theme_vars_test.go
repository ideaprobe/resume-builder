package pdf

import "testing"

func TestResolveThemeStyleMatchesAccentAlpha(t *testing.T) {
	style := resolveThemeStyle(themeData{
		Gradient:      "linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)",
		Accent:        "#be123c",
		HeroTone:      "light",
		HeroText:      "#ffffff",
		HeroTextMuted: "#f1f5f9",
	})
	if !containsAll(style, []string{
		"--resume-gradient:linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)",
		"--r-accent:#be123c",
		"--r-accent-soft:rgba(190, 18, 60, 0.1)",
		"--r-on-gradient-muted:#f1f5f9",
	}) {
		t.Fatalf("unexpected theme style: %s", style)
	}
}

func containsAll(s string, parts []string) bool {
	for _, p := range parts {
		if !contains(s, p) {
			return false
		}
	}
	return true
}

func contains(s, sub string) bool {
	return len(s) >= len(sub) && (s == sub || len(sub) == 0 || indexOf(s, sub) >= 0)
}

func indexOf(s, sub string) int {
	for i := 0; i+len(sub) <= len(s); i++ {
		if s[i:i+len(sub)] == sub {
			return i
		}
	}
	return -1
}
