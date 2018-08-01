import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'

const minify = process.env.MINIFY
const format = process.env.FORMAT
const es = format === 'es'
const umd = format === 'umd'
const cjs = format === 'cjs'

let output

if (es) {
    output = { file: `sync-form/dist/sync-form.es.js`, format: 'es' }
} else if (umd) {
    if (minify) {
        output = {
            file: `sync-form/dist/sync-form.umd.min.js`,
            format: 'umd'
        }
    } else {
        output = { file: `sync-form/dist/sync-form.umd.js`, format: 'umd' }
    }
} else if (cjs) {
    output = { file: `sync-form/dist/sync-form.cjs.js`, format: 'cjs' }
} else if (format) {
    throw new Error(`invalid format specified: "${format}".`)
} else {
    throw new Error('no format specified. --environment FORMAT:xxx')
}

export default {
    input: 'sync-form/form-view.mjs',
    output: Object.assign(
        {
            name: 'sync-form',
            exports: 'named'
        },
        output
    ),
    external: [],
    plugins: [
        resolve({ jsnext: true, main: true }),
        commonjs({ include: 'node_modules/**' }),
        babel({
            exclude: 'node_modules/**',
            babelrc: false,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: false,
                        loose: true
                    }
                ],
                ['@babel/preset-stage-2', { decoratorsLegacy: true }]
            ]
        }),
        umd
            ? replace({
                'process.env.NODE_ENV': JSON.stringify(
                    minify ? 'production' : 'development'
                )
            })
            : null,
        minify ? uglify() : null
    ].filter(Boolean)
}
