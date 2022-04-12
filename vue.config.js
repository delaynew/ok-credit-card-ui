const path = require('path')
const {defineConfig} = require('@vue/cli-service')
const JavaScriptObfuscator = require('webpack-obfuscator')

let devApi = 'https://www.hnzf.app'

const Version = new Date().getTime()

function resolve(dir) {
    return path.join(__dirname, dir)
}

console.log(process.env.VUE_APP_BASE_API)
module.exports = defineConfig({
    indexPath: 'index.html',
    publicPath: '/stripe/intent/',
    outputDir: process.env.VUE_APP_OUTPUT_DIR,
    assetsDir: '',
    lintOnSave: process.env.NODE_ENV === 'development',
    transpileDependencies: true,
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/dev-api': {
                target: devApi, // API服务器的地址
                ws: true, // 代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/dev-api': ''
                }
            }
        }
    },
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.plugin('extract-css')
                // eslint-disable-next-line no-unused-vars
                .tap(args => [{
                    filename: `css/[name].checkout.${Version}.css`,
                    chunkFilename: `css/[name].checkout.${Version}.css`
                }])
            // config.optimization.delete('splitChunks')
        }

    },

    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: 'Checkout',
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        externals: {
            'AMap': 'AMap',
            'AMapUI': 'AMapUI'
        },

        plugins: [

            new JavaScriptObfuscator({
                // 压缩代码
                compact: true,
                // 应用概率;在较大的代码库中，建议降低此值，因为大量的控制流转换可能会增加代码的大小并降低代码的速度。
                controlFlowFlatteningThreshold: 1,
                // 随机的死代码块(增加了混淆代码的大小)
                deadCodeInjection: true,
                // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
                disableConsoleOutput: true,
                // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                // 是否启用全局变量和函数名称的混淆
                renameGlobals: false,
                // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
                rotateStringArray: true,
                // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
                selfDefending: true,
            }, [`js/chunk-vendors.checkout.${Version}.js`])
        ],
        output: {
            // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `js/[name].checkout.${Version}.js`,
            chunkFilename: `js/[name].checkout.${Version}.js`
        },
    },

})

