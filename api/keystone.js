var config = require('./config.json');
var keystone = require('keystone');

keystone.init({

	'name': 'cocorico',
	'brand': 'cocorico',

	'views': 'templates/views',
	'view engine': 'jade',

	'wysiwyg images': true,
	'wysiwyg menubar': true,
	'wysiwyg additional plugins': 'table',

	'mongo' : config.mongo.uri,

	'auto update': false,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': '0T=?C|`ed@N&amp;,&lt;!)BQ&lt;Nh/7+e3TeO&#34;$^cl{7Z$7i@mfnybN1{*H.ETQ=(-&gt;75^MB'
});

keystone.import('models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

keystone.set('routes', require('./routes'));
keystone.set('nav', {
	'users': 'users',
	'bills': 'bills',
	'pages': 'pages'
});

keystone.start();
