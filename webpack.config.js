module.exports = {
    entry: "./main",
    output: {
        filename: "app.js"
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    resolve: {
        extensions: ["tsx", ".ts", ".js"]
    }
}