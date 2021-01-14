package model

type Carpool struct {
	tableName struct{} `pg:"carpools"`

	CarpoolId    int64  `pg:",pk"`
	StartPos     string `pg:"type:varchar(100)"` // the start position of Carpool
	EndPos       string `pg:"type:varchar(100)"` // the destination position of Carpool
	WechatRoomId string `pg:"type:varchar(30)"`  // the WechatRoomId of this Carpool
}
