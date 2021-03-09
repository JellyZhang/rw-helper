package handler

import (
	"fmt"
	"log"
	"rw-helper-back/bot"
	"rw-helper-back/consts"
	"rw-helper-back/dao"
	"rw-helper-back/util"
	"time"

	"github.com/gin-gonic/gin"
)

type CarpoolCreateReq struct {
	StartPos       string `form:"start_pos" binding:"required" json:"start_pos"`
	EndPos         string `form:"end_pos" binding:"required" json:"end_pos"`
	StartTimeStamp int64  `form:"start_time_stamp" binding:"required" json:"start_time_stamp"`
	TotalMember    int32  `form:"total_member" binding:"required,max=4,min=1" json:"total_member"`
	Note           string `form:"note" binding:"" json:"note"`
}

func checkCarpoolCreateParams(ctx *gin.Context) (*CarpoolCreateReq, error) {
	req := new(CarpoolCreateReq)
	if err := ctx.ShouldBind(req); err != nil {
		return nil, err
	}

	startTime := time.Unix(req.StartTimeStamp, 0)

	// start_time must later than Now
	if time.Now().After(startTime) {
		return nil, fmt.Errorf("[checkCarpoolCreateParams] can not use start_time early than Now, start_time = %v", startTime)
	}

	// start_time must be later than Now at least some minutes
	if startTime.Sub(time.Now()) <= consts.StartTimeThreshold {
		return nil, fmt.Errorf("[checkCarpoolCreateParams] start_time must be later than Now at %v, start_time = %v", consts.StartTimeThreshold, startTime)
	}

	return req, nil

}

func CreateCarpool(ctx *gin.Context) {
	req, err := checkCarpoolCreateParams(ctx)
	if err != nil {
		util.RetErr(ctx, consts.ErrParams, err.Error())
		return
	}

	startTime := time.Unix(req.StartTimeStamp, 0)
	topic := req.StartPos + "➡️" + req.EndPos + " " + startTime.Format("01-02 15:04")
	roomId, qrcode, err := bot.CreateEmptyRoom(topic)
	if err != nil {
		log.Fatalf("[CreateCarpool] create empty room failed, err=%v", err)
		util.RetErr(ctx, consts.ErrSystem, err.Error())
		return
	}

	err = dao.CreateCarpool(req.StartPos, req.EndPos, startTime, req.TotalMember, roomId, qrcode, req.Note)
	if err != nil {
		log.Fatalf("[CreateCarpool] create carpool in db failed, err=%v", err)
		util.RetErr(ctx, consts.ErrSystem, err.Error())
		return
	}

	util.RetNil(ctx)
	return

}
