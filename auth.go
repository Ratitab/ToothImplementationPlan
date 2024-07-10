package main

import (
	"log"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (a *App) Login(creds Credentials) bool {
	if a.client == nil {
		log.Println("MongoDB client is not initialized")
		runtime.EventsEmit(a.ctx, "login_failure", false)
		return false
	}

	collection := a.client.Database("ratitabidze").Collection("teethImplementation")

	var result Credentials

	err := collection.FindOne(a.ctx, bson.M{"username": creds.Username, "password": creds.Password}).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// user not found
			runtime.EventsEmit(a.ctx, "login_failure", false)
			return false
		}

		log.Println("Error checking credentials: ", err)
		runtime.EventsEmit(a.ctx, "login_failure", false)
		return false
	}

	runtime.EventsEmit(a.ctx, "login_success", true)
	return true
}
