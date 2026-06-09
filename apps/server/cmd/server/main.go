package main

import (
	"context"
	"log"
	"path/filepath"
	"runtime"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/ideaprobe/resume-builder/apps/server/internal/config"
	"github.com/ideaprobe/resume-builder/apps/server/internal/handler"
	"github.com/ideaprobe/resume-builder/apps/server/internal/middleware"
	"github.com/ideaprobe/resume-builder/apps/server/internal/pdf"
	"github.com/ideaprobe/resume-builder/apps/server/internal/repository"
	"github.com/ideaprobe/resume-builder/apps/server/internal/service"
)

func main() {
	_, filename, _, _ := runtime.Caller(0)
	_ = godotenv.Load(filepath.Join(filepath.Dir(filename), "..", "..", "..", "..", ".env"))

	cfg := config.Load()

	ctx := context.Background()
	pool, err := repository.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer pool.Close()

	userRepo := repository.NewUserRepository(pool)
	resumeRepo := repository.NewResumeRepository(pool)

	authSvc := service.NewAuthService(userRepo, cfg.JWTSecret)
	resumeSvc := service.NewResumeService(resumeRepo)

	templatesDir := filepath.Join(filepath.Dir(filename), "..", "..", "templates")
	pdfGen, err := pdf.NewGenerator(templatesDir)
	if err != nil {
		log.Fatalf("pdf template: %v", err)
	}

	authHandler := handler.NewAuthHandler(authSvc)
	resumeHandler := handler.NewResumeHandler(resumeSvc, pdfGen)

	r := gin.Default()
	r.Use(corsMiddleware(cfg.CORSOrigin))

	api := r.Group("/api")
	{
		api.POST("/auth/login", authHandler.Login)

		protected := api.Group("")
		protected.Use(middleware.Auth(authSvc))
		{
			protected.GET("/auth/me", authHandler.Me)
			protected.GET("/resumes", resumeHandler.List)
			protected.POST("/resumes", resumeHandler.Create)
			protected.GET("/resumes/:id", resumeHandler.Get)
			protected.PATCH("/resumes/:id", resumeHandler.Update)
			protected.DELETE("/resumes/:id", resumeHandler.Delete)
			protected.POST("/resumes/:id/export", resumeHandler.Export)
		}
	}

	log.Printf("server listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}

func corsMiddleware(origin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
