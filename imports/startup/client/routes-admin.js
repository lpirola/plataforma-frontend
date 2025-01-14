import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
// import { Session } from 'meteor/session';
// import { $ } from 'meteor/jquery';

import '../../ui/components/adm-sidebar.html';
import '../../ui/components/admFilter.html';

import '../../ui/pages/admin/adm-fluxo-by-screening';
import '../../ui/pages/admin/adm-notification-templates';
import '../../ui/pages/admin/adm-notification-templates-new';
import '../../ui/pages/admin/adm-notification-templates-edit';
import '../../ui/pages/admin/adm-ambassador.html';
import '../../ui/pages/admin/adm-ambassadors.html';
import '../../ui/pages/admin/adm-ambassadors.js';
import '../../ui/pages/admin/adm-films.html';
import '../../ui/pages/admin/adm-films.js';
import '../../ui/pages/admin/adm-films-edit.js';
import '../../ui/pages/admin/adm-report.html';
import '../../ui/pages/admin/adm-report.js';
import '../../ui/pages/admin/adm-reports.html';
import '../../ui/pages/admin/adm-reports.js';
import '../../ui/pages/admin/adm-sessions2.html';
import '../../ui/pages/admin/adm-sessions2.js';
import '../../ui/pages/admin/adm-screening-edit.js';
import '../../ui/pages/admin/adm-films-new.js';
import '../../ui/pages/admin/adm-films-sort.html';
import '../../ui/pages/admin/adm-films-sort.js';
import '../../ui/pages/admin/adm-films-report.js';

import Screenings from '../../models/screenings.js';
import Films from '../../models/films.js';
import Users from '../../models/users';
import NotificationTemplates from '../../models/notification_templates';
import Notifications from '../../models/notifications';

import { publicRoutes } from './routes-ambassador.js';

Router.route('/adm/sessions2', {
  waitOn() {
    return Meteor.subscribe('screenings.all');
  },
  subscriptions() {
    Meteor.subscribe('films.all');
    Meteor.subscribe('users.all');
    Meteor.subscribe('notificationTemplates.all');
  },
  data() { return Screenings.find({}); },
  action() { this.render('admSessions2'); },
});

Router.route('/adm/ambassadors', {
  waitOn() {
    return Meteor.subscribe('users.all');
  },
  subscriptions() {
    Meteor.subscribe('films.all');
    Meteor.subscribe('screenings.all');
  },
  data() { return Users.find({}); },
  action() { this.render('admAmbassadors'); },
});

Router.route('/adm/notification-templates', {
  waitOn() { return Meteor.subscribe('notificationTemplates.all'); },
  data() { return NotificationTemplates.find({}); },
  action() { this.render('admNotificationTemplates'); },
});

Router.route('/adm/fluxo-by-screening/:screeningId', {
  waitOn() {
    return Meteor.subscribe('users.all') && Meteor.subscribe('notificationTemplates.all') && Meteor.subscribe('notificationByScreening.byScreening');
  },
  data() {
    return NotificationTemplates.find({})
      && Notifications.find({ screeningId: this.params.screeningId });
  },
  action() { this.render('admFluxoByScreening'); },
});

Router.route('/adm/notification-templates-new', {
  waitOn() { return Meteor.subscribe('films.all'); },
  // data() { return NotificationTemplates.find({}); },

  action() { this.render('admNotificationTemplatesNew'); },
});

Router.route('/adm/notification-templates-edit/:_id', {
  waitOn() {
    return Meteor.subscribe('notificationTemplates.all') && Meteor.subscribe('films.all');
    // Meteor.subscribe('notificationTemplates.all');
    // }
  },
  data() {
    return NotificationTemplates.findOne({ _id: this.params._id });
  },
  action() { this.render('admNotificationTemplatesEdit'); },
});


Router.route('/adm/films', {
  waitOn() { return Meteor.subscribe('films.all'); },
  data() { return Films.find({}, { sort: { created_at: -1 } }); },
  action() { this.render('admFilms'); },
});

Router.route('/adm/carousel', {
  waitOn() { return Meteor.subscribe('films.all'); },
  data() { return Films.find({}); },
  action() { this.render('admFilmsSort'); },
});

Router.route('/adm/films-edit/:_id', {
  template: 'admFilmsEdit',

  waitOn() {
    return this.subscribe('films.all');
  },

  data() {
    return Films.findOne({ _id: this.params._id });
  },
  action() {
    this.render('admFilmsEdit');
  },
});

Router.route('/adm/films-new', {
  template: 'admFilmsNew',

  waitOn() {
    return this.subscribe('films.all');
  },

  action() {
    this.render('admFilmsNew');
  },
});

Router.route('/adm/films-report/:_id', {
  template: 'admFilmsReport',

  waitOn() {
    return [
      this.subscribe('screenings.byFilm', this.params._id),
      this.subscribe('films.all'),
      this.subscribe('users.all'),
    ];
  },

  data() {
    return Films.findOne({ _id: this.params._id });
  },

  action() {
    this.render('admFilmsReport');
  },
});

Router.route('/adm/ambassador/:_id', {
  template: 'admAmbassador',
  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('users.all');
  },

  data() {
    return Meteor.users.findOne({ _id: this.params._id });
  },
});


// Router.route('/adm/session/:_id', {
//   template: 'admSessionReport',
//   waitOn() {
//     // return one handle, a function, or an array
//     return Meteor.subscribe('screenings.all');
//   },

//   data() {
//     const sessionId = this.params._id;
//     return Screenings.findOne({ _id: sessionId });
//   },
// });

Router.route('/adm/film/:_id/reports', {
  template: 'admReports',
  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films.all');
  },

  data() {
    const filmId = this.params._id;
    return Films.findOne({ _id: filmId });
  },
});

Router.route('/adm/report/:_id', {
  template: 'admReport',
  waitOn() {
    return [this.subscribe('screenings.all'), this.subscribe('films.all')];
  },

  data() {
    const sessionId = this.params._id;
    return Screenings.findOne({ _id: sessionId });
  },
});

Router.route('/adm/edit-screening/:_id', {
  waitOn() {
    return [this.subscribe('screenings.all'), this.subscribe('films.all')];
  },
  data() {
    return Screenings.findOne({ _id: this.params._id });
  },
  action() {
    this.render('adminEditScreening');
  },
});

function isAdmin() {
  const userId = Meteor.userId();
  if (userId == null) {
    Router.go('login');
  }
  Meteor.users.find({ _id: userId }).map((user) => {
    if (
      user.profile.roles === undefined
      || user.profile.roles[0] !== 'admin'
    ) {
      Router.go('denied');
    }
    return user;
  });
  this.next();
}

const ambassadorRoutes = [
  'ambassador',
  'ambassador-edit',
  'edit-screening',
  'new-screening',
  'report',
];

Router.onBeforeAction(isAdmin, {
  except: [].concat(ambassadorRoutes, publicRoutes),
});
