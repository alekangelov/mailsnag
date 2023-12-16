package email

import (
	"bytes"
	"fmt"
	"log"
	"net"
	"net/mail"
	"os"

	"github.com/alekangelov/mailsnag/server/database"
	"github.com/mhale/smtpd"
)

type Config struct {
	Addr         string
	Host         string
	Port         string
	AuthRequired bool
	AuthUsername string
	AuthPassword string
}

var smtpConfig Config

func NewConfig() Config {
	host := os.Getenv("SMTP_HOST")
	if host == "" {
		host = "localhost"
	}
	port := os.Getenv("SMTP_PORT")
	if port == "" {
		port = "2525"
	}
	authRequired := os.Getenv("SMTP_AUTH_REQUIRED")
	if authRequired == "" {
		authRequired = "false"
	}
	authUsername := os.Getenv("SMTP_AUTH_USERNAME")
	authPassword := os.Getenv("SMTP_AUTH_PASSWORD")

	return Config{
		Addr:         fmt.Sprintf("%s:%s", host, port),
		Host:         host,
		Port:         port,
		AuthRequired: authRequired == "true",
		AuthUsername: authUsername,
		AuthPassword: authPassword,
	}
}

func handler(origin net.Addr, from string, to []string, data []byte) error {
	msg, err := mail.ReadMessage(bytes.NewReader(data))
	if err != nil {
		return err
	}
	subject := msg.Header.Get("Subject")

	buf := new(bytes.Buffer)
	buf.ReadFrom(msg.Body)
	body := buf.String()

	database.Database.AddEmail(database.Email{
		ID:          0,
		Headers:     msg.Header,
		Attachments: []database.Attachment{},
		From:        from,
		To:          to,
		Subject:     subject,
		Body:        body,
	})

	return nil
}

func authHandler(remoteAddr net.Addr, mechanism string, username []byte, password []byte, shared []byte) (bool, error) {
	if smtpConfig.AuthRequired {
		if string(username) != smtpConfig.AuthUsername || string(password) != smtpConfig.AuthPassword {
			return false, nil
		}
	}
	return true, nil
}

func rcptHandler(remoteAddr net.Addr, from string, to string) bool {
	return true
}

func logX(remoteIP string, verb string, line string) {
	log.Printf("%s %s %s", remoteIP, verb, line)
}

func ListenAndServe() error {
	addr := smtpConfig.Addr
	srv := &smtpd.Server{
		Addr:         addr,
		Handler:      handler,
		Appname:      "MailSnag",
		LogRead:      logX,
		LogWrite:     logX,
		Hostname:     "",
		AuthHandler:  authHandler,
		AuthRequired: false,
		HandlerRcpt:  rcptHandler,
		AuthMechs: map[string]bool{
			"PLAIN": true,
			"LOGIN": true,
		},
	}

	return srv.ListenAndServe()
}

func StartMailServer() {
	smtpConfig = NewConfig()

	if err := ListenAndServe(); err != nil {
		fmt.Printf("Mail server failed: %v", err)
	}

	fmt.Printf("Mail server started on %s", smtpConfig.Addr)
}
