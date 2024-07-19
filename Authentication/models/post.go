package model

type Post struct{
	Id string `bson:"_id,omitempty"`
	Username string `bson:"username"`
	Title string `bson:"title"`
	Link string `bson:"link"`
	Content string `bson:"content"`
}