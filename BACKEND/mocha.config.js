export default {
    require: '@babel/register',
    extension: ['js'],
    spec: 'test/**/*.js',
    'watch-files': ['test/**/*.js'],
    ui: 'bdd',
    timeout: 5000
};
