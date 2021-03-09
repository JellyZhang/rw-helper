package model

import "time"

type Carpool struct {
	tableName struct{} `pg:"carpools"`

	CarpoolId        int64     `pg:",pk"`
	Status           int32     `pg:"default:0"`         // status of this carpool, 0 :just created, 1 :owner joined, 99 :cloesd
	StartPos         string    `pg:"type:varchar(100)"` // the start position of Carpool
	EndPos           string    `pg:"type:varchar(100)"` // the destination position of Carpool
	StartTime        time.Time `pg:"type:timestamptz"`  // the departure time of this carpool
	WechatRoomId     string    `pg:"type:varchar(30)"`  // the WechatRoomId of this Carpool
	TotalMember      int32     `pg:"default:4"`         // total number of person of this carpool (driver excluded)
	CurrentMember    int32     `pg:"default:0"`         // current number of person of this carpool (driver excluded)
	Note             string    `pg:"type:varchar(100)"` // the note from the organizer of this carpool
	WechatRoomQRcode string    `pg:"type:varchar(100)"` // the qrcode url of wechat room
	ExpiredAt        time.Time `pg:"type:timestamptz"`  // the expired time of current qrcode
}
