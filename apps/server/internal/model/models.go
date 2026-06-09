package model

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `json:"id"`
	Username  string    `json:"username"`
	CreatedAt time.Time `json:"createdAt"`
}

type Resume struct {
	ID        uuid.UUID       `json:"id"`
	UserID    uuid.UUID       `json:"userId"`
	Title     string          `json:"title"`
	Content   json.RawMessage `json:"content"`
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
}

type ResumeListItem struct {
	ID        uuid.UUID `json:"id"`
	Title     string    `json:"title"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type CreateResumeRequest struct {
	Title string `json:"title"`
}

type UpdateResumeRequest struct {
	Title   *string          `json:"title"`
	Content *json.RawMessage `json:"content"`
}

func DefaultResumeContent() json.RawMessage {
	content := map[string]any{
		"template": "default",
		"theme": map[string]string{
			"gradient":      "linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #7c3aed 100%)",
			"accent":        "#5b5bd6",
			"heroTone":      "light",
			"heroText":      "#ffffff",
			"heroTextMuted": "#e0e7ff",
		},
		"sections": []any{
			map[string]any{
				"id":   "basics",
				"type": "basics",
				"fields": map[string]string{
					"name":     "你的姓名",
					"title":    "职位头衔",
					"email":    "email@example.com",
					"phone":    "手机号",
					"location": "城市",
					"avatar":   "",
				},
			},
			map[string]any{
				"id":    "work-1",
				"type":  "work",
				"items": []any{},
			},
			map[string]any{
				"id":    "edu-1",
				"type":  "education",
				"items": []any{},
			},
			map[string]any{
				"id":    "skills-1",
				"type":  "skills",
				"items": []any{},
			},
		},
	}
	raw, _ := json.Marshal(content)
	return raw
}
