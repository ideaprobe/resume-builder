package pdf

import (
	"encoding/json"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestFormatBodyRendersHTMLInTemplate(t *testing.T) {
	_, filename, _, _ := runtime.Caller(0)
	templatesDir := filepath.Join(filepath.Dir(filename), "..", "..", "templates")
	gen, err := NewGenerator(templatesDir)
	if err != nil {
		t.Fatal(err)
	}

	content := map[string]any{
		"template": "default",
		"theme": map[string]string{
			"gradient": "linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)",
			"accent":   "#be123c",
			"heroTone": "light",
		},
		"sections": []any{
			map[string]any{
				"id": "basics", "type": "basics",
				"fields": map[string]string{"name": "Test", "title": "Dev", "email": "a@b.c", "phone": "1", "location": "X"},
			},
			map[string]any{
				"id": "work-1", "type": "work",
				"items": []any{
					map[string]string{
						"id": "1", "company": "Co", "position": "Eng",
						"description": "<p>321321321</p><ul><li><p>312321312</p></li></ul>",
					},
				},
			},
			map[string]any{"id": "edu-1", "type": "education", "items": []any{}},
			map[string]any{"id": "cert-1", "type": "certificates", "items": []any{}},
		},
	}
	raw, _ := json.Marshal(content)

	var htmlBuf strings.Builder
	var data resumeData
	if err := json.Unmarshal(raw, &data); err != nil {
		t.Fatal(err)
	}
	normalizeTheme(&data.Theme)
	data.Sections = orderSections(data.Sections)
	htmlData := exportHTMLData{
		resumeData: data,
		ThemeStyle: resolveThemeStyle(data.Theme),
		FontsCSS:   gen.fontsCSS,
		PrintCSS:   gen.printCSS,
		ResumeCSS:  gen.resumeCSS,
	}
	if err := gen.templateFor("default").Execute(&htmlBuf, htmlData); err != nil {
		t.Fatal(err)
	}
	out := htmlBuf.String()
	if !strings.Contains(out, `class="resume-canvas resume-sheet"`) {
		t.Fatalf("expected resume-canvas markup in output:\n%s", out)
	}
	if strings.Contains(out, "&lt;p&gt;") {
		t.Fatalf("description HTML was escaped in template output:\n%s", out)
	}
	if !strings.Contains(out, "<p>321321321</p>") {
		t.Fatalf("expected rendered paragraph in output:\n%s", out)
	}
	if !strings.Contains(out, `class="resume-meta-icon"`) {
		t.Fatalf("expected meta icons in template output:\n%s", out)
	}
}

func TestOrderSectionsPreservesUserOrder(t *testing.T) {
	sections := []section{
		{ID: "basics", Type: "basics"},
		{ID: "cert-1", Type: "certificates"},
		{ID: "work-1", Type: "work"},
		{ID: "edu-1", Type: "education"},
	}
	ordered := orderSections(sections)
	if len(ordered) != 4 {
		t.Fatalf("expected 4 sections, got %d", len(ordered))
	}
	if ordered[0].Type != "basics" || ordered[1].Type != "certificates" ||
		ordered[2].Type != "work" || ordered[3].Type != "education" {
		t.Fatalf("unexpected order: %+v", ordered)
	}
}
