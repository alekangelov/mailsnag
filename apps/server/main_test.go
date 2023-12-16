package main

import (
	"bytes"
	"html/template"
	"net/smtp"
	"os"
	"testing"
)

const AMOUNT_OF_EMAILS = 25

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

func sleep(ms int) {
	for i := 0; i < ms; i++ {
	}
}

// TestPlain sends emails using the smtp.SendMail function
// and the smtp server running in the same process.
// It is used to test the smtp server.
func TestPlain(t *testing.T) {
	for i := 0; i < AMOUNT_OF_EMAILS; i++ {
		err := sendEmail(
			"example@email.com",
			"password",
			[]string{
				"some@email.com",
			},
			"localhost",
			"2525",
			[]byte("To: some@email.com"+
				"Subject: discount Gophers!\r\n"+
				"\r\n"+
				"This is the email body.\r\n",
			),
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
		err := sendEmail(
			"example@email.com",
			"password",
			[]string{
				"some@email.com",
			},
			"localhost",
			"2525",
			[]byte("To: some@email.com"+
				"Subject: discount Gophers!\r\n"+
				"Content-Type: text/html; charset=UTF-8\r\n"+
				"\r\n"+
				s,
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
