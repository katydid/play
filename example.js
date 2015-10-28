var jsonDefault = JSON.stringify({
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
			"Properties": ["Poison", "Projectile"],
			"Anatomy": "Abdomen"
		},
		{
			"Name": "Fire Breath",
			"Properties": ["Fire", "Vapor"],
			"Anatomy": "Mouth"
		}
	],
	"DragonsExist": false,
	"MonkeysSmart": true,
	"Family": {
		"Class": "Insecta",
		"Order": {
			"Superorder": {
				"Subclass":	"Pterygota",
				"Infraclass": "Polyneoptera"
			},
			"Order": "Orthoptera"
		},
		"Suborder":	"Ensifera",
		"Family": "Tettigoniidae"
	}
}, "", 4);

var defaultKatydid = `(
	.WhatsUp == "E" &
	.Survived >= int(1000000) /*years*/ & 
	.DragonsExist != true &
	.MonkeysSmart :: $bool &
	.History [
		*,
		_ == "Katydids Alive"
	] &
	.FeatureRequests._ [
		Name *= "art",
		*,
		Anatomy $= "omen",
	]
)
`;