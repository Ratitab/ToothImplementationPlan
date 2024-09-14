package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"
)

type SearchItem struct {
	Name string `json: "name" bson:"name"`
}

func (a *App) fetchFromGinSearch(endpoint, query string) ([]SearchItem, error) {
	client := &http.Client{Timeout: 10 * time.Second}
	url := fmt.Sprintf(os.Getenv("LOCAL_URL_SEARCH")+"%s?query=%s", endpoint, query)

	resp, err := client.Get(url)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("failed to fetch data from gin backend")
	}

	var results []SearchItem
	if err := json.NewDecoder(resp.Body).Decode(&results); err != nil {
		return nil, err
	}
	fmt.Println(results)
	return results, nil

}

func (a *App) SearchTreatments(query string) ([]SearchItem, error) {
	if query == "" {
		return nil, nil
	}

	results, err := a.fetchFromGinSearch("api/search-treatments", query)

	if err != nil {
		return nil, err
	}
	fmt.Println("results", results)
	return results, nil

}

func (a *App) SearchDiseases(query string) ([]SearchItem, error) {
	if query == "" {
		return nil, nil
	}

	results, err := a.fetchFromGinSearch("api/search-diseases", query)
	if err != nil {
		return nil, err
	}

	return results, nil

}
