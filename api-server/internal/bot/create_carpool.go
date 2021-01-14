package bot

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"rw-helper-back/config"
)

func CreateCarpool(userId string, startPos string, endPos string) (string, error) {
	conf := config.Config
	req, err := http.NewRequest("POST", conf.Bot.Addr+"/room/create", nil)
	if err != nil {
		log.Print(err)
		return "", err
	}

	topic := startPos + "  ->  " + endPos
	q := req.URL.Query()
	q.Add("id", userId)
	q.Add("topic", topic)
	req.URL.RawQuery = q.Encode()

	fmt.Println(req.URL.String())

	var responseModel struct {
		ErrCode int32  `json:"errCode"`
		ErrMsg  string `json:"errMsg"`
		Data    struct {
			Id string `json:"id"`
		}
	}
	var resp *http.Response
	resp, err = http.DefaultClient.Do(req)
	if err != nil {
		log.Print(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err := json.Unmarshal(body, &responseModel); err != nil {
		return "", err
	}

	return responseModel.Data.Id, nil

}
