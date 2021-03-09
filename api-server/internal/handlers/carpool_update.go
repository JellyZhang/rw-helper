package handler

import (
	"log"
	"rw-helper-back/consts"
	"rw-helper-back/dao"
	"rw-helper-back/util"

	"github.com/gin-gonic/gin"
)

type CarpoolUpdateReq struct {
	WechatRoomId  string `form:"wechat_room_id" binding:"required" json:"wechat_room_id"`
	CurrentMember int32  `form:"current_member" binding:"min=1" json:"current_member"`
}

func checkCarpoolUpdateParams(ctx *gin.Context) (*CarpoolUpdateReq, error) {
	req := new(CarpoolUpdateReq)
	if err := ctx.ShouldBind(req); err != nil {
		return nil, err
	}

	return req, nil

}

func UpdateCarpool(ctx *gin.Context) {
	req, err := checkCarpoolUpdateParams(ctx)
	if err != nil {
		util.RetErr(ctx, consts.ErrParams, err.Error())
		return
	}
	log.Printf("[UpdateCarpool] get request, wechatRoomId=%v, currentMember=%v", req.WechatRoomId, req.CurrentMember)

	carpool, err := dao.GetCarpoolByWechatRoomId(req.WechatRoomId)
	if err != nil {
		log.Fatalf("[UpdateCarpool] get carpool error, err=%v, wechatRoomId=%v, currentMember=%v", err, req.WechatRoomId, req.CurrentMember)
		util.RetErr(ctx, consts.ErrDataNotExist, consts.ErrDataNotExistMsg)
		return
	}

	toUpdate := map[string]interface{}{
		"current_member": req.CurrentMember,
	}

	if carpool.Status == consts.StatusCreated && req.CurrentMember > 0 {
		toUpdate["status"] = consts.StatusEnabled
	}

	err = dao.UpdateCarpool(carpool.CarpoolId, toUpdate)
	if err != nil {
		log.Fatalf("[UpdateCarpool] update carpool in db error, err=%v, wechatRoomId=%v, currentMember=%v", err, req.WechatRoomId, req.CurrentMember)
		util.RetErr(ctx, consts.ErrSystem, err.Error())
		return
	}

	util.RetNil(ctx)
	return

}
