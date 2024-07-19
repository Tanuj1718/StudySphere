package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	model "main.go/Authentication/models"
)

var postCollection *mongo.Collection

//to create post
func CreatePostHandler(w http.ResponseWriter, r *http.Request) {

    w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

    Username := r.Context().Value("username").(string)
    var post model.Post
    err := json.NewDecoder(r.Body).Decode(&post)
    if err != nil {
        http.Error(w, "Bad Request", http.StatusBadRequest)
        return
    }

    post.Username = Username

    _, err = postCollection.InsertOne(context.TODO(), post)
    if err != nil {
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
}

func JWTAuthenticationMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        tokenStr := r.Header.Get("Authorization")
        if tokenStr == "" {
            http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
            return
        }

        // Remove the "Bearer " prefix
        tokenStr = tokenStr[len("Bearer "):]

        claims := &Claims{}
        token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
            return jwtKey, nil
        })

        if err != nil {
            fmt.Println("Token parsing error:", err)
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        if !token.Valid {
            fmt.Println("Token is not valid")
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        // Log successful token parsing
        fmt.Println("Token parsed successfully. Username:", claims.Username)

        ctx := context.WithValue(r.Context(), "username", claims.Username)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

//to get post
func GetPostsHandler(w http.ResponseWriter, r *http.Request) {

    w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

    cursor, err := postCollection.Find(context.TODO(), bson.M{})
    if err != nil {
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.TODO())

    var posts []model.Post
    if err = cursor.All(context.TODO(), &posts); err != nil {
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(posts)
}
