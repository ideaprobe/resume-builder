package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/ideaprobe/resume-builder/apps/server/internal/model"
	"github.com/ideaprobe/resume-builder/apps/server/internal/repository"
)

var ErrForbidden = errors.New("forbidden")

type ResumeService struct {
	resumes *repository.ResumeRepository
}

func NewResumeService(resumes *repository.ResumeRepository) *ResumeService {
	return &ResumeService{resumes: resumes}
}

func (s *ResumeService) List(ctx context.Context, userID uuid.UUID) ([]model.ResumeListItem, error) {
	return s.resumes.ListByUser(ctx, userID)
}

func (s *ResumeService) Create(ctx context.Context, userID uuid.UUID, title string) (model.Resume, error) {
	if title == "" {
		title = "未命名简历"
	}
	return s.resumes.Create(ctx, userID, title, model.DefaultResumeContent())
}

func (s *ResumeService) Get(ctx context.Context, userID, resumeID uuid.UUID) (model.Resume, error) {
	resume, err := s.resumes.GetByID(ctx, resumeID)
	if err != nil {
		return model.Resume{}, err
	}
	if resume.UserID != userID {
		return model.Resume{}, ErrForbidden
	}
	return resume, nil
}

func (s *ResumeService) Update(ctx context.Context, userID, resumeID uuid.UUID, req model.UpdateResumeRequest) (model.Resume, error) {
	resume, err := s.resumes.GetByID(ctx, resumeID)
	if err != nil {
		return model.Resume{}, err
	}
	if resume.UserID != userID {
		return model.Resume{}, ErrForbidden
	}
	return s.resumes.Update(ctx, resumeID, req.Title, req.Content)
}

func (s *ResumeService) Delete(ctx context.Context, userID, resumeID uuid.UUID) error {
	resume, err := s.resumes.GetByID(ctx, resumeID)
	if err != nil {
		return err
	}
	if resume.UserID != userID {
		return ErrForbidden
	}
	return s.resumes.Delete(ctx, resumeID)
}
