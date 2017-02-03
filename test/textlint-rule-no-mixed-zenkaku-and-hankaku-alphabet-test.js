// MIT © 2017 azu
"use strict";
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
// rule
const rule = require("../src/textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet");
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: [
        // default: 半角
        "ABC",
        {
            text: "ＡＢＣ",
            options: {
                prefer: "全角"
            }
        }
    ],
    invalid: [
        {
            text: "ABC は ＡＢＣ",
            fixer: "ABC は ABC",
            options: {
                prefer: "半角"
            },
            errors: [
                {
                    message: "アルファベットは「半角」で表記します。",
                    line: 1,
                    column: 7
                }
            ]
        },
        {
            text: "ABC は ＡＢＣ",
            fixer: "ＡＢＣ は ＡＢＣ",
            options: {
                prefer: "全角"
            },
            errors: [
                {
                    message: "アルファベットは「全角」で表記します。",
                    line: 1,
                    column: 1
                }
            ]
        },
        // multiple

        {
            text: `
1. ABC は ＡＢＣ
2. CDE は ＣＤＥ
`,
            fixer: `
1. ABC は ABC
2. CDE は CDE
`,
            options: {
                prefer: "半角"
            },
            errors: [
                {
                    message: "アルファベットは「半角」で表記します。",
                    line: 2,
                    column: 10
                },
                {
                    message: "アルファベットは「半角」で表記します。",
                    line: 3,
                    column: 10
                }
            ]
        },
    ]
});