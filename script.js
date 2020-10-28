/* (!) ISSUES:
   - 1. Tratar estilos.css com @media...
   - 2. Tratar `undefined` quando há um espaço no final da string - /[\S\N]/.test(style)
*/

const inputText = document.querySelector('#input-text');
const outputText = document.querySelector('#output-text');
inputText.oninput = init;

function init() {
    let text = inputText.value;
    let stylesProcessed = processCSS(text);
    outputText.value = stylesProcessed;
}

function processCSS(textStyles) {
    textStyles = removeUnecessarySpaces(textStyles);
    let specialStylesList = getMediaStyles(textStyles);
    let simpleSylesList = getOnlySimpleStyles(textStyles, specialStylesList);

    let stylesList = [...simpleSylesList, ...specialStylesList];

    let processedStylesList = processStylesAttr(stylesList);

    let sortedStyles = processedStylesList.sort().join(`\n\n`);

    return sortedStyles;
}

function removeUnecessarySpaces(text) {
    let textWithoutSpaces = text.replace(/\s{2}/g, '').replace(/\n/, '');
    return textWithoutSpaces;
}

function getMediaStyles(stylesText) {
    let mediaStylesIterator = stylesText.matchAll(/@.*\}[\s]*\}/g);
    let mediaStylesList = [...mediaStylesIterator];
    return mediaStylesList;
}

function getOnlySimpleStyles(stylesText, specialStylesList) {

    if (specialStylesList && Array.isArray(specialStylesList)) {
        specialStylesList.forEach((style) => {
            stylesText = stylesText.replace(style[0], '');
        });
    }

    let anyBreakLineAOrSpace_afterClosedCurlyBracket = /(?<=\})[\n\s]*/;
    let splitedText = stylesText.split(anyBreakLineAOrSpace_afterClosedCurlyBracket);
    return splitedText;
}

function processStylesAttr(stylesList) {
    let processedStylesList = stylesList.map((style) => {
        let styleProcessed = style;

        if(!/@/.test(style)) {
           styleProcessed = organizeAttrList(style);
        }

        return styleProcessed;
    });

    return processedStylesList;
}

function organizeAttrList(style) {
    let firstCurlyBracket = style.indexOf(`{`);
    let lastCurlyBracket = style.lastIndexOf(`}`)
    let styleAtributes = style.slice(firstCurlyBracket + 1, lastCurlyBracket);

    let atributesList = styleAtributes.match(/\w.*?(?=;)/g) || [];
    atributesList = atributesList.sort();
    atributesList[0] = '     ' + atributesList[0];
    atributesList = atributesList.join(`;\n     `);

    return style.slice(0, firstCurlyBracket) + `{\n` + atributesList + `;\n}`;
}