// Copyright 2015 Walter Schulze
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

package main

import (
	encjson "encoding/json"
	"fmt"
	"github.com/gopherjs/gopherjs/js"
	"github.com/katydid/katydid/relapse/interp"
	"github.com/katydid/katydid/relapse/parser"
	"github.com/katydid/katydid/serialize/json"
)

func main() {
	js.Global.Set("gofunctions", map[string]interface{}{
		"Validate": Validate,
	})
}

func Validate(katydidStr, jsonStr string) string {
	v, err := validate(katydidStr, jsonStr)
	if err != nil {
		return "Error: " + err.Error()
	}
	return fmt.Sprintf("%v", v)
}

func validate(katydidStr, jsonStr string) (bool, error) {
	v := &validator{nil}
	b, err := v.validate(katydidStr, jsonStr)
	if err != nil {
		return false, err
	}
	if v.err != nil {
		return false, err
	}
	return b, nil
}

type validator struct {
	err error
}

func (this *validator) validate(katydidStr, jsonStr string) (bool, error) {
	defer func() {
		if r := recover(); r != nil {
			this.err = fmt.Errorf("%v", r)
		}
	}()
	m := make(map[string]interface{})
	if err := encjson.Unmarshal([]byte(jsonStr), &m); err != nil {
		return false, err
	}
	g, err := parser.ParseGrammar(katydidStr)
	if err != nil {
		return false, err
	}
	s := json.NewJsonScanner()
	err = s.Init([]byte(jsonStr))
	if err != nil {
		return false, err
	}
	match := interp.Interpret(g, s)
	return match, nil
}
