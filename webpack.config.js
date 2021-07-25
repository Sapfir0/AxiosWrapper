const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
    const currentEnivronment = env.NODE_ENV || env.nodeEnv; 
    const isProduction = currentEnivronment === 'prod';
    const devtool = isProduction ? false : 'eval-cheap-module-source-map';

    return {
        entry: {
            axiosWrapper: './src/index.ts',
            'axiosWrapper.min': './src/index.ts',
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            publicPath: '/',
            filename: 'js/[name].bundle.js',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
        devtool,
        plugins: [],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                },
            ],
        },
    };
};
