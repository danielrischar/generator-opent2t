'use strict';

var yeoman = require('yeoman-generator');
var extend = require('util')._extend;
const packagePrefix = 'opent2t-translator-com-';

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.option('hub');
    this.option('schema');

    this.props = {
      hub: this.options.hub,
      schema: this.options.schema
    };

    var deviceName = this.props.schema.value.replace('org.opent2t.sample.', '').replace('.superpopular', '');
    this.props.packageName = packagePrefix + this.props.hub.value + '-' + deviceName.toLowerCase();
    this.props.hubPackageName = packagePrefix + this.props.hub.value + '-hub';
  },

  prompting: function () {
    var prompts = [
      {
        type: 'input',
        name: 'packageName',
        message: 'What is the name of the translator node package?',
        default: this.props.packageName,
        validate: function (input) {
          var pass = input.toLowerCase().startsWith(packagePrefix);
          if (pass) {
            return true;
          }
          return 'Please enter a valid package name. It must start with ' + packagePrefix + ' and should adhere to the requirements for node package names.';
        }
      }
    ];

    return this.prompt(prompts).then(function (props) {
      this.props = extend(this.props, props);
    }.bind(this));
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('js/thingTranslator.js.template'),
      this.destinationPath('dist/js/thingTranslator.js'),
      {props: this.props}
    );
    this.fs.copyTpl(
      this.templatePath('js/manifest.xml.template'),
      this.destinationPath('dist/js/manifest.xml'),
      {props: this.props}
    );
    this.fs.copyTpl(
      this.templatePath('js/package.json.template'),
      this.destinationPath('dist/js/package.json'),
      {props: this.props}
    );
    this.fs.copyTpl(
      this.templatePath('js/README.md.template'),
      this.destinationPath('dist/js/README.md'),
      {props: this.props}
    );
  }
});
