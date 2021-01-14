package util

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Resp struct {
	ErrCode int
	ErrMsg  string
	Data    interface{}
}

func RetJson(c *gin.Context, data interface{}) {
	resp := &Resp{
		ErrCode: 0,
		ErrMsg:  "success",
		Data:    data,
	}
	c.JSON(http.StatusOK, resp)
}

func RetNil(c *gin.Context) {
	resp := &Resp{
		ErrCode: 0,
		ErrMsg:  "success",
	}
	c.JSON(http.StatusOK, resp)
}

func RetErr(c *gin.Context, errCode int, errMsg string) {
	resp := &Resp{
		ErrCode: errCode,
		ErrMsg:  errMsg,
	}
	c.JSON(http.StatusOK, resp)
}
