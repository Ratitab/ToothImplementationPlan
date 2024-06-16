package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net/smtp"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

type Treatment struct {
	Text     string  `json:"text"`
	Quantity int     `json:"quantity"`
	OnePrice float64 `json:"onePrice"`
	Total    float64 `json:"total"`
}

type EmailData struct {
	Name             string      `json:"name"`
	ClickedTeeth     []int       `json:"clickedTeeth"`
	Treatments       []Treatment `json:"Firsttreatments"`
	SecondTreatments []Treatment `json:"secondTreatments"`
}

func (a *App) SendMail(data EmailData) string {
	from := "ratiitabidzee@gmail.com"
	password := "jawb jhpf floe omht"
	to := "rati.tabidze33@gmail.com"
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	subject := "Patient Treatment Plan"
	body := fmt.Sprintf(
		"Patient Name: %s\n\nClicked Teeth: %v\n\n FirstTreatments:\n\n%s\n\nSecond Treatment: \n\n%s",
		data.Name,
		data.ClickedTeeth,
		formatTreatments(data.Treatments),
		formatTreatments(data.SecondTreatments),
	)
	massage := []byte("Subject: " + subject + "\r\n\r\n" + body)
	auth := smtp.PlainAuth("rati", from, password, smtpHost)
	// fmt.Println(auth.)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, massage)
	if err != nil {
		return "Failed to send email" + err.Error()
	}
	return "Email Sent Successfully"
}

func formatTreatments(treatments []Treatment) string {
	var sb strings.Builder
	for _, t := range treatments {
		sb.WriteString(fmt.Sprintf("Treatment: %s, Quantity: %d, One Price: %2.f, Total: %.2f", t.Text, t.Quantity, t.OnePrice, t.Total))
	}
	return sb.String()
}

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

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Implantation Plan for %s", name)
}
