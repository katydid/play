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
	encxml "encoding/xml"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
	"github.com/katydid/katydid/parser"
	"github.com/katydid/katydid/parser/json"
	"github.com/katydid/katydid/parser/xml"
	"github.com/katydid/validator-go/validator/ast"
	"github.com/katydid/validator-go/validator/mem"
	validatorparser "github.com/katydid/validator-go/validator/parser"
)

func main() {
	js.Global.Set("gofunctions", map[string]interface{}{
		"RelapsePlayground": ValidatorPlayground,
	})
}

func ValidatorPlayground(mode string, katydidStr, input string) string {
	v, err := validatorPlayground(mode, katydidStr, input)
	if err != nil {
		return "Error: " + err.Error()
	}
	return fmt.Sprintf("%v", v)
}

func newParser(mode string, inputStr string) (parser.Interface, error) {
	switch mode {
	case "json":
		m := make(map[string]interface{})
		if err := encjson.Unmarshal([]byte(inputStr), &m); err != nil {
			return nil, err
		}
		p := json.NewJsonParser()
		err := p.Init([]byte(inputStr))
		if err != nil {
			return nil, err
		}
		return p, nil
	case "xml":
		var m interface{}
		if err := encxml.Unmarshal([]byte(inputStr), &m); err != nil {
			return nil, err
		}
		p := xml.NewXMLParser()
		err := p.Init([]byte(inputStr))
		if err != nil {
			return nil, err
		}
		return p, nil
	}
	return nil, fmt.Errorf("unknown mode %s", mode)
}

func validatorPlayground(mode, katydidStr, inputStr string) (match bool, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
	}()
	var g *ast.Grammar
	g, err = validatorparser.ParseGrammar(katydidStr)
	if err != nil {
		return
	}
	var p parser.Interface
	p, err = newParser(mode, inputStr)
	if err != nil {
		return
	}
	var m *mem.Mem
	m, err = mem.New(g)
	if err != nil {
		return
	}
	match, err = m.Validate(p)
	return
}
