const path = require('path')
const {defineConfig} = require('@vue/cli-service')

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

        output: {
            // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `js/[name].checkout.${Version}.js`,
            chunkFilename: `js/[name].checkout.${Version}.js`
        }
    },
})
