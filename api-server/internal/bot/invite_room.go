package bot

import (
	"fmt"
	"log"
	"net/http"
	"rw-helper-back/config"
)

func InviteToRoom(userId string, roomId string) error {
	conf := config.Config
	req, err := http.NewRequest("POST", conf.Bot.Addr+"/room/invite", nil)
	if err != nil {
		log.Print(err)
		return err
	}

	q := req.URL.Query()
	q.Add("userId", userId)
	q.Add("roomId", roomId)
	req.URL.RawQuery = q.Encode()

	fmt.Println(req.URL.String())

	var resp *http.Response
	resp, err = http.DefaultClient.Do(req)
	if err != nil {
		log.Print(err)
	}
	defer resp.Body.Close()

	return nil

}
