const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        require('precss'),
        autoprefixer({
            cascade: true,
            remove: true
        })
    ]
}