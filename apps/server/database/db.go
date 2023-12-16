package database

import (
	"context"
	"log"
)

type Email struct {
	ID          int
	Headers     map[string][]string
	Attachments []interface{}
	From        string
	To          []string
	Subject     string
	Body        string
}

type DB struct {
	Emails []Email
}

var Database DB

var DbChannel = make(chan Email)

func NewDatabase() {
	Database = DB{
		Emails: []Email{},
	}
}

func (db *DB) AddEmail(email Email) {
	email.ID = len(db.Emails)
	db.Emails = append(db.Emails, email)
	log.Printf("Adding email to channel: %v", email)
	go func() {
		DbChannel <- email
	}()
}

func (db *DB) SubscribeToEmails(ctx context.Context, onEmail func(email Email)) {

	for {
		select {
		case <-ctx.Done():
			log.Printf("Unsubscribing from emails")
			return
		case email := <-DbChannel:
			log.Printf("Got email from channel: %v", email)
			onEmail(email)
		}
	}

}

func (db *DB) GetEmails() []Email {
	return db.Emails
}

func (db *DB) GetEmail(id int) Email {
	return db.Emails[id]
}
