import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import _ from 'underscore';
import c3 from 'c3';
import Plyr from 'plyr';

import './show-film.html';

require('readmore-js');

Template.showFilm.helpers({
  filmId() {
    return Template.instance().parent().data._id;
  },
  linklist() {
    const printLinks = [];
    const links = ['facebook', 'twitter', 'youtube', 'instagram'];
    const film = this;

    _.each(links, (elem) => {
      if (film[elem]) {
        printLinks.push({
          name: elem,
          link: film[elem],
        });
      }
    });

    return printLinks;
  },
  is_only_portfolio() {
    return (Template.instance().parent().data.status === 'Portfolio');
  },
  is_portfolio() {
    return (Template.instance().parent().data.status === 'Portfolio' || this.status === 'Difusão/Portfolio');
  },
  is_difusao() {
    return (Template.instance().parent().data.status === 'Difusão' || this.status === 'Difusão/Portfolio');
  },
  is_difusao_portfolio() {
    return (Template.instance().parent().data.status === 'Difusão/Portfolio');
  },
  is_oculto() {
    return Template.instance().parent().data.status === 'Oculto';
  },
  hideIfNotDifusaoPortfolio() {
    if (Template.instance().parent().data.status === 'Difusão/Portfolio') {
      return '';
    }
    return 'hide';
  },
  tibr() {
    return this.technical_information ? `<p>${this.technical_information.replace(/\n/g, '</p><p>')}</p>` : '';
  },
  has_categories() {
    return !_.isEmpty(this.categories);
  },
});

Template.showFilm.onRendered(() => {
  $('#carousel').slick({
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
  });

  $('.wrapper-overflow').readmore({
    embedCSS: false,
    speed: 75,
    collapsedHeight: 420,
    lessLink: '<a href="#">Fechar</a>',
    moreLink: '<a href="#">Ler mais</a>',
  });

  const player = new Plyr('#player');
  player.volume = 1;

  const instance = Template.instance();
  if (instance.data.status.includes('Portfolio')) {
    const inventory = instance.data.statistics;

    if (!inventory) return;

    if (inventory.viewers_zones) {
      const labels = [];
      _.keys(inventory.viewers_zones).forEach((k) => {
        labels.push([k,
          inventory.viewers_zones[k]]);
      });

      c3.generate({
        bindto: '#zone-chart',
        data: {
          columns: labels,
          type: 'pie',
          onclick(d) { d.preventDefault(); },
        },
        legend: {
          item: {
            onclick(d) { d.preventDefault(); },
          },
        },
      });
    }

    if (inventory.viewers_per_month) {
      const labels = [];
      _.keys(inventory.viewers_per_month).forEach((k) => {
        labels.push([k, parseInt(inventory.viewers_per_month[k], 10)]);
      });
      c3.generate({
        bindto: '#viewers-chart',
        data: {
          columns: [
            [].concat(['Número Espectadores por mês'], _.values(inventory.viewers_per_month)),
          ],
          type: 'spline',
          onclick(d) { d.preventDefault(); },
        },
        axis: {
          x: {
            type: 'category',
            categories: _.keys(inventory.viewers_per_month),
          },
          y: {
            label: 'Total de espectadores',
          },
        },
        legend: {
          item: {
            onclick(d) { d.preventDefault(); },
          },
        },
      });
    }

    if (inventory.categories) {
      const labels = [];
      _.keys(inventory.categories).forEach((k) => {
        labels.push([k, inventory.categories[k]]);
      });
      c3.generate({
        bindto: '#institution-type-chart',
        data: {
          columns: labels,
          type: 'donut',
          onclick(d) { d.preventDefault(); },
        },
        legend: {
          item: {
            onclick(d) { d.preventDefault(); },
          },
          position: 'right',
        },
      });
    }

    if (inventory.subcategories) {
      const labels = [];
      _.keys(inventory.subcategories).forEach((k) => {
        labels.push([k, inventory.subcategories[k]]);
      });
      c3.generate({
        bindto: '#institution-area-chart',
        data: {
          columns: labels,
          type: 'donut',
          onclick(d) { d.preventDefault(); },
        },
        legend: {
          item: {
            onclick(d) { d.preventDefault(); },
          },
          position: 'right',
        },
      });
    }
  }
});
