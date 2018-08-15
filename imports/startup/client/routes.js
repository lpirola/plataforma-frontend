_ = lodash;

// Router.route(function(){
  Router.route('home', {path:"/"});
  Router.route('register');
  Router.route('ambassador-edit');
  Router.route('films');
  Router.route('adm');
  Router.route('adm/sessions');
  Router.route('adm/ambassadors');
  Router.route('screenings');
  Router.route('about');
  Router.route('login');
  Router.route('denied');
  Router.route('forget');
  Router.route('ambassador');
  Router.route('contact');

  Router.route('adm/films', {
    data: function() {
      Session.set('poster_path', null);

      return;
    }
  });

  Router.route('reset-password/:token', {
    template: 'resetPassword'
  });

  Router.route('adm/films/:slug/edit', {
    template: 'admFilms',

    waitOn: function() {
      return this.subscribe('films', this.params.slug);
    },

    data: function(){
      Session.set('poster_path', null);
      return Films.findOne({ slug: this.params.slug });
    }
  });

  Router.route('adm/ambassador/:_id', {
    template: 'admAmbassador',
    data: function(){
      return Meteor.users.findOne({_id: this.params._id});
    }
  });

  Router.route('new-screening/:slug', {
    template: 'newScreening',

    waitOn: function() {
      return this.subscribe('films', this.params.slug);
    },

    data: function() {
      Session.set('address', null);
      var filmId = this.params._id;
      return Films.findOne({ slug: this.params.slug });
    }
  });

  Router.route('edit-screening/:_id', {
    name: 'edit-screening',
    template: 'admScreening',
    data: function(){
      return Films.return_film_and_screening(this.params._id);
    }
  });
  Router.route('report/:_id', {
    template: 'report',
    data: function(){
      return Films.return_film_and_screening(this.params._id);
    }
  });
  Router.route('adm/session/:_id', {
    template: 'admSession',
    data: function(){
      var sessionId = this.params._id;
      return Films.return_screening(sessionId);
    }
  });

  Router.route('adm/film/:_id/reports', {
    template: 'admReports',
    data: function(){
      var filmId = this.params._id;
      return Films.findOne({ _id: filmId });
    }
  });

  Router.route('adm/report/:_id', {
    template: 'admReport',
    data: function(){
      return Films.return_film_and_screening(this.params._id);
    }
  });

  Router.route('film/:slug', {
    template: 'showFilm',

    waitOn: function() {
      return this.subscribe('films', this.params.slug);
    },

    data: function(){
      var filmId = this.params._id;
      return Films.findOne({ slug: this.params.slug });
    }
  });
// });

var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('login');
  } else {
    this.next();
  }
};

var isAdmin = function(going) {
  var self = this;
  var userId = Meteor.userId();
  if (userId == null) {
    Router.go('login');
  }
  Meteor.users.find({_id: Meteor.userId()}).map(function(user){
    if (user.profile.roles[0]==='admin') {
      self.next();
    } else {
      Router.go('denied');
    }
  });
};


var admin_uris = [
  'adm',
  'adm/ambassador/:_id',
  'adm/film/:_id/reports',
  'adm/films',
  'adm/films',
  'adm/films/:slug/edit',
  'adm/report/:_id',
  'adm/session/:_id',
  'adm/sessions'
];
var signed_in_uris = [
  'ambassador',
  'ambassador-edit',
  'edit-screening/:_id',
  'new-screening/:slug',
  'report/:_id'
];

Router.onBeforeAction(mustBeSignedIn, {only: signed_in_uris});
Router.onBeforeAction(isAdmin, {only: admin_uris});

//Router.onBeforeAction(fn, {only: ['index']});
