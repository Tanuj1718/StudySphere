package model

type User struct{
	Id string `bson:"_id,omitempty"`
	FullName string `bson:"fullname"`
	Email string `bson:"email"`
	Username string `bson:"username"`
	Password string `bson:"password"`
	Country string `bson:"country"`
}