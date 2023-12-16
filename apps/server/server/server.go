package server

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"net/smtp"
	"os"

	"github.com/alekangelov/mailsnag/server/database"
	"github.com/gofiber/fiber/v2"
	"github.com/valyala/fasthttp"
)

func sendEmail() error {
	from := "from@gmail.com"
	password := "somePassword"

	// Receiver email address.
	to := []string{
		"sender@example.com",
	}

	// smtp server configuration.
	smtpHost := "localhost"
	smtpPort := os.Getenv("SMTP_PORT")
	if smtpPort == "" {
		smtpPort = "2525"
	}
	// Message.
	msg := []byte("To: recipient@example.net\r\n" +
		"Subject: discount Gophers!\r\n" +
		"\r\n" +
		"This is the email body.\r\n")

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, msg)

	if err != nil {
		log.Printf(
			"SERVER err: %v", err.Error(),
		)
		return err
	}

	return nil
}

func setupRoutes(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World 👋!")
	})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	app.Get("/send-emails", func(c *fiber.Ctx) error {
		err := sendEmail()
		if err != nil {
			return c.SendString(err.Error())
		}
		return c.SendString("OK")
	})

	app.Get("/add-email", func(c *fiber.Ctx) error {
		email := database.Email{
			ID:          0,
			From:        "from@example.com",
			Headers:     map[string][]string{},
			Attachments: []interface{}{},
			To:          []string{},
			Subject:     "Test",
			Body:        "Test",
		}
		database.Database.AddEmail(email)
		return c.SendString("OK")
	})

	app.Get("/emails", func(c *fiber.Ctx) error {
		c.Set("Content-Type", "text/event-stream")
		c.Set("Cache-Control", "no-cache")
		c.Set("Connection", "keep-alive")
		c.Set("Transfer-Encoding", "chunked")

		ctx := c.Context()
		log.Printf("New client connected")

		ctx.SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
			log.Printf("New client connected")
			currentEmails := database.Database.GetEmails()
			fmt.Fprintf(w, "ping: %v\n\n", "ping")

			for _, email := range currentEmails {
				data, _ := json.Marshal(email)
				fmt.Fprintf(w, "data: %v\n\n", string(data))
				if err := w.Flush(); err != nil {
					log.Println("Flush error:", err)
					return
				}
			}

			for {
				email := <-database.DbChannel
				data, _ := json.Marshal(email)
				fmt.Fprintf(w, "data: %v\n\n", string(data))
				if err := w.Flush(); err != nil {
					log.Println("Flush error:", err)
					return
				}
			}

		}))
		return nil
	})
}

func StartServer() {
	app := fiber.New(fiber.Config{
		DisableStartupMessage: false,
	})

	setupRoutes(app)

	app.Listen(":3000")
}
