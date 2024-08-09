package router

import (
	"net/http"

	"github.com/gorilla/mux"
	"main.go/controllers"
)

func Router() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/api/signup", controllers.Signup).Methods("POST")
	router.HandleFunc("/api/signin", controllers.Signin).Methods("POST")
	router.HandleFunc("/", controllers.GetAllUser).Methods("GET")
	router.Handle("/api/post", controllers.JWTAuthenticationMiddleware(http.HandlerFunc(controllers.CreatePostHandler))).Methods("POST")

	router.Handle("/api/posts", controllers.JWTAuthenticationMiddleware(http.HandlerFunc(controllers.GetPostsHandler))).Methods("GET")
	return router
}