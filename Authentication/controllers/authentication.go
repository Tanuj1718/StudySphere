package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
	model "main.go/models"
)

type Claims struct {
    Username string `json:"username"`
    jwt.StandardClaims
}
var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))
var collection *mongo.Collection

func init() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error while loading .env file")
		panic(err)
	}

	mongourl := os.Getenv("MONGODB_URI")
	const dbName = "PROJECT"
	const colName = "Registered Users"

	//client option is necessary step because it helps to communicate with the server, w/o it you can't
	clientOption := options.Client().ApplyURI(mongourl)

	//connect to mongodb
	client, err := mongo.Connect(context.TODO(), clientOption)
	if err != nil {
		fmt.Println("Error while connecting to Database")
		panic(err)
	}

	fmt.Println("MongoDB connection success...")
	collection = client.Database(dbName).Collection(colName)
	postCollection = client.Database(dbName).Collection("posts")
}

func Signup(w http.ResponseWriter, r *http.Request) {
	
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")


	// Log the incoming request
	fmt.Println("Received signup request")
	// Parse the form data
	err := r.ParseForm()
	if err != nil {
		http.Error(w, "Error parsing form data", http.StatusBadRequest)
		return
	}

	fullname := r.FormValue("fullname")
	email := r.FormValue("email")
	username := r.FormValue("username")
	password := r.FormValue("password")
	country := r.FormValue("country")

	//validation
	if len(fullname) < 3 || len(email) < 5 || username == "" || len(password) < 5 || country == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	//check if username already exists
	usernameFilter := bson.M{"username":username}
	var existingUserbyUsername model.User
	err = collection.FindOne(context.TODO(), usernameFilter).Decode(&existingUserbyUsername)
	if err == nil {
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	}

	//check if email already exists
	emailFilter := bson.M{"email": email}
	var existingUserbyEmail model.User
	err = collection.FindOne(context.TODO(), emailFilter).Decode(&existingUserbyEmail)
	if err == nil {
		http.Error(w, "Email already exists", http.StatusConflict)
		return
	}

	//check if password already exits

	findOptions := options.Find()
	cur, err := collection.Find(context.TODO(), bson.D{}, findOptions)
	if err != nil {
		http.Error(w, "Error fetching users", http.StatusInternalServerError)
		return
	}
	defer cur.Close(context.TODO())

	var users []model.User
	if err = cur.All(context.TODO(), &users); err != nil {
		http.Error(w, "Error fetching data", http.StatusInternalServerError)
		return
	}

	// Iterate through all users and compare passwords
	for _, user := range users {
		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
		if err == nil {
			http.Error(w, "Password already exists", http.StatusConflict)
			return
		}
	}

	//Hashing user password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		http.Error(w, "Server Error during Hashing", http.StatusInternalServerError)
		return
	}

	fmt.Printf("Fullname: %s, Email: %s, Username: %s, Country: %s\n", fullname, email, username, country)

	//Creating user
	user := model.User{
		FullName: fullname,
		Email:    email,
		Username: username,
		Password: string(hashedPassword),
		Country:  country,
	}

	collection.InsertOne(context.Background(), user)
	// Set response header to application/json
    w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "fullname": user.FullName,
        "email": user.Email,
    })
}

func Signin(w http.ResponseWriter, r *http.Request) {
	
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	err := r.ParseForm()
	if err != nil {
		http.Error(w, "Error parsing form data", http.StatusBadRequest)
		return
	}

	username := r.FormValue("username")
	password := r.FormValue("password")

	if password == "" || username == "" {
		http.Error(w, "All fields are required!", http.StatusBadRequest)
		return
	}

	var user model.User
	err = collection.FindOne(context.TODO(), bson.M{"username": username}).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid username or password!", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Create the JWT token
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Return the token
    w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "fullname": user.FullName,
        "token": tokenString,
    })
    log.Println("Signin successful, token generated")
}

// for showing all registered users to a logged in user
func GetAllUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	findOptions := options.Find()
	cur, err := collection.Find(context.TODO(), bson.D{}, findOptions)
	if err != nil {
		http.Error(w, "Error fetching users", http.StatusInternalServerError)
		return
	}

	defer cur.Close(context.TODO())

	var users []model.User
	for cur.Next(context.TODO()) {
		var user model.User
		err := cur.Decode(&user)
		if err != nil {
			http.Error(w, "Error decoding user", http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	if err := cur.Err(); err != nil {
		http.Error(w, "Cursor error", http.StatusInternalServerError)
		return
	}

	// Extract usernames
	usernames := make([]string, len(users))
	for i, user := range users {
		usernames[i] = user.Username
	}

	// Set response header to application/json
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(usernames)
}
