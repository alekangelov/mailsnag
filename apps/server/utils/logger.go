package utils

import (
	"context"
	"fmt"
	"log"
)

type Logger int

const logger_id = "logger_id"

func (l Logger) Printf(s string, args ...interface{}) {
	log.Printf("[id=%d] %s", l, fmt.Sprintf(s, args...))
}

func (l Logger) Println(s string) {
	log.Printf("[id=%d] %s\n", l, s)
}

func CtxWithLoggerID(ctx context.Context, id int) context.Context {
	return context.WithValue(ctx, logger_id, id)
}

func GetLogger(ctx context.Context) Logger {
	return Logger(ctx.Value(logger_id).(int))
}
