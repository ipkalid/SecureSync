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

	router.Route("/mdm/device", a.loadEnrollmentRoute)

	return router

}

func (a *App) loadEnrollmentRoute(router chi.Router) {
	router.Get("/", a.getAllDevices)
	router.Post("/updateDevicePolicy", a.updateDevicePolicy)
	router.Delete("/{name}", a.deleteDevice)
	router.Get("/{name}", a.getDevice)
}

func ContentTypeMiddleware(contentType string) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", contentType)
			next.ServeHTTP(w, r)
		})
	}
}
