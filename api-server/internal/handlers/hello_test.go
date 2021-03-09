package handler

import (
	"testing"
)

func TestHello(t *testing.T) {
	tests := []struct {
		name string
		want string
	}{
		{
			name: "success",
			want: "Hello",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Hello(); got != tt.want {
				t.Errorf("Hello() = %v, want %v", got, tt.want)
			}
		})
	}
}
