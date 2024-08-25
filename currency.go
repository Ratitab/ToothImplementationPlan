package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

type CurrencyResponse struct {
	Code          string  `json:"code"`
	Quantity      int     `json:"quantity"`
	Rate          float64 `json:"rate"`
	Name          string  `json:"name"`
	Diff          float64 `json:"diff"`
	Date          string  `json:"date"`
	ValidFromDate string  `json:"validFromDate"`
}

func (a *App) GetCurrency() (CurrencyResponse, error) {
	url := os.Getenv("LOCAL_URL") + "/currencies"

	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("error fetching data from ginbackend")
		return CurrencyResponse{}, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Println("Received non-OK response from Gin backend:", resp.Status)
		return CurrencyResponse{}, fmt.Errorf("failed to fetch data: %v", resp.Status)
	}

	var data CurrencyResponse
	var response struct {
		Currencies []CurrencyResponse `json:"currencies"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		log.Println("Error decoding response from Gin backend:", err)
		return CurrencyResponse{}, err
	}

	for _, currency := range response.Currencies {
		if currency.Code == "USD" {
			data = currency
			break
		}
	}

	log.Println("fetched currency data:", data)
	return data, nil
}
