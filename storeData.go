package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

type PacientsData struct {
	Email  string  `json:"email"`
	Name   string  `json:"name"`
	Phases []Phase `json:"phases"`
}

func (a *App) StorePacientsData(data PacientsData) (string, error) {
	fmt.Println("[DATA FROM STORE DATA]", data.Phases)
	url := os.Getenv("BASE_URL") + "/store-data"

	jsonData, err := json.Marshal(data)
	if err != nil {
		return "", nil
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", nil
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}

	resp, err := client.Do(req)

	if err != nil {
		return "", nil
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to store patients data: %v", resp.Status)
	}
	var result struct {
		Message string `json:"message"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Println("Error decoding response:", err)
		log.Printf("Response body: %v", resp.Body)
		return "", err
	}

	log.Println("Data stored successfully:", result.Message)
	return result.Message, nil

	// collection := a.client.Database("ratitabidze").Collection("pacients")
	// _, err := collection.InsertOne(a.ctx, data)
	// if err != nil {
	// 	return "", err
	// }
	// fmt.Println("sheinaxebaaa")
	// fmt.Println(data)
	// return "Patients data stored succesfully", nil
}
