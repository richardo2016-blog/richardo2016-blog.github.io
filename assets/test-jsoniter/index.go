package main

import "github.com/json-iterator/go"
import "fmt"

func main() {
	// plain map
	// testMap := map[string]interface{}{
	// 	"a": 123,
	// 	"b": []int{123},
	// 	"c": []int{456},
	// }

	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	testStr := `{"a":1,"b":[1,2],"c":[3,4], "d": {"d0": 1}}`

	var m map[string]interface{}
	json.Unmarshal([]byte(testStr), &m)

	for k, v := range m {
		fmt.Println(k, "=", v)
	}
}
