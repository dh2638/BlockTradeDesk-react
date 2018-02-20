from .base import *

ALLOWED_HOSTS = [
    '*',
]
DEBUG = True

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = ''
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_USE_TLS = False
EMAIL_PORT = 25
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


# command for mongo
# 1. mongo
# 2. use blocktradedesk
# 2. db.createUser({ user:"user", pwd: "password",roles:[{role: "readWrite", db:'blocktradedesk'}]})
MONGO_USERNAME = 'nividata'
MONGO_PASSWORD = 'admin@123'
MONGO_DATABASE = 'blocktradedesk'
MONGO_COLLECTION = 'currency'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'blocktradedesk.db',
    }
}

