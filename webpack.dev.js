import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
    mode: 'development',
    devServer: {
        port: 3001,
        static: {
            directory: './dist'
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        hot: false,
        liveReload: true
    }
})