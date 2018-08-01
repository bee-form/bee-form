import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'

export default ({folder, name, index}) => {

    const minify = process.env.MINIFY;
    const format = process.env.FORMAT;
    const es = format === 'es';
    const umd = format === 'umd';
    const cjs = format === 'cjs';

    let output;

    if (es) {
        output = { file: `${folder}/dist/${name}.es.js`, format: 'es' }
    } else if (umd) {
        if (minify) {
            output = {
                file: `${folder}/dist/${name}.umd.min.js`,
                format: 'umd'
            }
        } else {
            output = { file: `${folder}/dist/${name}.umd.js`, format: 'umd' }
        }
    } else if (cjs) {
        output = { file: `${folder}/dist/${name}.cjs.js`, format: 'cjs' }
    } else if (format) {
        throw new Error(`invalid format specified: "${format}".`)
    } else {
        throw new Error('no format specified. --environment FORMAT:xxx')
    }
    return ({
        input: `${folder}/${index}`,
        output: Object.assign(
            {
                name: `${name}`,
                exports: 'named'
            },
            output
        ),
        external: [],
        plugins: [
            resolve({jsnext: true, main: true}),
            commonjs({include: 'node_modules/**'}),
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
                    ['@babel/preset-stage-2', {decoratorsLegacy: true}]
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
    });
}