package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/ideaprobe/resume-builder/apps/server/internal/middleware"
	"github.com/ideaprobe/resume-builder/apps/server/internal/model"
	"github.com/ideaprobe/resume-builder/apps/server/internal/pdf"
	"github.com/ideaprobe/resume-builder/apps/server/internal/repository"
	"github.com/ideaprobe/resume-builder/apps/server/internal/service"
)

type ResumeHandler struct {
	resumes *service.ResumeService
	pdf     *pdf.Generator
}

func NewResumeHandler(resumes *service.ResumeService, pdfGen *pdf.Generator) *ResumeHandler {
	return &ResumeHandler{resumes: resumes, pdf: pdfGen}
}

func (h *ResumeHandler) List(c *gin.Context) {
	items, err := h.resumes.List(c.Request.Context(), middleware.GetUserID(c))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	if items == nil {
		items = []model.ResumeListItem{}
	}
	c.JSON(http.StatusOK, items)
}

func (h *ResumeHandler) Create(c *gin.Context) {
	var req model.CreateResumeRequest
	_ = c.ShouldBindJSON(&req)
	resume, err := h.resumes.Create(c.Request.Context(), middleware.GetUserID(c), req.Title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.JSON(http.StatusCreated, resume)
}

func (h *ResumeHandler) Get(c *gin.Context) {
	resume, err := h.getOwned(c)
	if err != nil {
		return
	}
	c.JSON(http.StatusOK, resume)
}

func (h *ResumeHandler) Update(c *gin.Context) {
	id, ok := parseID(c)
	if !ok {
		return
	}
	var req model.UpdateResumeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}
	resume, err := h.resumes.Update(c.Request.Context(), middleware.GetUserID(c), id, req)
	if errors.Is(err, service.ErrForbidden) {
		c.JSON(http.StatusForbidden, gin.H{"error": "无权访问"})
		return
	}
	if errors.Is(err, repository.ErrResumeNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.JSON(http.StatusOK, resume)
}

func (h *ResumeHandler) Delete(c *gin.Context) {
	id, ok := parseID(c)
	if !ok {
		return
	}
	err := h.resumes.Delete(c.Request.Context(), middleware.GetUserID(c), id)
	if errors.Is(err, service.ErrForbidden) {
		c.JSON(http.StatusForbidden, gin.H{"error": "无权访问"})
		return
	}
	if errors.Is(err, repository.ErrResumeNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *ResumeHandler) Export(c *gin.Context) {
	resume, err := h.getOwned(c)
	if err != nil {
		return
	}
	data, err := h.pdf.Generate(resume.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PDF 导出失败"})
		return
	}
	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", `attachment; filename="resume.pdf"`)
	c.Data(http.StatusOK, "application/pdf", data)
}

func (h *ResumeHandler) getOwned(c *gin.Context) (model.Resume, error) {
	id, ok := parseID(c)
	if !ok {
		return model.Resume{}, errors.New("bad id")
	}
	resume, err := h.resumes.Get(c.Request.Context(), middleware.GetUserID(c), id)
	if errors.Is(err, service.ErrForbidden) {
		c.JSON(http.StatusForbidden, gin.H{"error": "无权访问"})
		return model.Resume{}, err
	}
	if errors.Is(err, repository.ErrResumeNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return model.Resume{}, err
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return model.Resume{}, err
	}
	return resume, nil
}

func parseID(c *gin.Context) (uuid.UUID, bool) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return uuid.Nil, false
	}
	return id, true
}
