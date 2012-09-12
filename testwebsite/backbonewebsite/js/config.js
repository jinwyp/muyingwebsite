
	seajs.config({
		alias: {
			'$': 'modules/jquery/1.7.2/jquery.js',
		    'jquery': 'modules/jquery/1.7.2/jquery.js',
	        'underscore': 'modules/underscore/1.3.3/underscore.js',
		    'backbone': 'modules/backbone/0.9.2/backbone.js',
		    'handlebars': 'modules/backbone/1.0.0/handlebars.js',
		    'coffee': 'modules/coffee/1.3.3/coffee-script.js',
		    'less': 'modules/less/1.3.0/less.js',
		    'jqm': 'modules/jquerymobile/jquery.mobile-1.1.0.min.js',
		    
		    'baseurl': './',
            'templateurl': './templates',
		},
		
		preload: ['plugin-json', 'plugin-text', 'plugin-coffee', 'plugin-less'],
		debug: 0
		
	});
	
	
	seajs.use('baseurl/js/init');
	
