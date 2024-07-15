package main

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func (a *App) GetPacientsData(email string) (PacientsData, error) {
	collection := a.client.Database("ratitabidze").Collection("pacients")
	var data PacientsData

	filter := bson.M{"email": email}
	err := collection.FindOne(a.ctx, filter).Decode(&data)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// no email found
			return PacientsData{}, fmt.Errorf("patient not found")
		}
		return PacientsData{}, err
	}
	fmt.Println("thhee fetched data", data)
	return data, nil
}
