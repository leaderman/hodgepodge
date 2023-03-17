package main

import (
	"fmt"
	"hodgepodge-go/config"
)

func main() {
	fmt.Println(config.Properties.MySQL.Host)
	fmt.Println(config.Properties.MySQL.Port)
	fmt.Println(config.Properties.MySQL.User)
	fmt.Println(config.Properties.MySQL.Password)
}
