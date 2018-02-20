"""
Django settings for blocktradedesk project.
"""
import os
from os import environ, getenv
from os.path import abspath, basename, dirname, join, normpath
from sys import path

########## PATH CONFIGURATION
BASE_DIR = dirname(dirname(__file__) + "../../../")

# Absolute filesystem path to the config directory:

CONFIG_ROOT = dirname(dirname(abspath(__file__)))

# Absolute filesystem path to the project directory:
PROJECT_ROOT = dirname(CONFIG_ROOT)

# Absolute filesystem path to the django repo directory:
DJANGO_ROOT = dirname(PROJECT_ROOT)

# Project name:
PROJECT_NAME = basename(PROJECT_ROOT).capitalize()

# Project folder:
PROJECT_FOLDER = basename(PROJECT_ROOT)

# Project domain:
PROJECT_DOMAIN = '%s.com' % PROJECT_NAME.lower()

# Add our project to our pythonpath, this way we don't need to type our project
# name in our dotted import paths:
path.append(CONFIG_ROOT)
########## END PATH CONFIGURATION

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

########## DEBUG CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = STAGING = False
########## END DEBUG CONFIGURATION

ADMINS = (
    ("""Neeraj kumar""", 'sainineeraj1234@gmail.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'CONN_MAX_AGE': 0,
        'ENGINE': 'django.db.backends.',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': '',  # Or path to database file if using sqlite3.
        'USER': '',
        'PASSWORD': '',
        'HOST': '',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',  # Set to empty string for default.
    }
}
DATABASES['default']['ATOMIC_REQUESTS'] = True

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'UTC'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'fr'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = normpath(join(PROJECT_ROOT, 'media'))

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = normpath(join(PROJECT_ROOT, 'assets'))

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    normpath(join(PROJECT_ROOT, 'static')),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'django.contrib.staticfiles.finders.DefaultStorageFinder',

)

# Make this unique, and don't share it with anybody.
SECRET_KEY = environ.get('DJANGO_SECRET_KEY', 'blocktradedesk')

# List of callables that know how to import templates from various sources.
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': (normpath(join(PROJECT_ROOT, 'templates')),),
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.media',
                'django.template.context_processors.csrf',
                'django.template.context_processors.tz',
                'django.template.context_processors.static',
            ]
        },
    },
]

MIDDLEWARE = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'blocktradedesk.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'blocktradedesk.wsgi.application'

INSTALLED_APPS = (

    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.admin',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'django.contrib.staticfiles',
    'django.contrib.messages',

    'rest_framework',  # utilities for rest apis
    'rest_framework.authtoken',  # token authentication
    'rest_framework_swagger',

    'treebeard',
    'django_select2',
    'reversion',
    'django_extensions',
    'corsheaders'
)
PROJECT_APPS = ('users', 'apps.currency')
INSTALLED_APPS += PROJECT_APPS

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'production_only': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
        'development_only': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'formatters': {
        'verbose': {
            'format': '[%(asctime)s] %(levelname)-8s [%(name)s:%(lineno)s] %(message)s',
            'datefmt': '%m/%d/%Y %H:%M:%S',
        },
        'simple': {
            'format': '%(levelname)-8s [%(name)s:%(lineno)s] %(message)s',
        },
        "rq_console": {
            "format": "%(asctime)s %(message)s",
            "datefmt": "%H:%M:%S",
        },
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        "rq_console": {
            "level": "DEBUG",
            "class": "rq.utils.ColorizingStreamHandler",
            "formatter": "rq_console",
            "exclude": ["%(asctime)s"],
        },
        'default': {
            'level': 'DEBUG',
            'class': 'blocktradedesk.lib.colorstreamhandler.ColorStreamHandler',
        },
        'console_dev': {
            'level': 'DEBUG',
            'filters': ['development_only'],
            'class': 'blocktradedesk.lib.colorstreamhandler.ColorStreamHandler',
            'formatter': 'simple',
        },
        'console_prod': {
            'level': 'INFO',
            'filters': ['production_only'],
            'class': 'blocktradedesk.lib.colorstreamhandler.ColorStreamHandler',
            'formatter': 'simple',
        },
        'file_log': {
            'level': 'DEBUG',
            'filters': ['development_only'],
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': join(DJANGO_ROOT, 'logs/log.log'),
            'maxBytes': 1024 * 1024,
            'backupCount': 3,
            'formatter': 'verbose',
        },
        'file_sql': {
            'level': 'DEBUG',
            'filters': ['development_only'],
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': join(DJANGO_ROOT, 'logs/sql.log'),
            'maxBytes': 1024 * 1024,
            'backupCount': 3,
            'formatter': 'verbose',
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['production_only'],
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
        },
    },
    # Catch-all modules that use logging
    # Writes to console and file on development, only to console on production
    'root': {
        'handlers': ['console_dev', 'console_prod', 'file_log'],
        'level': 'DEBUG',
    },
    'loggers': {
        # Email admins when 500 error occurs
        'django.request': {
            'handlers': ['mail_admins', 'console_dev'],
            'level': 'ERROR',
            'propagate': False,
        },
        'blocktradedesk': {
            'handlers': ['file_log'],
            'level': 'INFO',
            'propagate': False,
        },
        "rq.worker": {
            "handlers": ["rq_console"],
            "level": "DEBUG"
        },
    }
}

LOCALE_PATHS = (normpath(join(PROJECT_ROOT, 'locale')),)

# Dummy gettext function
gettext = lambda s: s

LANGUAGES = [
    ('fr', gettext('fr')),
    ('en', gettext('en')),

]

CACHE_ENGINES = {
    'redis': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'localhost:6379:0',
    },
    'dummy': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

CACHES = {
    'redis': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'localhost:6379:0',
    }
}

CACHES['default'] = CACHE_ENGINES[getenv('CACHE', 'dummy')]

########## REDIS QUEUE CONFIGURATION
# https://github.com/ui/django-rq#support-for-django-redis-and-django-redis-cache
RQ_QUEUES = {
    'default': {
        'USE_REDIS_CACHE': 'redis'
    },
    'high': {
        'USE_REDIS_CACHE': 'redis'
    },
    'low': {
        'USE_REDIS_CACHE': 'redis'
    }
}

RQ_SHOW_ADMIN_LINK = True
########## END REDIS QUEUE CONFIGURATION

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': int(os.getenv('DJANGO_PAGINATION_LIMIT', 10)),
    'DATETIME_FORMAT': '%Y-%m-%dT%H:%M:%S%z',
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    )
}

AUTH_USER_MODEL = 'users.UserAccount'

LOGIN_URL = 'rest_framework:login'
LOGOUT_URL = 'rest_framework:logout'
JSON_EDITOR = True
SHOW_REQUEST_HEADERS = True
CORS_ORIGIN_ALLOW_ALL=True
