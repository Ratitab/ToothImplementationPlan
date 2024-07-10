package main

import (
	"fmt"
	"net/smtp"
	"strings"
)

type Treatment struct {
	Text     string  `json:"text"`
	Quantity int     `json:"quantity"`
	OnePrice float64 `json:"onePrice"`
	Total    float64 `json:"total"`
}

type EmailData struct {
	Name             string         `json:"name"`
	ClickedTeeth     map[int]string `json:"clickedTeeth"`
	Treatments       []Treatment    `json:"firsttreatments"`
	SecondTreatments []Treatment    `json:"secondTreatments"`
}

func formatTeethClick(clickedTeeth map[int]string) string {
	var sb strings.Builder
	for tooth, state := range clickedTeeth {
		sb.WriteString(fmt.Sprintf("Tooth:%d: %s\n", tooth, state))
	}
	return sb.String()
}

// func getPrices(treatments []Treatment) int {
// 	var price int
// 	for _, t := range treatments {
// 		price = t.Quantity * int(t.OnePrice)
// 		fmt.Println(price)
// 	}
// 	return price
// }

func formatTreatments(treatments []Treatment) (string, float64) {
	var resultPrice float64
	for _, t := range treatments {
		resultPrice = float64(t.Quantity) * t.OnePrice
		fmt.Println(resultPrice)
	}
	var sb strings.Builder
	for _, t := range treatments {
		sb.WriteString(fmt.Sprintf("Treatment: %s, Quantity: %d, One Price: %2.f, Total: %.2f", t.Text, t.Quantity, t.OnePrice, t.Total))
	}
	return sb.String(), resultPrice
}

func (a *App) SendMail(data EmailData) string {
	from := "ratiitabidzee@gmail.com"
	password := "jawb jhpf floe omht"
	to := "rati.tabidze33@gmail.com"
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	firstTreatment, firstTreatmentPrice := formatTreatments(data.Treatments)
	secondTreatment, secondTreatmentPrice := formatTreatments(data.SecondTreatments)

	fmt.Printf("firstTreatmentPRice: %f; socondTreatmentPrice: %f", firstTreatmentPrice, secondTreatmentPrice)
	subject := "Patient Treatment Plan"
	body := fmt.Sprintf(
		"Patient Name: %s\n\nClicked Teeth: %s\n\n FirstTreatments:\n\n%s\n\nSecond Treatment: \n\n%s \n\n\ntotal price: $%.2f",
		data.Name,
		formatTeethClick(data.ClickedTeeth),
		firstTreatment,
		secondTreatment,
		firstTreatmentPrice+secondTreatmentPrice,
	)

	fmt.Println(data.Treatments)
	massage := []byte("Subject: " + subject + "\r\n\r\n" + body)
	auth := smtp.PlainAuth("rati", from, password, smtpHost)
	// fmt.Println(auth.)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, massage)
	if err != nil {
		return "Failed to send email" + err.Error()
	}
	return "Email Sent Successfully"
}
