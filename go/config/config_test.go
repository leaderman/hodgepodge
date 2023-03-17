package config

import (
	"testing"
)

func TestString(t *testing.T) {
	t.Log("mysql.host: ", get("mysql.host"))
	t.Log("mysql.port: ", get("mysql.port"))
}

func TestStruct(t *testing.T) {
	t.Log("mysql.host: ", Properties.MySQL.Host)
	t.Log("mysql.port: ", Properties.MySQL.Port)
}
