package pdf

import "testing"

func TestResolveThemeStyleMeshRegionalGradient(t *testing.T) {
	regional := "radial-gradient(ellipse 400px 280px at 10% 14%, rgba(253, 230, 138, 0.48) 0%, transparent 70%)"
	style := resolveThemeStyle(themeData{
		Gradient:      regional,
		GradientStyle: "mesh",
		Accent:        "#b45309",
		HeroTone:      "dark",
	})
	if !contains(style, "--resume-regional-gradient:"+regional) {
		t.Fatalf("expected regional gradient var, got: %s", style)
	}
}

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
