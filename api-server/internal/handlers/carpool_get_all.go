package handler

import (
	"rw-helper-back/consts"
	"rw-helper-back/dao"
	"rw-helper-back/util"

	"github.com/gin-gonic/gin"
)

func GetAllCarpool(ctx *gin.Context) {
	carpools, err := dao.GetCarpools()
	if err != nil {
		util.RetErr(ctx, consts.ErrSystem, err.Error())
		return
	}

	util.RetJson(ctx, carpools)
	return
}
