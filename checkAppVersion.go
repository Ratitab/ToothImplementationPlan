package main

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
)

type VersionResponse struct {
	Version     string `json:"version"`
	DownloadURL string `json:"downloadURL"`
}

func (a *App) CheckAppVersion() (string, string, error) {
	url := os.Getenv("BASE_URL") + "/check-version"

	resp, err := http.Get(url)

	if err != nil {
		return "", "", err
	}

	defer resp.Body.Close()

	var versionResponse VersionResponse

	if err := json.NewDecoder(resp.Body).Decode(&versionResponse); err != nil {
		return "", "", err
	}

	return versionResponse.Version, versionResponse.DownloadURL, nil
}

func (a *App) DownloadNewVersion(downloadURL string) error {
	resp, err := http.Get(downloadURL)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	out, err := os.Create("ToothImplementation_new_verision.zip")

	if err != nil {
		return err
	}

	defer out.Close()

	_, err = io.Copy(out, resp.Body)

	return err
}
