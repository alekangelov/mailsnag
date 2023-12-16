package main

import (
	"github.com/alekangelov/mailsnag/server/email"
	_ "github.com/alekangelov/mailsnag/server/email"
	"github.com/alekangelov/mailsnag/server/server"
	_ "github.com/joho/godotenv/autoload"
)

func main() {

	go func() {
		email.StartMailServer()
	}()
	server.StartServer()

	// server.StartServer2()
}
