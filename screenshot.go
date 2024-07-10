package main

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) SaveScreenshot(base64data string, filename string) string {
	dataIndex := strings.Index(base64data, ",")
	if dataIndex == -1 {
		fmt.Println("Invalid base64 data")
		return "Invalid base64 data"
	}
	rawData := base64data[dataIndex+1:]
	data, err := base64.StdEncoding.DecodeString(rawData)
	if err != nil {
		fmt.Println("Failed to decode base64 data: " + err.Error())
		return "Failed to decode base64 data: " + err.Error()
	}

	savePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Save Screenshot",
		DefaultFilename: filename + ".png",
	})
	if err != nil {
		fmt.Println("Failed to select save location: " + err.Error())
		return "Failed to select save location: " + err.Error()
	}
	if savePath == "" {
		fmt.Println("No file selected")
		return "No file selected"
	}

	err = ioutil.WriteFile(savePath, data, os.ModePerm)
	if err != nil {
		return "Failed to save file: " + err.Error()
	}

	return "Screenshot saved successfully"
}
