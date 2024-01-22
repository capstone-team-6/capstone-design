module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },  
    extends: ["plugin:vue/vue3-recommended", "standard"],
    parserOptions: {
        ecmaVerstion: "latest",
        parser: "@typescript-eslint/parser",
        sourceType: "module"
    },
    plugins: []
}