const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        require('precss'),
        autoprefixer({
            browsers: ['last 2 versions', "IE 9"]
        })
    ]
}