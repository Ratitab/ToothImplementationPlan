package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Success bool `json:"success"`
}

func (a *App) Login(creds Credentials) bool {
	loginURL := os.Getenv("LOCAL_URL") + "/app-login"
	jsonData, err := json.Marshal(creds)

	if err != nil {
		log.Println("error marshaling creds: ", err)
		runtime.EventsEmit(a.ctx, "login_failure", false)
		return false
	}

	resp, err := http.Post(loginURL, "application/json", bytes.NewBuffer(jsonData))

	if err != nil {
		log.Println("error sending login request: ", err)
		runtime.EventsEmit(a.ctx, "login_failure", false)
		return false
	}

	defer resp.Body.Close()

	var loginResponse LoginResponse

	err = json.NewDecoder(resp.Body).Decode(&loginResponse)

	if err != nil {
		log.Println("err decoding login response", err)
		runtime.EventsEmit(a.ctx, "login_failure", false)
		return false
	}

	if loginResponse.Success {
		runtime.EventsEmit(a.ctx, "login_success", true)
		return true
	} else {
		runtime.EventsEmit(a.ctx, "login_failure", false)
		return false
	}

	// if a.client == nil {
	// 	log.Println("MongoDB client is not initialized")
	// 	runtime.EventsEmit(a.ctx, "login_failure", false)
	// 	return false
	// }

	// collection := a.client.Database("ratitabidze").Collection("teethImplementation")

	// var result Credentials

	// err := collection.FindOne(a.ctx, bson.M{"username": creds.Username, "password": creds.Password}).Decode(&result)
	// if err != nil {
	// 	if err == mongo.ErrNoDocuments {
	// 		// user not found
	// 		runtime.EventsEmit(a.ctx, "login_failure", false)
	// 		return false
	// 	}

	// 	log.Println("Error checking credentials: ", err)
	// 	runtime.EventsEmit(a.ctx, "login_failure", false)
	// 	return false
	// }

	// runtime.EventsEmit(a.ctx, "login_success", true)

}
