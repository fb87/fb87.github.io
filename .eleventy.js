module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('./style', '/style');
    eleventyConfig.addWatchTarget('./style', '/style');

    eleventyConfig.addFilter("head", (array, n) => {
        if (!Array.isArray(array) || array.length === 0) {
            return [];
        }
        if (n < 0) {
            return array.slice(n);
        }

        return array.slice(0, n);
    });

    eleventyConfig.addFilter("md5", text => {
        var crypto = require('crypto');
        return crypto.createHash('md5').update(text).digest('hex');
    });

    return {
        dir: {
            input: "src",
            output: "dst"
        }
    };
};