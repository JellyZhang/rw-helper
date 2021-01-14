package dao

import "rw-helper-back/model"

// GetCarpoolByCarpoolId 用ID获取Carpool
func GetCarpoolByCarpoolId(carpoolId int64) (*model.Carpool, error) {
	carpool := new(model.Carpool)
	if err := PG.Model(carpool).Where("id = ?", carpoolId).First(); err != nil {
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
func CreateCarpool(startPos, endPos, wechatRoomId string) error {
	carpool := &model.Carpool{
		StartPos:     startPos,
		EndPos:       endPos,
		WechatRoomId: wechatRoomId,
	}
	if _, err := PG.Model(carpool).Insert(); err != nil {
		return err
	}
	return nil
}
