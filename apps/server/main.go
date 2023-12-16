package main

import (
	"github.com/alekangelov/mailsnag/server/email"
	"github.com/alekangelov/mailsnag/server/server"
)

func main() {

	go func() {
		email.StartMailServer()
	}()
	server.StartServer()
}
