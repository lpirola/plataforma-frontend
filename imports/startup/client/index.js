// Import client startup through a single index entry point

// import { Router } from 'meteor/iron:router';
import { Tracker } from 'meteor/tracker';
import { Router } from 'meteor/iron:router';

import { $ } from 'meteor/jquery';
import WebFont from 'webfontloader';

import 'summernote/dist/summernote';
import 'summernote/src/icons/dist/_summernote.scss';
import 'summernote/src/less/summernote.scss';

import 'bootstrap-sass';

import 'select2';
import 'select2/dist/css/select2.css';
import 'select2-bootstrap-theme/dist/select2-bootstrap.css';

import './routes.js';
import './routes-ambassador.js';
import './routes-admin.js';
import './hooks.js';
import './helpers.js';

WebFont.load({
  google: {
    families: ['Roboto:300,500,700'],
  },
});

Tracker.autorun(function () {
  const current = Router.current();
  Tracker.afterFlush(function () {
    $(window).scrollTop(0);
  });
});
