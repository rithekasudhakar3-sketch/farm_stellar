module.exports = {
    input: ['src/**/*.{js,jsx,ts,tsx}'],
    output: 'public/locales/$LOCALE/translation.json',
    locales: ['en', 'mr', 'ml'],
    defaultNamespace: 'translation',
    lexers: {
        js: ['JsxLexer'],
        jsx: ['JsxLexer'],
        ts: ['JsxLexer'],
        tsx: ['JsxLexer'],
        default: ['JsxLexer'],
    },
};
