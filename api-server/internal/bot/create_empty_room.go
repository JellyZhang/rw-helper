package bot

import (
	"encoding/json"
	"log"
	"rw-helper-back/config"

	"github.com/ddliu/go-httpclient"
)

type ResponseModel struct {
	ErrCode int32  `json:"errCode"`
	ErrMsg  string `json:"errMsg"`
	Data    struct {
		RoomId string `json:"roomId"`
		QRcode string `json:"qrcode"`
	}
}

// Create an empty wechat room and set topic
// return roomId, qrcode
func CreateEmptyRoom(topic string) (string, string, error) {
	conf := config.Config
	url := conf.Bot.Addr + "/room/create"

	res, err := httpclient.Get(url, map[string]string{
		"topic": topic,
	})
	if err != nil {
		log.Fatalf("[CreateEmptyRoom] bot http call create room failed, err=%v", err)
		return "", "", err
	}

	var responseModel ResponseModel

	err = json.NewDecoder(res.Body).Decode(&responseModel)
	if err != nil {
		log.Fatalf("[CreateEmptyRoom] bot http call deserialize response error, err=%v", err)
		return "", "", err
	}

	return responseModel.Data.RoomId, responseModel.Data.QRcode, nil
}
