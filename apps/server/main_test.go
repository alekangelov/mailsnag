package main

import (
	"bytes"
	"fmt"
	"html/template"
	"net/smtp"
	"os"
	"testing"

	faker "github.com/go-faker/faker/v4"
)

const AMOUNT_OF_EMAILS = 25

type Email struct {
	From string `faker:"email"`

	To string `faker:"email"`

	Subject string `faker:"sentence"`

	Body string `faker:"sentence"`
}

func getRandomEmail() Email {

	var email Email

	_ = faker.FakeData(&email)

	return email
}

func sendEmail(
	from string,
	password string,
	to []string,
	smtpHost string,
	smtpPort string,
	msg []byte,
) error {
	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, msg)
	if err != nil {
		return err
	}
	return nil
}

// TestPlain sends emails using the smtp.SendMail function
// and the smtp server running in the same process.
// It is used to test the smtp server.
func TestPlain(t *testing.T) {
	for i := 0; i < AMOUNT_OF_EMAILS; i++ {
		email := getRandomEmail()
		err := sendEmail(
			email.From,
			"password",
			[]string{
				email.To,
			},
			"localhost",
			"2525",
			[]byte(
				fmt.Sprintf("To: %s\r\n"+
					"Subject: %s\r\n"+
					"\r\n"+
					"%s",
					email.To,
					email.Subject,
					email.Body,
				)),
		)
		if err != nil {
			t.Errorf("Error sending email: %v", err.Error())
		}
		t.Logf("Sent email %d", i)
	}
}

// TestHtml sends emails using the smtp.SendMail function
// and the smtp server running in the same process.
// It is used to test the smtp server.
func TestHtml(t *testing.T) {
	temp, err := template.ParseFiles("./resources/email.html")
	if err != nil {
		t.Errorf("Error parsing template: %v", err.Error())
	}

	var doc bytes.Buffer
	if err := temp.Execute(&doc, nil); err != nil {
		t.Errorf("Error executing template: %v", err.Error())
	}

	s := doc.String()
	for i := 0; i < AMOUNT_OF_EMAILS; i++ {
		email := getRandomEmail()
		err := sendEmail(
			email.From,
			"password",
			[]string{
				email.To,
			},
			"localhost",
			"2525",
			[]byte(
				fmt.Sprintf("To: %s\r\n"+
					"Subject: %s\r\n"+
					"Content-Type: text/html; charset=UTF-8\r\n"+
					"\r\n"+
					"%s",
					email.To,
					email.Subject,
					s,
				),
			),
		)
		if err != nil {
			t.Errorf("Error sending email: %v", err.Error())
		}
		t.Logf("Sent email %d", i)
	}

}

func TestAttachment(t *testing.T) {
	attachment, err := os.ReadFile("./resources/dummy.pdf")
	if err != nil {
		t.Errorf("Error reading attachment: %v", err.Error())
	}

	for i := 0; i < AMOUNT_OF_EMAILS; i++ {
		err := sendEmail(
			"example@email.com",
			"password",
			[]string{
				"some@email.com",
			},
			"localhost",
			"2525",
			[]byte("To:	some@email.com"+
				"Subject: discount Gophers!\r\n"+
				"Content-Type: multipart/mixed; boundary=foo_bar_baz\r\n"+
				"\r\n"+
				"--foo_bar_baz\r\n"+
				"Content-Type: text/plain; charset=UTF-8\r\n"+
				"\r\n"+
				"This is the email body.\r\n"+
				"--foo_bar_baz\r\n"+
				"Content-Type: text/plain; charset=UTF-8\r\n"+
				"Content-Disposition: attachment; filename=\"dummy.pdf\"\r\n"+
				"\r\n"+
				string(attachment)+
				"\r\n"+
				"--foo_bar_baz--\r\n",
			),
		)
		if err != nil {
			t.Errorf("Error sending email: %v", err.Error())
		}
		t.Logf("Sent email %d", i)
	}
}
