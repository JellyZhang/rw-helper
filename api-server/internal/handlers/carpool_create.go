package handler

import (
	"rw-helper-back/bot"
	"rw-helper-back/consts"
	"rw-helper-back/dao"
	"rw-helper-back/util"

	"github.com/gin-gonic/gin"
)

type CarpoolCreateReq struct {
	UserId   string `form:"user_id" binding:"required"`
	StartPos string `form:"start_pos" binding:"required"`
	EndPos   string `form:"end_pos" binding:"required"`
}

func checkCarpoolCreateParams(ctx *gin.Context) (*CarpoolCreateReq, error) {
	req := new(CarpoolCreateReq)
	if err := ctx.ShouldBind(req); err != nil {
		return nil, err
	}

	return req, nil

}

func CreateCarpool(ctx *gin.Context) {
	req, err := checkCarpoolCreateParams(ctx)
	if err != nil {
		util.RetErr(ctx, consts.ErrParams, err.Error())
		return
	}

	roomId, err := bot.CreateCarpool(req.UserId, req.StartPos, req.EndPos)
	if err != nil {
		util.RetErr(ctx, consts.ErrSystem, err.Error())
		return
	}

	err = dao.CreateCarpool(req.StartPos, req.EndPos, roomId)
	if err != nil {
		util.RetErr(ctx, consts.ErrSystem, err.Error())
		return
	}

	util.RetNil(ctx)
	return

}
