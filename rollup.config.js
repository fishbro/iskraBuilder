import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: './src/app.ts',
    output: {
        file: './dist.js',
        format: 'cjs'
    },
    plugins: [
        typescript(),
        resolve(),
        commonjs()
    ]
};