import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: './src/app.js',
    output: {
        file: './dist.js',
        format: 'cjs'
    },
    plugins: [
        resolve(),
        commonjs()
    ]
};