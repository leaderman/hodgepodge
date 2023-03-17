package example

import (
	"errors"
	"fmt"
	"hodgepodge-go/config"
	"testing"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var dsn = fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local",
	config.Properties.MySQL.User, config.Properties.MySQL.Password, config.Properties.MySQL.Host, config.Properties.MySQL.Port, "devbox")

var db *gorm.DB

func init() {
	var err error

	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
}

func TestDb(t *testing.T) {

}

type User struct {
	gorm.Model
	Name string
	Age  int
}

func (user User) String() string {
	return fmt.Sprintf("id: %v, name: %v, age: %v, createdAt: %v, updatedAt: %v, deletedAt: %v",
		user.ID, user.Name, user.Age, user.CreatedAt, user.UpdatedAt, user.DeletedAt)
}

func TestCreate(t *testing.T) {
	user := User{Name: "Jinzhu", Age: 18}
	result := db.Create(&user)
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("id: %v, affected: %v", user.ID, result.RowsAffected)
}

func TestCreates(t *testing.T) {
	users := []User{
		{Name: "Jinzhu 1", Age: 18},
		{Name: "Jinzhu 2", Age: 18},
		{Name: "Jinzhu 3", Age: 18},
	}
	result := db.Create(&users)
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("affected: %v", result.RowsAffected)
}

func TestQueryById(t *testing.T) {
	id := 1
	user := User{}

	result := db.First(&user, id)
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("user: %v", user)
	t.Logf("affected: %v", result.RowsAffected)
}

func TestQueryByNotExistId(t *testing.T) {
	id := 5
	user := User{}

	result := db.First(&user, id)
	if err := result.Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			t.Logf("user %v not found", id)

			return
		}

		t.Fatal(err)
	}

	t.Logf("user: %v", user)
	t.Logf("affected: %v", result.RowsAffected)
}

func TestQueryByIds(t *testing.T) {
	ids := []int{2, 3, 4}
	users := []User{}

	result := db.Find(&users, ids)
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("affected: %v, users: %v", result.RowsAffected, len(users))

	for index, user := range users {
		t.Logf("user[%v]: %v", index, user)
	}
}

func TestQueryByNotExistIds(t *testing.T) {
	ids := []int{5, 6, 7}
	users := []User{}

	result := db.Find(&users, ids)
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("affected: %v, users: %v", result.RowsAffected, len(users))
}

func TestQueryByWhere(t *testing.T) {
	namePattern := "Jinzhu%"
	minAge := 0
	users := []User{}

	result := db.Where("name LIKE ? AND age > ?", namePattern, minAge).Find(&users)
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("affected: %v", result.RowsAffected)

	for index, user := range users {
		t.Logf("user[%v]: %v", index, user)
	}
}

func TestUpdate(t *testing.T) {
	id := 1
	user := User{}

	result := db.First(&user, id)
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	user.Name = "hello"
	result = db.Save(&user)
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("affected: %v", result.RowsAffected)
}

func TestUpdates(t *testing.T) {
	minId := 0
	age := 35

	result := db.Where("id > ?", minId).Updates(User{Age: age})
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("affected: %v", result.RowsAffected)
}

func TestDeleteById(t *testing.T) {
	id := 1

	result := db.Delete(&User{}, id)
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("affected: %v", result.RowsAffected)
}

func TestDeleteByIds(t *testing.T) {
	ids := []int{2, 3, 4}

	result := db.Delete(&User{}, ids)
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("affected: %v", result.RowsAffected)
}

func TestDeleteByWhere(t *testing.T) {
	minId := 0

	result := db.Where("id > ?", minId).Delete(&User{})
	if err := result.Error; err != nil {
		t.Fatal(err)
	}

	t.Logf("affected: %v", result.RowsAffected)
}
