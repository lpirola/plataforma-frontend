# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)
"""
Confirmacao da data da sessão 10 dias antes da sessão
"""

import sys
from os import path
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

from datetime import datetime, timedelta
from email_scripts import const
from email_scripts.mongo_connector import get_conn
from email_scripts.email_connector import parse_and_send, get_smtp_conn

SUBJECT = u"Tudo certo para a sua sessão?"
TPL_NAME = "confirm_screening_date.html"

def filter_and_send():
    cli, db = get_conn()
    films = db['films']
    users = db['users']
    now = datetime.now()
    end = now + timedelta(days=10)
    start = end - timedelta(minutes=5)
    query = films.find({
        "screening.date": {"$gte": start, "$lt": end}
    })
    print("now:      {}".format(now))
    print("start:    {}".format(start))
    print("end:      {}".format(end))
    server = None
    for film in query:
        for screening in film['screening']:
            date = screening.get('date', None)
            # if screening['_id'] == '24b912df51966d8b9f452cbe':
            #     import ipdb; ipdb.set_trace()
            if date and date >= start and date < end:
                if not server:
                    server = get_smtp_conn()
                ambassador = \
                    users.find_one({"_id": screening['user_id']})
                print("{} :: {}".format(screening['date'], film['title']))
                parse_and_send(
                    server=server,
                    _from=const.FROM,
                    to=ambassador['emails'][0]['address'],
                    subject=SUBJECT,
                    template=TPL_NAME,
                    context={
                        'ambassador': ambassador,
                        'movie': film,
                        'screening': screening
                    }
                )

if __name__ == '__main__':
    filter_and_send()
