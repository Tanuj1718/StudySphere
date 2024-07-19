package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
	"main.go/Authentication/router"
)

func main() {
	r := router.Router()
		// Setup CORS middleware
		corsOptions := cors.New(cors.Options{
			AllowedOrigins:   []string{"http://localhost:5173"}, 
			AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowedHeaders:   []string{"Content-Type", "Authorization"},
			AllowCredentials: true,
		})
	
		// Apply the CORS middleware to your router
		router := corsOptions.Handler(r)
	
	fmt.Println("Server is getting ready...")
	log.Fatal(http.ListenAndServe(":8000", router))
}