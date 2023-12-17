package main

import (
	"github.com/alekangelov/mailsnag/server/email"
	_ "github.com/alekangelov/mailsnag/server/email"
	"github.com/alekangelov/mailsnag/server/server"
	_ "github.com/joho/godotenv/autoload"
)

func main() {

	go server.StartServer()
	email.StartMailServer()

	// server.StartServer2()
}
