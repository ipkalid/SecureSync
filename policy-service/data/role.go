package data

func (r *Role) CreateRoleForUser(userId int, roleId int) error {

	query := `
	INSERT INTO public.user_roles (user_id, role_id)
		VALUES ($1, $2);
	`

	_, err := db.Exec(query, userId, roleId)

	if err != nil {

		return err
	}

	return nil

}

func (r *Role) GetRoleById(id int) (*Role, error) {

	query := `
	SELECT  roles.id, roles.name
	FROM Users
	JOIN User_Roles ON Users.id = User_Roles.user_id
	JOIN Roles ON User_Roles.role_id = Roles.id  where users.id = $1;
	`

	var role Role
	row := db.QueryRow(query, id)

	err := row.Scan(
		&role.ID,
		&role.Name,
	)

	if err != nil {
		role = Role{ID: 1, Name: ""}
		return nil, err
	}

	return &role, nil
}
