package database

import (
	"log"
)

type Attachment struct {
	ContentType string
	FileName    string
	Content     []byte
}

type Email struct {
	ID          int
	Headers     map[string][]string
	Attachments []Attachment
	From        string
	To          []string
	Subject     string
	Body        string
}

type DB struct {
	Emails []Email
}

var Database DB

var DbChannel = make(chan Email, 100000)

func NewDatabase() {
	Database = DB{
		Emails: []Email{},
	}
}

func (db *DB) AddEmail(email Email) {
	email.ID = len(db.Emails)
	db.Emails = append(db.Emails, email)
	go func() {
		switch {
		case len(DbChannel) == cap(DbChannel):
			log.Printf("Channel is full, dropping email: %v because cap is %d and length is %d", email, cap(DbChannel), len(DbChannel))
		default:
			DbChannel <- email
		}
	}()
}

func (db *DB) GetEmails() []Email {
	return db.Emails
}

func (db *DB) GetEmail(id int) Email {
	return db.Emails[id]
}
