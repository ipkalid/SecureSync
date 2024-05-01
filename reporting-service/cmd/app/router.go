package app

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// LoadRouter returns an http.Handler that handles the routing for the order API.
func (a *App) router() http.Handler {
	router := chi.NewRouter()

	router.Use(middleware.Logger)
	router.Use(ContentTypeMiddleware("application/json"))

	router.Route("/auth", a.loadAuthenticationRoute)

	return router

}

func (a *App) loadAuthenticationRoute(router chi.Router) {

	router.Post("/login", a.Login)
	router.Post("/register", a.Register)
	router.Post("/logout", a.Logout)
	router.Post("/resetPassword", a.ResetPassword)

	// router.Post("/verifyAccount", authRouter.VerifyAccount)
}

func ContentTypeMiddleware(contentType string) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", contentType)
			next.ServeHTTP(w, r)
		})
	}
}
