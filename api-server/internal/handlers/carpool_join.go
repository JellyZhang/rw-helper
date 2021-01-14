package handler

import (
	"rw-helper-back/bot"
	"rw-helper-back/consts"
	"rw-helper-back/util"

	"github.com/gin-gonic/gin"
)

type CarpoolJoinReq struct {
	UserId string `form:"user_id" binding:"required"`
	RoomId string `form:"room_id" binding:"required"`
}

func checkCarpoolJoinParams(ctx *gin.Context) (*CarpoolJoinReq, error) {
	req := new(CarpoolJoinReq)
	if err := ctx.ShouldBind(req); err != nil {
		return nil, err
	}

	return req, nil

}

func JoinCarpool(ctx *gin.Context) {
	req, err := checkCarpoolJoinParams(ctx)
	if err != nil {
		util.RetErr(ctx, consts.ErrParams, err.Error())
		return
	}

	err = bot.InviteToRoom(req.UserId, req.RoomId)
	if err != nil {
		util.RetErr(ctx, consts.ErrSystem, err.Error())
		return
	}

	util.RetNil(ctx)
	return

}
