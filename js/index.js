var app = app || {};

$(function( $ ) {

    'use strict';

	app.sitesModel = Backbone.Model.extend({
		url:'data/sites.json'
	});

});

$(function( $ ) {

    'use strict';

	app.searchView = Backbone.View.extend({

		el: '.search-container',
		inputValue : '',
		_getSearch: null,
		searchValue: null,

		events: {
			'keyup #search' : 'search'
		},

		initialize: function(){
            var self = this;

			this._getSearch = _.debounce(_.bind(this.getSearch, this), 1000);

			this.model = new app.sitesModel();
			this.model.fetch({
                success:function () {
                    // self.render();
                }
            });
		},

		getSearch: function(search){
			// called only once every seconds
			this.model.set('searchValue',search);
			this.render();
		},

		render: function(){
			var subElement = [];
			var searchFound = false;
			_.each(this.model.attributes, function (searchresults) {
					_.each(searchresults, function (searchresult) {
						if(searchresult.siteName && this.model.get('searchValue')){
							if(searchresult.siteName.indexOf(this.model.get('searchValue')) > -1){
								subElement.push( new app.searchResultView({model:searchresult}).render().el);
								searchFound = true;
							}
						}
					},this);
				if(searchFound === false) {
					subElement[0] = new app.searchResultErrorView().render().el;
				}
			}, this);

			this.$('.search-list').html(subElement);
			return this;
		},

		search: function(event){
			event.preventDefault();
			var search = this.$('#search').val().toLowerCase();
			this._getSearch(search);
		}

	})
});


$(function( $ ) {

	'use strict';
	app.searchResultView = Backbone.View.extend({

		template: _.template($('#searchList-template').html()),

		render: function() {
			this.$el.html(this.template( this.model));
			return this;
		}
	})
});

$(function( $ ) {

	'use strict';
	app.searchResultErrorView = Backbone.View.extend({

		template: _.template($('#searchError-template').html()),

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	})
});


$(function( $ ) {

    'use strict';

    var Workspace = Backbone.Router.extend({
        routes:{
            '': 'index'
        },

        initialize: function () {
            Backbone.history.start();
        },

        index: function() {
            new app.searchView();
        }
    });

    app.CounterRouter = new Workspace();
});

