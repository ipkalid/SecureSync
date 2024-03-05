package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
)

var secretKey = []byte("JK6opX3cAVbNts9yZHk3Cwq5WKWYTcUjlDU0hlgFI7I=")

type TokenClaims struct {
	Username string
	Rule     string

	jwt.StandardClaims
}

func CreateJWTToken(username string, rule string) (string, error) {

	exp_time := time.Now().Add(time.Hour * 24 * 30).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": username,
			"rule":     rule,
			"exp":      exp_time,
		})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func VerifyToken(tokenString string) (string, *TokenClaims, error) {

	token, err := jwt.ParseWithClaims(tokenString, &TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return "", nil, err
	}
	if !token.Valid {
		return "", nil, fmt.Errorf("invalid JWT token")
	}
	claims := token.Claims.(*TokenClaims)

	return tokenString, claims, nil
}
