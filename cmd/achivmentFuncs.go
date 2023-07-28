package main

import "strings"

func checkAchivments(user UserData, achivmentID string) bool {
	if strings.Contains(user.Achivments, "/"+achivmentID+"/") {
		return true
	} else {
		return false
	}
}
