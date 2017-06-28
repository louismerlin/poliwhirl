package main

import (
	"log"
	"net/http"

	"github.com/wakeupcoffee/ripples/api/backend"
)

func main() {
	log.SetFlags(log.Lshortfile)

	// websocket server
	server := backend.NewServer("/entry")
	go server.Listen()

	log.Fatal(http.ListenAndServe(":8085", nil))
}
