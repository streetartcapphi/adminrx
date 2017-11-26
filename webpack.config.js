
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    entry: "./src/index.tsx",


    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    //devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            // ,{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },


    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
       //  "typescript-logging": "typescript-logging"
    },
    
    devServer: {
        historyApiFallback: {
            index: 'index.html'
      }
    },

    plugins: [
      new CopyWebpackPlugin([
              {from:'node_modules/react/dist/*min.js',to:'libs', flatten:true, ignore:["*.map"]},
              {from:'node_modules/react-dom/dist/*min.js',to:'libs', flatten:true, ignore:["*.map"]},
              {from:'node_modules/leaflet/dist/leaflet.*',to:'libs', flatten:true, ignore:["*.map"]},
              {from:'node_modules/leaflet/dist/images',to:'libs/images', ignore:["*.map"]},
              
              {from:'node_modules/react-leaflet/dist/*min.js',to:'libs', flatten:true, ignore:["*.map"]},
              {from:'node_modules/github-api/dist/GitHub.bundle.modified.js',to:'libs', ignore:["*.map"]},
            //  {from:'node_modules/typescript-logging/dist/bundle',to:'libs'}
              
          ]),
    ]

};
