package main

import (
	"bytes"
	"fmt"
	"net/smtp"
	"strings"
)

type Treatment struct {
	Disease  string  `json:"disease"`
	Text     string  `json:"text"`
	Quantity int     `json:"quantity"`
	OnePrice float64 `json:"onePrice"`
	Total    float64 `json:"total"`
}

type Phase struct {
	ID           int64       `json:"id"`
	ClickedTeeth []int       `json:"clickedTeeth"`
	Days         string      `json:"days"`
	Treatments   []Treatment `json:"treatments"`
}

type EmailData struct {
	DataUrl string `json:"dataUrl"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	// ClickedTeeth map[int]string `json:"clickedTeeth"`
	Phases []Phase `json:"phases"`
}

// func formatTeethClick(clickedTeeth map[int]string) string {
// 	var sb strings.Builder
// 	for tooth, state := range clickedTeeth {
// 		sb.WriteString(fmt.Sprintf("Tooth %d: %s\n", tooth, state))
// 	}
// 	return sb.String()
// }

func formatTreatments(treatments []Treatment) (string, float64) {
	var totalPrice float64
	var sb strings.Builder
	for _, t := range treatments {
		sb.WriteString(fmt.Sprintf("	disease:%s,\n	Treatment: %s,\n	Quantity: %d,\n	One Price: %.2f,\n	Total: %.2f\n ", t.Disease, t.Text, t.Quantity, t.OnePrice, t.Total))
		totalPrice += t.Total
	}
	return sb.String(), totalPrice
}

func formatPhases(phases []Phase) (string, float64) {
	var totalPrice float64
	var sb strings.Builder
	for _, phase := range phases {
		phaseTreatments, phasePrice := formatTreatments(phase.Treatments)
		sb.WriteString(fmt.Sprintf("Phase ID: %d,\n Days: %s\n	Teeth:%d 	\n%s\n", phase.ID, phase.Days, phase.ClickedTeeth, phaseTreatments))
		totalPrice += phasePrice
	}
	return sb.String(), totalPrice
}

func (a *App) SendMail(data EmailData) string {
	fmt.Println("[DATA]", data)
	from := "ratiitabidzee@gmail.com"
	password := "jawb jhpf floe omht"
	to := data.Email
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	phasesFormatted, totalPrice := formatPhases(data.Phases)

	subject := "Patient Treatment Plan"
	body := fmt.Sprintf(
		"Patient Name: %s\n\nhases:\n%s\n\nTotal Price: $%.2f",
		data.Name,
		phasesFormatted,
		totalPrice,
	)

	dataUrlParts := strings.Split(data.DataUrl, ",")
	if len(dataUrlParts) != 2 {
		fmt.Errorf("invalid data URL format")
	}
	dataMimeType := strings.Split(dataUrlParts[0], ";")[0][5:]
	dataContent := dataUrlParts[1]

	buf := bytes.NewBuffer(nil)
	buf.WriteString(fmt.Sprintf("From: %s\r\n", from))
	buf.WriteString(fmt.Sprintf("To: %s\r\n", to))
	buf.WriteString(fmt.Sprintf("Subject: %s\r\n", subject))
	buf.WriteString("MIME-version: 1.0;\nContent-Type: multipart/related; boundary=\"boundary-example\";\n\n")
	buf.WriteString("--boundary-example\n")
	buf.WriteString("Content-Type: text/plain; charset=US-ASCII\n\n")
	buf.WriteString(body + "\n\n")
	buf.WriteString(fmt.Sprintf("--boundary-example\nContent-Type: %s; name=\"treatment.jpeg\"\nContent-Disposition: inline; filename=\"treatment.jpeg\"\nContent-Transfer-Encoding: base64\nContent-ID: <treatment.jpeg>\n\n", dataMimeType))
	buf.WriteString(dataContent + "\n\n")
	buf.WriteString("--boundary-example--\r\n")

	message := buf.Bytes()
	auth := smtp.PlainAuth("", from, password, smtpHost)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
	if err != nil {
		return "Failed to send email: " + err.Error()
	}
	return "Email Sent Successfully"
}
