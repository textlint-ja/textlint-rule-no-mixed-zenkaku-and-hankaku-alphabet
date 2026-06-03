// MIT © 2017 azu
"use strict";
const RuleHelper = require("textlint-rule-helper").RuleHelper;
const moji = require("moji");
function toHankaku(string) {
    return moji(string).convert('ZE', 'HE').toString();
}
function toZenakaku(string) {
    return moji(string).convert('HE', 'ZE').toString();
}
const defaultOptions = {
    // "全角" or "半角"
    "prefer": "半角"
};

const zenkakuOnly = ({report, RuleError, fixer}) => {
    return function checkZenkaku(node, text) {
        const matchRegExp = /([a-zA-Z]+)/gd;
        for (const match of text.matchAll(matchRegExp)) {
            const matchedText = match[1];
            const [startIndex, endIndex] = match.indices[1];
            report(node, new RuleError("アルファベットは「全角」で表記します。", {
                index: startIndex,
                fix: fixer.replaceTextRange([startIndex, endIndex], toZenakaku(matchedText))
            }));
        }
    };
};
const hankakuOnly = ({report, RuleError, fixer}) => {
    return function checkZenkaku(node, text) {
        const matchRegExp = /([ａ-ｚＡ-Ｚ]+)/gd;
        for (const match of text.matchAll(matchRegExp)) {
            const matchedText = match[1];
            const [startIndex, endIndex] = match.indices[1];
            report(node, new RuleError("アルファベットは「半角」で表記します。", {
                index: startIndex,
                fix: fixer.replaceTextRange([startIndex, endIndex], toHankaku(matchedText))
            }));
        }
    };
};
function reporter(context, options = {}) {
    const {Syntax, RuleError, report, fixer, getSource} = context;
    const prefer = options.prefer || defaultOptions.prefer;
    const helper = new RuleHelper(context);
    const checkText = prefer === "半角" ? hankakuOnly({report, RuleError, fixer}) : zenkakuOnly({report, RuleError, fixer});
    return {
        [Syntax.Str](node){
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            const text = getSource(node);
            checkText(node, text);
        }
    }
}
module.exports = {
    linter: reporter,
    fixer: reporter
};
