package example

import (
	"fmt"
	"math/rand"
	"strconv"
	"testing"
	"time"
)

func TestBasic(t *testing.T) {
	fmt.Println("Hello, World!")

	fmt.Println(time.Now())
}

func TestRandInt(t *testing.T) {
	rand.Seed(100)

	for index := 0; index < 10; index++ {
		fmt.Println(rand.Intn(100))
	}
}

func add(a, b int) int {
	return a + b
}

func TestAdd(t *testing.T) {
	a, b := 1, 2
	c := add(a, b)

	fmt.Printf("c: %v\n", c)
}

func swap(a, b string) (string, string) {
	return b, a
}

func TestSwap(t *testing.T) {
	a, b := "hello", "world"
	fmt.Println(a, b)

	a, b = swap(a, b)
	fmt.Println(a, b)
}

var a int
var b float64
var c string
var d bool
var e float64 = 1e-6

func TestVar(t *testing.T) {
	fmt.Println("int:", a, a == 0)
	fmt.Println("float64:", b, b == 0)
	fmt.Println("string:", c, c == "")
	fmt.Println("bool:", d, d == false)
	fmt.Println("float64:", e, e == 0.000001)
}

func TestFloat(t *testing.T) {
	a := 0.1
	fmt.Printf("a: %v, type: %T\n", a, a)

	b := 0.2
	fmt.Printf("b: %v, type: %T\n", b, b)

	c := a + b
	fmt.Printf("c: %v, type: %T\n", c, c)

	fmt.Println("c == 0.3:", c == 0.3)
}

func TestConversion(t *testing.T) {
	strToInt, err := strconv.Atoi("123")
	if err != nil {
		panic(err)
	}

	fmt.Println("strToInt:", strToInt)

	intToStr := strconv.Itoa(123)
	fmt.Println("intToStr:", intToStr)

	strToFloat, err := strconv.ParseFloat("123.456", 64)
	if err != nil {
		panic(err)
	}

	fmt.Println("strToFloat:", strToFloat)

	floatToStr := strconv.FormatFloat(123.456, 'f', 2, 64)
	fmt.Println("floatToStr:", floatToStr)
}
