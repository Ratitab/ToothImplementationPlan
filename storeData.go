package main

import "fmt"

type PacientsData struct {
	Name            string         `json:"Name"`
	ClickedTeeth    map[int]string `json:"ClickedTeeth"`
	FirstTreatment  []Treatment    `json:"firstTreatments"`
	SecondTreatment []Treatment    `json:"secondTreatments"`
}

func (a *App) StorePacientsData(data PacientsData) (string, error) {
	collection := a.client.Database("ratitabidze").Collection("pacients")
	_, err := collection.InsertOne(a.ctx, data)
	if err != nil {
		return "", err
	}
	fmt.Println("sheinaxebaaa")
	fmt.Println(data)
	return "Patients data stored succesfully", nil
}
