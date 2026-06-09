package service

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/ideaprobe/resume-builder/apps/server/internal/model"
	"github.com/ideaprobe/resume-builder/apps/server/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

type AuthService struct {
	users     *repository.UserRepository
	jwtSecret []byte
}

func NewAuthService(users *repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{users: users, jwtSecret: []byte(jwtSecret)}
}

type claims struct {
	UserID uuid.UUID `json:"userId"`
	jwt.RegisteredClaims
}

func (s *AuthService) Login(ctx context.Context, username, password string) (model.LoginResponse, error) {
	id, hash, err := s.users.FindByUsername(ctx, username)
	if errors.Is(err, repository.ErrUserNotFound) {
		return model.LoginResponse{}, ErrInvalidCredentials
	}
	if err != nil {
		return model.LoginResponse{}, err
	}
	if bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) != nil {
		return model.LoginResponse{}, ErrInvalidCredentials
	}

	user, err := s.users.FindByID(ctx, id)
	if err != nil {
		return model.LoginResponse{}, err
	}

	token, err := s.signToken(id)
	if err != nil {
		return model.LoginResponse{}, err
	}

	return model.LoginResponse{Token: token, User: user}, nil
}

func (s *AuthService) Me(ctx context.Context, userID uuid.UUID) (model.User, error) {
	return s.users.FindByID(ctx, userID)
}

func (s *AuthService) ParseToken(tokenString string) (uuid.UUID, error) {
	token, err := jwt.ParseWithClaims(tokenString, &claims{}, func(t *jwt.Token) (any, error) {
		return s.jwtSecret, nil
	})
	if err != nil {
		return uuid.Nil, err
	}
	c, ok := token.Claims.(*claims)
	if !ok || !token.Valid {
		return uuid.Nil, errors.New("invalid token")
	}
	return c.UserID, nil
}

func (s *AuthService) signToken(userID uuid.UUID) (string, error) {
	c := claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	return token.SignedString(s.jwtSecret)
}
