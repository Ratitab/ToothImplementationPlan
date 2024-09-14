package main

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net/smtp"
	"strings"
)

type Treatment struct {
	Disease  string  `json:"disease"`
	Comment  string  `json:"comment"`
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
	DataUrl string  `json:"dataUrl"`
	Email   string  `json:"email"`
	Name    string  `json:"name"`
	Phases  []Phase `json:"phases"`
}

func formatTreatments(treatments []Treatment) (string, float64) {
	var totalPrice float64
	var sb strings.Builder
	for _, t := range treatments {
		sb.WriteString(fmt.Sprintf(
			"<p>&emsp; &ensp; Disease: %s,<br>&emsp; &ensp; Treatment: %s,<br>&emsp; &ensp; Quantity: %d,<br>&emsp; &ensp; One Price: %.2f,<br>&emsp; &ensp; Comment: %s<br>&emsp; &ensp; Total: %.2f</p>",
			t.Disease, t.Text, t.Quantity, t.OnePrice, t.Comment, t.Total))
		totalPrice += t.Total
	}
	return sb.String(), totalPrice
}

func formatPhases(phases []Phase) (string, float64) {
	var totalPrice float64
	var sb strings.Builder
	for _, phase := range phases {
		phaseTreatments, phasePrice := formatTreatments(phase.Treatments)
		sb.WriteString(fmt.Sprintf(
			"<p>Phase ID: %d,<br> &nbsp; Days: %s<br>&nbsp;  Teeth: %v%s</p>",
			phase.ID, phase.Days, phase.ClickedTeeth, phaseTreatments))
		totalPrice += phasePrice
	}
	return sb.String(), totalPrice
}

func encodeImageToBase64(path string) (string, error) {
	imageBytes, err := ioutil.ReadFile(path)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(imageBytes), nil
}

func (a *App) SendMail(data EmailData) string {
	// Load the logo as Base64
	logoPath := "./frontend/src/assets/images/richtersLogo.jpg"
	logoBase64, err := encodeImageToBase64(logoPath)
	if err != nil {
		return fmt.Sprintf("Error loading logo: %s", err.Error())
	}
	fmt.Println("[DATA]", data)
	// Email parameters
	from := "ratiitabidzee@gmail.com"
	password := "jawb jhpf floe omht"
	to := data.Email
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	phasesFormatted, totalPrice := formatPhases(data.Phases)

	// MIME boundary
	boundary := "my-boundary-12345"

	// Body of the email with inline image
	subject := "Patient Treatment Plan"
	body := fmt.Sprintf(`
--%s
Content-Type: text/html; charset="UTF-8"

<html>
<body>
    <p>Patient Name: %s</p>
    <p>Phases:</p>
    <p>%s</p>
    <p>Total Price: $%.2f</p>
    <br><br>
    <p>Best Regards / საუკეთესო სურვილებით,</p>
    <div style="display: flex; align-items: center;">
        <div style="margin-right: 10px;">
            <img src="cid:richtersLogo" alt="Richter’s Clinic Logo" style="width: 100px;">
        </div>
        <div style="border-left: 2px solid black; height: 120px; margin-right: 10px;"></div>
        <div style="text-align: right;">
            <p>Richter’s Clinic LLC<br>
            Mob.: +995 511 111 142 | info@richters.ge<br>
            Tel.: +995 322 5000 68<br>
            68a Beliashvili st., Tbilisi, Georgia<br>
            Website: www.richters.ge</p>
        </div>
    </div>
</body>
</html>

--%s
Content-Type: image/jpeg
Content-Transfer-Encoding: base64
Content-Disposition: inline; filename="logo.jpg"
Content-ID: <richtersLogo>

%s
--%s--`, boundary, data.Name, phasesFormatted, totalPrice, boundary, logoBase64, boundary)

	// Construct the email message
	message := []byte(
		"From: " + from + "\n" +
			"To: " + to + "\n" +
			"Subject: " + subject + "\n" +
			"MIME-version: 1.0;\n" +
			"Content-Type: multipart/related; boundary=\"" + boundary + "\"\n\n" +
			body)

	// Send the email
	auth := smtp.PlainAuth("", from, password, smtpHost)
	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
	if err != nil {
		return "Failed to send email: " + err.Error()
	}

	return "Email Sent Successfully"
}
