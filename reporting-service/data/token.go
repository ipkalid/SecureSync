package data

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

func (t *RefreshToken) CreateTokenRecord(user User, role Role) (string, error) {

	token, err := createJWTToken(user.Email, role.Name)
	if err != nil {
		return "", err
	}
	sqlStatement := `
	INSERT INTO public.refresh_tokens (user_id, token)
		VALUES ($1, $2);
	`
	_, err = db.Exec(sqlStatement, user.ID, token)
	if err != nil {
		return "", err
	}

	return token, nil

}
func (t *RefreshToken) VerifyTokenByTokenId(token string) (int, error) {

	token, tokenClaims, err := verifyToken(token)
	if err != nil {
		return 0, err
	}
	print(tokenClaims)
	sqlStatement := `
	SELECT id
    FROM public.refresh_tokens t
    WHERE token = $1
	`
	var id int
	err = db.QueryRow(sqlStatement, token).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("invalid token")
	}
	return id, nil
}
func (t *RefreshToken) UserByTokenId(token string) (*User, error) {
	sqlStatement := `
	SELECT users.id, users.password, users.email
		FROM Users
		JOIN refresh_tokens ON Users.id = refresh_tokens.user_id
		where refresh_tokens.token = $1;
	`
	var user User
	row := db.QueryRow(sqlStatement, token)
	err := row.Scan(
		&user.ID,
		&user.Password,
		&user.Email,
	)

	if err != nil {
		return nil, err
	}
	return &user, nil

}

func (t *RefreshToken) DeleteByID(id int) error {

	sqlStatement := `
	DELETE
	FROM public.refresh_tokens
	WHERE id = $1;
	`
	_, err := db.Exec(sqlStatement, id)
	if err != nil {
		return err
	}
	return nil
}

func createJWTToken(username string, rule string) (string, error) {

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

func verifyToken(tokenString string) (string, *TokenClaims, error) {

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
