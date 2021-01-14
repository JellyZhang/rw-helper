package dao

import (
	"context"
	"fmt"
	"rw-helper-back/config"
	"rw-helper-back/model"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

var PG *pg.DB

func InitPostgres(ctx context.Context) {
	conf := config.Config
	PG = pg.Connect(&pg.Options{
		Addr:     conf.Postgres.Addr,
		User:     conf.Postgres.User,
		Password: conf.Postgres.Password,
		Database: conf.Postgres.Database,
	})

	if err := PG.Ping(ctx); err != nil {
		panic(fmt.Sprintf("connect to postgres error, err=%v", err))
	}
	err := PG.Model(&model.Carpool{}).CreateTable(&orm.CreateTableOptions{
		Varchar:       0,
		Temp:          false,
		IfNotExists:   true,
		FKConstraints: false,
	})
	if err != nil {
		panic(err)
	}
}
