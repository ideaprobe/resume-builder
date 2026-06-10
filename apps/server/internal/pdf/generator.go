package pdf

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"html"
	"os"
	"path/filepath"
	"strings"
	"text/template"
	"time"

	"github.com/chromedp/cdproto/emulation"
	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
)

// A4 at 96 CSS px/in: 210mm × 297mm → 794 × 1123 px
const (
	a4WidthPx    = 794
	a4HeightPx   = 1123
	a4WidthInch  = 8.267716535433
	a4HeightInch = 11.692913385826
)

type Generator struct {
	tmpl      *template.Template
	fontsCSS  string
	printCSS  string
	resumeCSS string
}

type resumeData struct {
	Template string      `json:"template"`
	Theme    themeData   `json:"theme"`
	Sections []section   `json:"sections"`
}

type exportHTMLData struct {
	resumeData
	ThemeStyle string
	FontsCSS   string
	PrintCSS   string
	ResumeCSS  string
}

type themeData struct {
	BackgroundColor string `json:"backgroundColor"`
	Gradient        string `json:"gradient"`
	Accent          string `json:"accent"`
	HeroTone        string `json:"heroTone"`
	HeroText        string `json:"heroText"`
	HeroTextMuted   string `json:"heroTextMuted"`
}

type section struct {
	ID     string              `json:"id"`
	Type   string              `json:"type"`
	Title  string              `json:"title"`
	Fields map[string]string   `json:"fields"`
	Items  []map[string]string `json:"items"`
}

func NewGenerator(templatesDir string) (*Generator, error) {
	path := filepath.Join(templatesDir, "resume.html")
	funcs := template.FuncMap{
		"add":        func(a, b int) int { return a + b },
		"mod":        func(a, b int) int { return a % b },
		"esc":        html.EscapeString,
		"formatBody": formatBodyHTML,
	}
	tmpl, err := template.New("resume.html").Funcs(funcs).ParseFiles(path)
	if err != nil {
		return nil, err
	}

	fontsCSS, printCSS, resumeCSS, err := loadExportCSS(templatesDir)
	if err != nil {
		return nil, err
	}

	return &Generator{
		tmpl:      tmpl,
		fontsCSS:  fontsCSS,
		printCSS:  printCSS,
		resumeCSS: resumeCSS,
	}, nil
}

func loadExportCSS(templatesDir string) (fonts, print, resume string, err error) {
	exportDir := filepath.Join(templatesDir, "export")
	fontsBytes, err := os.ReadFile(filepath.Join(exportDir, "fonts.css"))
	if err != nil {
		return "", "", "", fmt.Errorf("read fonts.css: %w", err)
	}
	printBytes, err := os.ReadFile(filepath.Join(exportDir, "print.css"))
	if err != nil {
		return "", "", "", fmt.Errorf("read print.css: %w", err)
	}
	resumeBytes, err := os.ReadFile(filepath.Join(exportDir, "resume-canvas.css"))
	if err != nil {
		webPath := filepath.Join(templatesDir, "..", "..", "web", "src", "styles", "resume.css")
		resumeBytes, err = os.ReadFile(webPath)
		if err != nil {
			return "", "", "", fmt.Errorf("read resume-canvas.css: %w", err)
		}
	}
	return string(fontsBytes), string(printBytes), string(resumeBytes), nil
}

func (g *Generator) Generate(content json.RawMessage) ([]byte, error) {
	var data resumeData
	if err := json.Unmarshal(content, &data); err != nil {
		return nil, err
	}
	normalizeTheme(&data.Theme)
	data.Sections = orderSections(data.Sections)

	htmlData := exportHTMLData{
		resumeData: data,
		ThemeStyle: resolveThemeStyle(data.Theme),
		FontsCSS:   g.fontsCSS,
		PrintCSS:   g.printCSS,
		ResumeCSS:  g.resumeCSS,
	}

	var htmlBuf bytes.Buffer
	if err := g.tmpl.Execute(&htmlBuf, htmlData); err != nil {
		return nil, err
	}

	tmpFile, err := os.CreateTemp("", "resume-*.html")
	if err != nil {
		return nil, err
	}
	defer os.Remove(tmpFile.Name())

	if _, err := tmpFile.Write(htmlBuf.Bytes()); err != nil {
		return nil, err
	}
	tmpFile.Close()

	fileURL := "file://" + tmpFile.Name()
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	ctx, cancel = context.WithTimeout(ctx, 45*time.Second)
	defer cancel()

	var pdfBuf []byte
	err = chromedp.Run(ctx,
		chromedp.EmulateViewport(a4WidthPx, a4HeightPx),
		chromedp.Navigate(fileURL),
		chromedp.WaitVisible(`.resume-canvas`, chromedp.ByQuery),
		waitForFonts(),
		chromedp.ActionFunc(func(ctx context.Context) error {
			if err := emulation.SetDeviceMetricsOverride(
				a4WidthPx, a4HeightPx, 1, false,
			).WithScreenOrientation(&emulation.ScreenOrientation{
				Type:  emulation.OrientationTypePortraitPrimary,
				Angle: 0,
			}).Do(ctx); err != nil {
				return err
			}
			var err error
			pdfBuf, _, err = page.PrintToPDF().
				WithPrintBackground(true).
				WithPaperWidth(a4WidthInch).
				WithPaperHeight(a4HeightInch).
				WithMarginTop(0).
				WithMarginBottom(0).
				WithMarginLeft(0).
				WithMarginRight(0).
				WithScale(1).
				Do(ctx)
			return err
		}),
	)
	if err != nil {
		return nil, fmt.Errorf("chromedp: %w", err)
	}
	return pdfBuf, nil
}

func normalizeTheme(t *themeData) {
	if t.Gradient == "" {
		if t.BackgroundColor != "" {
			t.Gradient = t.BackgroundColor
		} else {
			t.Gradient = "linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #7c3aed 100%)"
		}
	}
	if t.Accent == "" {
		t.Accent = "#5b5bd6"
	}
	if t.HeroTone == "" {
		t.HeroTone = "light"
	}
	if t.HeroText == "" {
		if t.HeroTone == "dark" {
			t.HeroText = "#0f172a"
		} else {
			t.HeroText = "#ffffff"
		}
	}
	if t.HeroTextMuted == "" {
		if t.HeroTone == "dark" {
			t.HeroTextMuted = "#334155"
		} else {
			t.HeroTextMuted = "#f1f5f9"
		}
	}
}

func waitForFonts() chromedp.ActionFunc {
	return func(ctx context.Context) error {
		deadline := time.Now().Add(8 * time.Second)
		for time.Now().Before(deadline) {
			var status string
			if err := chromedp.Evaluate(`document.fonts ? document.fonts.status : "loaded"`, &status).Do(ctx); err != nil {
				return err
			}
			if status == "loaded" {
				time.Sleep(200 * time.Millisecond)
				return nil
			}
			time.Sleep(100 * time.Millisecond)
		}
		return nil
	}
}

func orderSections(sections []section) []section {
	var basics []section
	rest := make([]section, 0, len(sections))
	for _, s := range sections {
		if s.Type == "basics" {
			basics = append(basics, s)
		} else {
			rest = append(rest, s)
		}
	}
	out := make([]section, 0, len(sections))
	out = append(out, basics...)
	out = append(out, rest...)
	return out
}

func formatBodyHTML(s string) string {
	if s == "" {
		return ""
	}
	s = html.UnescapeString(s)
	if strings.Contains(s, "<") {
		return s
	}
	return strings.ReplaceAll(html.EscapeString(s), "\n", "<br>")
}
