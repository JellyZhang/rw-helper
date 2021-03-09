package dao

import (
	"log"
	"rw-helper-back/consts"
	"rw-helper-back/model"
	"time"
)

// GetCarpoolByCarpoolId 用ID获取Carpool
func GetCarpoolByCarpoolId(carpoolId int64) (*model.Carpool, error) {
	carpool := new(model.Carpool)
	if err := PG.Model(carpool).Where("carpool_id = ?", carpoolId).First(); err != nil {
		log.Fatalf("[GetCarpoolByCarpoolId] dao get carpool from db error, err=%v, carpoolId=%v", err, carpoolId)
		return nil, err
	}
	return carpool, nil
}

// GetCarpoolByWechatRoomId 用微信群聊ID获取Carpool
func GetCarpoolByWechatRoomId(wechatRoomId string) (*model.Carpool, error) {
	carpool := new(model.Carpool)
	if err := PG.Model(carpool).Where("wechat_room_id = ?", wechatRoomId).First(); err != nil {
		log.Fatalf("[GetCarpoolByWechatRoomId] dao get carpool from db error, err=%v, wechatRoomId=%v", err, wechatRoomId)
		return nil, err
	}
	return carpool, nil
}

// GetCarpools 获取所有Carpool
func GetCarpools() ([]model.Carpool, error) {
	var carpools []model.Carpool
	if err := PG.Model(&carpools).Select(); err != nil {
		return nil, err
	}
	return carpools, nil
}

// CreateCarpool 创建Carpool
func CreateCarpool(startPos, endPos string, startTime time.Time, totalMember int32, wechatRoomId, wechatRoomQRcode string, note string) error {
	carpool := &model.Carpool{
		Status:           0,
		StartPos:         startPos,
		EndPos:           endPos,
		StartTime:        startTime,
		WechatRoomId:     wechatRoomId,
		TotalMember:      totalMember,
		CurrentMember:    0,
		Note:             note,
		WechatRoomQRcode: wechatRoomQRcode,
		ExpiredAt:        time.Now().Add(consts.WechatRoomQRcodeExpireTime),
	}
	if _, err := PG.Model(carpool).Insert(); err != nil {
		log.Fatalf("[CreateCarpool] dao create carpool in db error, err=%v, carpool=%+v", err, carpool)
		return err
	}
	return nil
}

// UpdateCarpool CurrentMember 更新当前用户数量
func UpdateCarpool(carpoolId int64, toUpdate map[string]interface{}) error {
	if _, err := PG.Model(&toUpdate).TableExpr("carpools").Where("carpool_id = ?", carpoolId).Update(); err != nil {
		log.Fatalf("[UpdateCarpool] dao create carpool in db error, err=%v, carpoolId=%v, toUpdate=%+v", err, carpoolId, toUpdate)
		return err
	}
	return nil
}
