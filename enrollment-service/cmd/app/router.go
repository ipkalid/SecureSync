package app

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (a *App) router() http.Handler {
	router := chi.NewRouter()

	router.Use(middleware.Logger)
	router.Use(ContentTypeMiddleware("application/json"))

	router.Route("/mdm/enrollment", a.loadEnrollmentRoute)

	return router

}

func (a *App) loadEnrollmentRoute(router chi.Router) {

	router.Get("/", a.LoadAllEnrollmentTokens)
	router.Post("/", a.NewEnrollmentToken)
	router.Delete("/{name}", a.deleteEnrollmentToken)
	router.Get("/{name}", a.getEnrollmentToken)

}

func ContentTypeMiddleware(contentType string) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", contentType)
			next.ServeHTTP(w, r)
		})
	}
}
