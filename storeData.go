package main

import "fmt"

type PacientsData struct {
	Email  string  `json:"email"`
	Name   string  `json:"name"`
	Phases []Phase `json:"phases"`
}

func (a *App) StorePacientsData(data PacientsData) (string, error) {
	fmt.Println("[DATA FROM STORE DATA]", data.Phases)
	collection := a.client.Database("ratitabidze").Collection("pacients")
	_, err := collection.InsertOne(a.ctx, data)
	if err != nil {
		return "", err
	}
	fmt.Println("sheinaxebaaa")
	fmt.Println(data)
	return "Patients data stored succesfully", nil
}
