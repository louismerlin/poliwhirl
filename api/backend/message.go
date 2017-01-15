package backend

type Message struct {
	Lat int `json:"lat"`
	Lon int `json:"lon"`
}

func (self *Message) String() string {
	return "Circle just created"
}
