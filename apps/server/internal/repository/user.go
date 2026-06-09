package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/ideaprobe/resume-builder/apps/server/internal/model"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrUserNotFound = errors.New("user not found")

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (r *UserRepository) FindByUsername(ctx context.Context, username string) (uuid.UUID, string, error) {
	var id uuid.UUID
	var passwordHash string
	err := r.pool.QueryRow(ctx,
		`SELECT id, password_hash FROM users WHERE username = $1`,
		username,
	).Scan(&id, &passwordHash)
	if errors.Is(err, pgx.ErrNoRows) {
		return uuid.Nil, "", ErrUserNotFound
	}
	return id, passwordHash, err
}

func (r *UserRepository) FindByID(ctx context.Context, id uuid.UUID) (model.User, error) {
	var user model.User
	err := r.pool.QueryRow(ctx,
		`SELECT id, username, created_at FROM users WHERE id = $1`,
		id,
	).Scan(&user.ID, &user.Username, &user.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.User{}, ErrUserNotFound
	}
	return user, err
}
