// Copyright 2016 Walter Schulze
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
	"testing"
)

func TestValidate(t *testing.T) {
	katydidStr := `(
	.WhatsUp == "E" &
	.Survived >= 1000000 /*years*/ & 
	.DragonsExist != true &
	.MonkeysSmart :: $bool &
	.History [
		*,
		_ == "Katydids Alive"
	] &
	.FeatureRequests._ {
		Name *= "art";
		*;
		Anatomy $= "omen";
	}
)
`
	jsonStr := `{
    "WhatsUp": "E",
    "Survived": 100000000,
    "History": [
        "Giant Lizards",
        "Meteor",
        "Lizards Dead",
        "Katydids Alive"
    ],
    "FeatureRequests": [
        {
            "Name": "Dart",
            "Properties": [
                "Poison",
                "Projectile"
            ],
            "Anatomy": "Abdomen"
        },
        {
            "Name": "Fire Breath",
            "Properties": [
                "Fire",
                "Vapor"
            ],
            "Anatomy": "Mouth"
        }
    ],
    "DragonsExist": false,
    "MonkeysSmart": true,
    "Family": {
        "Class": "Insecta",
        "Order": {
            "Superorder": {
                "Subclass": "Pterygota",
                "Infraclass": "Polyneoptera"
            },
            "Order": "Orthoptera"
        },
        "Suborder": "Ensifera",
        "Family": "Tettigoniidae"
    }
}`
	valid, err := validatorPlayground("json", katydidStr, jsonStr)
	if err != nil {
		t.Fatal(err)
	}
	if !valid {
		t.Fatal("expected valid, but got invalid")
	}
}
