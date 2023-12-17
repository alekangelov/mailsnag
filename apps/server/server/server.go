package server

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"net/smtp"
	"os"
	"time"

	"github.com/alekangelov/mailsnag/server/database"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/valyala/fasthttp"
)

type Attachment struct {
	ContentType string
	FileName    string
	Content     string
}

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
	app.Static("/", "./dist")

	app.Get("/api/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	app.Get("/api/send-emails", func(c *fiber.Ctx) error {
		err := sendEmail()
		if err != nil {
			return c.SendString(err.Error())
		}
		return c.SendString("OK")
	})

	app.Get("/api/emails/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		emailId := 0
		fmt.Sscanf(id, "%d", &emailId)
		email := database.Database.GetEmail(emailId)
		return c.JSON(email)
	})

	app.Get("/api/emails/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		emailId := 0
		fmt.Sscanf(id, "%d", &emailId)
		email := database.Database.GetEmail(emailId)
		return c.JSON(email)
	})

	app.Put("/api/emails/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		emailId := 0
		fmt.Sscanf(id, "%d", &emailId)
		email := database.Database.SetEmailRead(emailId)
		email.Read = true
		return c.JSON(email)
	})

	app.Get("/api/emails", func(c *fiber.Ctx) error {
		emails := database.Database.GetEmails()
		return c.JSON(emails)
	})

	app.Delete("/api/emails", func(c *fiber.Ctx) error {
		database.Database.DeleteEmails()
		return c.SendString("OK")
	})

	app.Get("/api/events", func(c *fiber.Ctx) error {
		ctx := c.Context()

		c.Set("Content-Type", "text/event-stream")
		c.Set("Cache-Control", "no-cache")
		c.Set("Connection", "keep-alive")
		c.Set("Transfer-Encoding", "chunked")

		log.Printf("New client connected")

		ctx.SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
			log.Printf("New client connected")
			fmt.Fprintf(w, "ping: %v\n\n", "ping")

			go func() {
				// keep alive every 20 seconds
				for {
					fmt.Fprintf(w, "ping: %v\n\n", "ping")
					if err := w.Flush(); err != nil {
						log.Println("Flush error:", err)
						return
					}
					time.Sleep(20 * time.Second)
				}
			}()

			for {
				email := <-database.DbChannel
				data, err := json.Marshal(email)
				if err != nil {
					log.Printf("Error marshalling email: %v", err.Error())
					continue
				}
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

	app.Use(cors.New())

	setupRoutes(app)

	port := os.Getenv("SERVER_PORT")

	if port == "" {
		port = "3333"
	}

	app.Listen(
		fmt.Sprintf(":%s", port),
	)
}
