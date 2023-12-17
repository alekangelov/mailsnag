package database

import (
	"log"
	"time"
)

type Attachment struct {
	ContentType string
	FileName    string
	Content     []byte
}

type Email struct {
	ID          int                 `json:"id"`
	Time        int64               `json:"time"`
	Headers     map[string][]string `json:"headers"`
	Attachments []Attachment        `json:"attachments"`
	From        string              `json:"from"`
	To          []string            `json:"to"`
	Subject     string              `json:"subject"`
	Body        string              `json:"body"`
	Read        bool                `json:"read"`
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
	email.Time = time.Now().UnixMilli()
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

func (db *DB) SetEmailRead(
	id int,
) Email {
	email := db.Emails[id]
	email.Read = true
	db.Emails[id] = email

	return email
}

func (db *DB) DeleteEmails() {
	db.Emails = []Email{}
}
