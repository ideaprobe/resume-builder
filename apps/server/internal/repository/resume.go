package repository

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/ideaprobe/resume-builder/apps/server/internal/model"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrResumeNotFound = errors.New("resume not found")

type ResumeRepository struct {
	pool *pgxpool.Pool
}

func NewResumeRepository(pool *pgxpool.Pool) *ResumeRepository {
	return &ResumeRepository{pool: pool}
}

func (r *ResumeRepository) ListByUser(ctx context.Context, userID uuid.UUID) ([]model.ResumeListItem, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, title, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []model.ResumeListItem
	for rows.Next() {
		var item model.ResumeListItem
		if err := rows.Scan(&item.ID, &item.Title, &item.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (r *ResumeRepository) Create(ctx context.Context, userID uuid.UUID, title string, content json.RawMessage) (model.Resume, error) {
	var resume model.Resume
	err := r.pool.QueryRow(ctx,
		`INSERT INTO resumes (user_id, title, content) VALUES ($1, $2, $3)
		 RETURNING id, user_id, title, content, created_at, updated_at`,
		userID, title, content,
	).Scan(&resume.ID, &resume.UserID, &resume.Title, &resume.Content, &resume.CreatedAt, &resume.UpdatedAt)
	return resume, err
}

func (r *ResumeRepository) GetByID(ctx context.Context, id uuid.UUID) (model.Resume, error) {
	var resume model.Resume
	err := r.pool.QueryRow(ctx,
		`SELECT id, user_id, title, content, created_at, updated_at FROM resumes WHERE id = $1`,
		id,
	).Scan(&resume.ID, &resume.UserID, &resume.Title, &resume.Content, &resume.CreatedAt, &resume.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.Resume{}, ErrResumeNotFound
	}
	return resume, err
}

func (r *ResumeRepository) Update(ctx context.Context, id uuid.UUID, title *string, content *json.RawMessage) (model.Resume, error) {
	var resume model.Resume
	err := r.pool.QueryRow(ctx,
		`UPDATE resumes SET
			title = COALESCE($2, title),
			content = COALESCE($3, content),
			updated_at = NOW()
		 WHERE id = $1
		 RETURNING id, user_id, title, content, created_at, updated_at`,
		id, title, content,
	).Scan(&resume.ID, &resume.UserID, &resume.Title, &resume.Content, &resume.CreatedAt, &resume.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.Resume{}, ErrResumeNotFound
	}
	return resume, err
}

func (r *ResumeRepository) Delete(ctx context.Context, id uuid.UUID) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM resumes WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrResumeNotFound
	}
	return nil
}
