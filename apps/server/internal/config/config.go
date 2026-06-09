package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
	JWTSecret   string
	Port        string
	CORSOrigin  string
}

func Load() Config {
	return Config{
		DatabaseURL: env("DATABASE_URL", "postgres://resume:resume@localhost:5433/resume_builder?sslmode=disable"),
		JWTSecret:   env("JWT_SECRET", "dev-secret-change-me"),
		Port:        env("PORT", "8080"),
		CORSOrigin:  env("CORS_ORIGIN", "http://localhost:5173"),
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
