package pdf

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"time"

	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
)

type Generator struct {
	tmpl *template.Template
}

type resumeData struct {
	Template string      `json:"template"`
	Theme    themeData   `json:"theme"`
	Sections []section   `json:"sections"`
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
	ID     string          `json:"id"`
	Type   string          `json:"type"`
	Title  string          `json:"title"`
	Fields map[string]string `json:"fields"`
	Items  []map[string]string `json:"items"`
}

func NewGenerator(templatesDir string) (*Generator, error) {
	path := filepath.Join(templatesDir, "resume.html")
	funcs := template.FuncMap{
		"add": func(a, b int) int { return a + b },
		"mod": func(a, b int) int { return a % b },
	}
	tmpl, err := template.New("resume.html").Funcs(funcs).ParseFiles(path)
	if err != nil {
		return nil, err
	}
	return &Generator{tmpl: tmpl}, nil
}

func (g *Generator) Generate(content json.RawMessage) ([]byte, error) {
	var data resumeData
	if err := json.Unmarshal(content, &data); err != nil {
		return nil, err
	}
	if data.Theme.Gradient == "" {
		if data.Theme.BackgroundColor != "" {
			data.Theme.Gradient = data.Theme.BackgroundColor
		} else {
			data.Theme.Gradient = "linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #7c3aed 100%)"
		}
	}
	if data.Theme.Accent == "" {
		data.Theme.Accent = "#5b5bd6"
	}
	if data.Theme.HeroTone == "" {
		data.Theme.HeroTone = "light"
	}
	if data.Theme.HeroText == "" {
		if data.Theme.HeroTone == "dark" {
			data.Theme.HeroText = "#0f172a"
		} else {
			data.Theme.HeroText = "#ffffff"
		}
	}
	if data.Theme.HeroTextMuted == "" {
		if data.Theme.HeroTone == "dark" {
			data.Theme.HeroTextMuted = "#334155"
		} else {
			data.Theme.HeroTextMuted = "#f1f5f9"
		}
	}

	var htmlBuf bytes.Buffer
	if err := g.tmpl.Execute(&htmlBuf, data); err != nil {
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

	ctx, cancel = context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	var pdfBuf []byte
	err = chromedp.Run(ctx,
		chromedp.Navigate(fileURL),
		chromedp.ActionFunc(func(ctx context.Context) error {
			var err error
			pdfBuf, _, err = page.PrintToPDF().
				WithPrintBackground(true).
				WithPaperWidth(8.27).
				WithPaperHeight(11.69).
				WithMarginTop(0.79).
				WithMarginBottom(0.79).
				WithMarginLeft(0.79).
				WithMarginRight(0.79).
				Do(ctx)
			return err
		}),
	)
	if err != nil {
		return nil, fmt.Errorf("chromedp: %w", err)
	}
	return pdfBuf, nil
}
