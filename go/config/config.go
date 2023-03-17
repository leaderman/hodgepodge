package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	MySQL struct {
		Host     string
		Port     int
		User     string
		Password string
	}
}

var Properties Config

func init() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("../resources/")
	viper.AddConfigPath("./resources/")

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Sprintf("Fatal error config file: %s \n", err))
	}

	err = viper.Unmarshal(&Properties)
	if err != nil {
		panic(fmt.Sprintf("Fatal error unmarshal: %s \n", err))
	}
}

func get(key string) string {
	return viper.GetString(key)
}
