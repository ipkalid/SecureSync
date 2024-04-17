package app

import (
	"SecureSync/auth/handler"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// LoadRouter returns an http.Handler that handles the routing for the order API.
func (a *App) loadRouter() {
	router := chi.NewRouter()

	router.Use(middleware.Logger)
	router.Use(ContentTypeMiddleware("application/json"))

	router.Route("/auth", a.loadAuthRoute)

	a.router = router

}

func (a *App) loadAuthRoute(router chi.Router) {
	authRouter := handler.NewAuth(a.db)
	router.Post("/login", authRouter.Login)
	router.Post("/register", authRouter.Register)
	router.Post("/logout", authRouter.Logout)
	router.Post("/refreshToken", authRouter.RefreshToken)
	router.Post("/resetPassword", authRouter.ResetPassword)
	// router.Post("/forgotPassword", authRouter.ForgotPassword)

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
