package main

import (
	"context"
	"rw-helper-back/config"
	"rw-helper-back/dao"
	handler "rw-helper-back/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	ctx := context.Background()
	config.InitConfig()
	dao.InitPostgres(ctx)

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.POST("/carpool/create", handler.CreateCarpool)
	r.POST("/carpool/join", handler.JoinCarpool)
	r.GET("/carpools", handler.GetAllCarpool)

	r.Run()
}
