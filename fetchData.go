package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
)

func (a *App) GetPacientsData(email string) (PacientsData, error) {
	encodedEmail := url.QueryEscape(email)
	url := fmt.Sprintf(os.Getenv("LOCAL_URL")+"/fetch-send-data/%s", encodedEmail)

	resp, err := http.Get(url)

	if err != nil {
		log.Println("error fetching data from gin backend", err)
		return PacientsData{}, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Println("recieved non-ok response from gin bakcend: ", resp.Status)
		return PacientsData{}, fmt.Errorf("failed to fetch data: %v", resp.Status)
	}

	var data PacientsData

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		log.Println("error decoding response from gin backend:", err)
		return PacientsData{}, err
	}

	log.Println("fetched data", data)
	return data, nil

	// collection := a.client.Database("ratitabidze").Collection("pacients")
	// var data PacientsData

	// filter := bson.M{"email": email}
	// err := collection.FindOne(a.ctx, filter).Decode(&data)
	// if err != nil {
	// 	if err == mongo.ErrNoDocuments {
	// 		// no email found
	// 		return PacientsData{}, fmt.Errorf("patient not found")
	// 	}
	// 	return PacientsData{}, err
	// }
	// fmt.Println("thhee fetched data", data)
	// return data, nil
}
