package consts

import "time"

const (
	ErrSucc         = 0
	ErrParams       = 1
	ErrToken        = 2
	ErrDataExist    = 3
	ErrDataNotExist = 4
	ErrSystem       = 99
)

const (
	ErrSuccMsg         = "success"
	ErrParamsMsg       = "params error"
	ErrTokenMsg        = "token error"
	ErrDataExistMsg    = "data already exist"
	ErrDataNotExistMsg = "data not exist"
	ErrSystemMsg       = "system error"
)

const (
	StartTimeThreshold = 1 * time.Minute

	WechatRoomQRcodeExpireTime = 6 * 24 * time.Hour
)

// Carpool.Status
const (
	StatusCreated = iota
	StatusEnabled
	StatusLaunched

	StatusClosed = 99
)
