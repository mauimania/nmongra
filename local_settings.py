## Graphite local_settings.py
# Edit this file to customize the default Graphite webapp settings
#
# Additional customizations to Django settings can be added to this file as well
import os
#####################################
# General Configuration #
#####################################
#
# Set this to a long, random unique string to use as a secret key for this
# install. This key is used for salting of hashes used in auth tokens,
# CRSF middleware, cookie storage, etc. This should be set identically among
# instances if used behind a load balancer.
#SECRET_KEY = 'UNSAFE_DEFAULT'

# In Django 1.5+ set this to the list of hosts your graphite instances is
# accessible as. See:
# https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-ALLOWED_HOSTS
ALLOWED_HOSTS = [host.strip() for host in os.environ.get('GRAPHITE_ALLOWED_HOSTS', "*").split(",")]

# Set your local timezone (Django's default is America/Chicago)
# If your graphs appear to be offset by a couple hours then this probably
# needs to be explicitly set to your local timezone.
TIME_ZONE = os.environ.get('GRAPHITE_TIME_ZONE', 'Etc/UTC')

# Set the default short date format. See strftime(3) for supported sequences.
DATE_FORMAT = os.environ.get('GRAPHITE_DATE_FORMAT', '%m/%d')

# Override this to provide documentation specific to your Graphite deployment
#DOCUMENTATION_URL = "http://graphite.readthedocs.io/"

# Logging
# These can also be configured using Django's LOGGING:
# https://docs.djangoproject.com/en/1.11/topics/logging/
LOG_ROTATION = os.environ.get("GRAPHITE_LOG_ROTATION", "false").lower() in ['1', 'true', 'yes']
LOG_ROTATION_COUNT = int(os.environ.get('GRAPHITE_LOG_ROTATION_COUNT', '1'))
LOG_RENDERING_PERFORMANCE = os.environ.get("GRAPHITE_LOG_RENDERING_PERFORMANCE", "true").lower() in ['1', 'true', 'yes']
LOG_CACHE_PERFORMANCE = os.environ.get("GRAPHITE_LOG_CACHE_PERFORMANCE", "true").lower() in ['1', 'true', 'yes']

# Filenames for log output, set to '-' to log to stderr
LOG_FILE_INFO = os.environ.get("GRAPHITE_LOG_FILE_INFO", 'info.log')
LOG_FILE_EXCEPTION = os.environ.get("GRAPHITE_LOG_FILE_EXCEPTION", 'exception.log')
LOG_FILE_CACHE = os.environ.get("GRAPHITE_LOG_FILE_CACHE", 'cache.log')
LOG_FILE_RENDERING = os.environ.get("GRAPHITE_LOG_FILE_RENDERING", 'rendering.log')

# Enable full debug page display on exceptions (Internal Server Error pages)
DEBUG = os.environ.get("GRAPHITE_DEBUG", "false").lower() in ['1', 'true', 'yes']

# If using RRD files and rrdcached, set to the address or socket of the daemon
#FLUSHRRDCACHED = 'unix:/var/run/rrdcached.sock'

# This lists the memcached servers that will be used by this webapp.
# If you have a cluster of webapps you should ensure all of them
# have the *exact* same value for this setting. That will maximize cache
# efficiency. Setting MEMCACHE_HOSTS to be empty will turn off use of
# memcached entirely.
#
# You should not use the loopback address (127.0.0.1) here if using clustering
# as every webapp in the cluster should use the exact same values to prevent
# unneeded cache misses. Set to [] to disable caching of images and fetched data
#MEMCACHE_HOSTS = ['10.10.10.10:11211', '10.10.10.11:11211', '10.10.10.12:11211']

# Metric data and graphs are cached for one minute by default. If defined,
# DEFAULT_CACHE_POLICY is a list of tuples of minimum query time ranges mapped
# to the cache duration for the results. This allows for larger queries to be
# cached for longer periods of times. All times are in seconds. If the policy is
# empty or undefined, all results will be cached for DEFAULT_CACHE_DURATION.
#DEFAULT_CACHE_DURATION = int(os.environ.get('GRAPHITE_DEFAULT_CACHE_DURATION', '60'))
DEFAULT_CACHE_DURATION = int(os.environ.get('GRAPHITE_DEFAULT_CACHE_DURATION', '180'))
#DEFAULT_CACHE_DURATION=180
#DEFAULT_CACHE_POLICY = [(0, 60), # default is 60 seconds
#                        (7200, 120), # >= 2 hour queries are cached 2 minutes
#                        (21600, 180)] # >= 6 hour queries are cached 3 minutes
#MEMCACHE_KEY_PREFIX = 'graphite'

# This lists the memcached options. Default is an empty dict.
# Accepted options depend on the Memcached implementation and the Django version.
# Until Django 1.10, options are used only for pylibmc.
# Starting from 1.11, options are used for both python-memcached and pylibmc.
#MEMCACHE_OPTIONS = { 'socket_timeout': 0.5 }

# this setting controls the default xFilesFactor used for query-time aggregration
DEFAULT_XFILES_FACTOR = 0

# Set URL_PREFIX when deploying graphite-web to a non-root location
URL_PREFIX = str(os.environ.get('GRAPHITE_URL_ROOT', ''))

# Graphite uses Django Tagging to support tags in Events. By default each
# tag is limited to 50 characters in length.
#MAX_TAG_LENGTH = 50

# Interval for the Auto-Refresh feature in the Composer, measured in seconds.
#AUTO_REFRESH_INTERVAL = 60

# Timeouts for find and render requests
#FIND_TIMEOUT = 3.0  # Timeout for metric find requests
#FETCH_TIMEOUT = 3.0  # Timeout to fetch series data
#FETCH_TIMEOUT = 300.0  # Timeout to fetch series data ###

# Allow UTF-8 metrics' names (can cause performance issues)
UTF8_METRICS = os.environ.get('GRAPHITE_UTF8_METRICS', 'false').lower() in ['1', 'true', 'yes']

#####################################
# Filesystem Paths #
#####################################
#
# Change only GRAPHITE_ROOT if your install is merely shifted from /opt/graphite
# to somewhere else
#GRAPHITE_ROOT = '/opt/graphite'

# Most installs done outside of a separate tree such as /opt/graphite will
# need to change these settings. Note that the default settings for each
# of these is relative to GRAPHITE_ROOT.
#CONF_DIR = '/opt/graphite/conf'
#STORAGE_DIR = '/opt/graphite/storage'
#STATIC_ROOT = '/opt/graphite/static'
#LOG_DIR = '/opt/graphite/storage/log/webapp'
#INDEX_FILE = '/opt/graphite/storage/index'     # Search index file

# To further or fully customize the paths, modify the following. Note that the
# default settings for each of these are relative to CONF_DIR and STORAGE_DIR
#
## Webapp config files
#DASHBOARD_CONF = '/opt/graphite/conf/dashboard.conf'
#GRAPHTEMPLATES_CONF = '/opt/graphite/conf/graphTemplates.conf'

## Data directories
#
# NOTE: If any directory is unreadable in STANDARD_DIRS it will break metric browsing
#
#CERES_DIR = '/opt/graphite/storage/ceres'
#WHISPER_DIR = '/opt/graphite/storage/whisper'
#RRD_DIR = '/opt/graphite/storage/rrd'
#
# Data directories using the "Standard" metrics finder (i.e. not Ceres)
#STANDARD_DIRS = [WHISPER_DIR, RRD_DIR] # Default: set from the above variables

## Data finders
# It is possible to use an alternate storage layer than the default, Whisper,
# in order to accommodate specific needs.
# See: http://graphite.readthedocs.io/en/latest/storage-backends.html
#
# STORAGE_FINDERS = (
#    'graphite.finders.remote.RemoteFinder',
#    'graphite.finders.standard.StandardFinder',
#    'graphite.finders.ceres.CeresFinder',
# )

#####################################
# Email Configuration #
#####################################
#
# This is used for emailing rendered graphs. The default backend is SMTP.
#EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
#
# To drop emails on the floor, enable the Dummy backend instead.
#EMAIL_BACKEND = 'django.core.mail.backends.dummy.EmailBackend'

#EMAIL_HOST = 'localhost'
#EMAIL_PORT = 25
#EMAIL_HOST_USER = ''
#EMAIL_HOST_PASSWORD = ''
#EMAIL_USE_TLS = False


#####################################
# Authentication Configuration #
#####################################
#
## LDAP / ActiveDirectory authentication setup
#USE_LDAP_AUTH = True
#LDAP_SERVER = "ldap.mycompany.com"
#LDAP_PORT = 389
#LDAP_USE_TLS = False

## Manual URI / query setup
#LDAP_URI = "ldaps://ldap.mycompany.com:636"
#LDAP_SEARCH_BASE = "OU=users,DC=mycompany,DC=com"
#LDAP_BASE_USER = "CN=some_readonly_account,DC=mycompany,DC=com"
#LDAP_BASE_PASS = "readonly_account_password"
#LDAP_USER_QUERY = "(username=%s)"  #For Active Directory use "(sAMAccountName=%s)"

# User DN template to use for binding (and authentication) against the
# LDAP server. %(username) is replaced with the username supplied at
# graphite login.
#LDAP_USER_DN_TEMPLATE = "CN=%(username)s,OU=users,DC=mycompany,DC=com"

# If you want to further customize the ldap connection options you should
# directly use ldap.set_option to set the ldap module's global options.
# For example:
#
#import ldap
#ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_ALLOW) # Use ldap.OPT_X_TLS_DEMAND to force TLS
#ldap.set_option(ldap.OPT_REFERRALS, 0) # Enable for Active Directory
#ldap.set_option(ldap.OPT_X_TLS_CACERTDIR, "/etc/ssl/ca")
#ldap.set_option(ldap.OPT_X_TLS_CERTFILE, "/etc/ssl/mycert.pem")
#ldap.set_option(ldap.OPT_X_TLS_KEYFILE, "/etc/ssl/mykey.pem")
#ldap.set_option(ldap.OPT_DEBUG_LEVEL, 65535) # To enable verbose debugging
# See http://www.python-ldap.org/ for further details on these options.

## REMOTE_USER authentication. See: https://docs.djangoproject.com/en/dev/howto/auth-remote-user/
#USE_REMOTE_USER_AUTHENTICATION = True

# Override the URL for the login link (e.g. for django_openid_auth)
#LOGIN_URL = '/account/login'


###############################
# Authorization for Dashboard #
###############################
# By default, there is no security on dashboards - any user can add, change or delete them.
# This section provides 3 different authorization models, of varying strictness.

# If set to True, users must be logged in to save or delete dashboards. Defaults to False
#DASHBOARD_REQUIRE_AUTHENTICATION = True

# If set to the name of a user group, dashboards can be saved and deleted by any user in this
# group.  Groups can be set in the Django Admin app, or in LDAP.  Defaults to None.
# NOTE: Ignored if DASHBOARD_REQUIRE_AUTHENTICATION is not set
#DASHBOARD_REQUIRE_EDIT_GROUP = 'dashboard-editors-group'

# If set to True, dashboards can be saved or deleted by any user having the appropriate
# (change or delete) permission (as set in the Django Admin app).  Defaults to False
# NOTE: Ignored if DASHBOARD_REQUIRE_AUTHENTICATION is not set
#DASHBOARD_REQUIRE_PERMISSIONS = True


##########################
# Database Configuration #
##########################
#
# By default sqlite is used. If you cluster multiple webapps you will need
# to setup an external database (such as MySQL) and configure all of the webapp
# instances to use the same database. Note that this database is only used to store
# Django models such as saved graphs, dashboards, user preferences, etc.
# Metric data is not stored here.
#
# DO NOT FORGET TO RUN MIGRATIONS AFTER SETTING UP A NEW DATABASE
# http://graphite.readthedocs.io/en/latest/config-database-setup.html
#
#
# The following built-in database engines are available:
#  django.db.backends.postgresql_psycopg2
#  django.db.backends.mysql
#  django.db.backends.sqlite3
#  django.db.backends.oracle
#
# The default is 'django.db.backends.sqlite3' with file 'graphite.db'
# located in STORAGE_DIR
#
#DATABASES = {
#    'default': {
#        'NAME': '/opt/graphite/storage/graphite.db',
#        'ENGINE': 'django.db.backends.sqlite3',
#        'USER': '',
#        'PASSWORD': '',
#        'HOST': '',
#        'PORT': ''
#    }
#}
#


#########################
# Cluster Configuration #
#########################
#
# To avoid excessive DNS lookups you want to stick to using IP addresses only
# in this entire section.
#

# This should list the IP address (and optionally port) of the webapp on each
# remote server in the cluster. These servers must each have local access to
# metric data. Note that the first server to return a match for a query will be
# used.
#CLUSTER_SERVERS = ["10.0.2.2:80", "10.0.2.3:80"]
CLUSTER_SERVERS = [x for x in [host.strip() for host in os.environ.get('GRAPHITE_CLUSTER_SERVERS', '').split(",")] if x]

# Creates a pool of worker threads to which tasks can be dispatched. This makes
# sense if there are multiple CLUSTER_SERVERS because then the communication
# with them can be parallelized
# The number of threads is equal to:
#   POOL_WORKERS_PER_BACKEND * len(CLUSTER_SERVERS) + POOL_WORKERS
# Be careful when increasing the number of threads, in particular if your start
# multiple graphite-web processes (with uwsgi or similar) as this will increase
# memory consumption (and number of connections to memcached).
USE_WORKER_POOL = os.environ.get("GRAPHITE_USE_WORKER_POOL", "true").lower() in ['1', 'true', 'yes']

# The number of worker threads that should be created per backend server.
# It makes sense to have more than one thread per backend server if
# the graphite-web web server itself is multi threaded and can handle multiple
# incoming requests at once.
POOL_WORKERS_PER_BACKEND = int(os.environ.get('GRAPHITE_POOL_WORKERS_PER_BACKEND', '8'))

# A baseline number of workers that should always be created, no matter how many
# cluster servers are configured. These are used for other tasks that can be
# off-loaded from the request handling threads.
POOL_WORKERS = int(os.environ.get('GRAPHITE_POOL_WORKERS', '1'))

# Maximum number of worker threads for concurrent storage operations
#POOL_MAX_WORKERS = 10

# This setting controls whether https is used to communicate between cluster members
#INTRACLUSTER_HTTPS = False

# These are timeout values (in seconds) for requests to remote webapps
REMOTE_FIND_TIMEOUT = float(os.environ.get('GRAPHITE_REMOTE_FIND_TIMEOUT', '30'))    # Timeout for metric find requests
REMOTE_FETCH_TIMEOUT = float(os.environ.get('GRAPHITE_REMOTE_FETCH_TIMEOUT', '60'))  # Timeout to fetch series data
#REMOTE_FETCH_TIMEOUT = float(os.environ.get('GRAPHITE_REMOTE_FETCH_TIMEOUT', '240'))  # Timeout to fetch series data ###
REMOTE_RETRY_DELAY = float(os.environ.get('GRAPHITE_REMOTE_RETRY_DELAY', '0'))       # Time before retrying a failed remote webapp

# Fail all requests if any remote webapp call fails
#STORE_FAIL_ON_ERROR = False

# Try to detect when a cluster server is localhost and don't forward queries
REMOTE_EXCLUDE_LOCAL = False

# Number of retries for a specific remote data fetch.
MAX_FETCH_RETRIES = int(os.environ.get('GRAPHITE_MAX_FETCH_RETRIES', '2'))

FIND_CACHE_DURATION = int(os.environ.get('GRAPHITE_FIND_CACHE_DURATION', '1')) # Time to cache remote metric find results
# If the query doesn't fall entirely within the FIND_TOLERANCE window
# we disregard the window. This prevents unnecessary remote fetches
# caused when carbon's cache skews node.intervals, giving the appearance
# remote systems have data we don't have locally, which we probably do.
#FIND_TOLERANCE = 2 * FIND_CACHE_DURATION

#REMOTE_STORE_USE_POST = False    # Use POST instead of GET for remote requests

# Size of the buffer used for streaming remote cluster responses. Set to 0 to avoid streaming deserialization.
REMOTE_BUFFER_SIZE = int(os.environ.get('GRAPHITE_REMOTE_BUFFER_SIZE', '1048576'))

# During a rebalance of a consistent hash cluster, after a partition event on a replication > 1 cluster,
# or in other cases we might receive multiple TimeSeries data for a metric key.  Merge them together rather
# that choosing the "most complete" one (pre-0.9.14 behaviour).
#REMOTE_STORE_MERGE_RESULTS = True

# Provide a list of HTTP headers that you want forwarded on from this host
# when making a request to a remote webapp server in CLUSTER_SERVERS
#REMOTE_STORE_FORWARD_HEADERS = [] # An iterable of HTTP header names

## Prefetch cache
# set to True to fetch all metrics using a single http request per remote server
# instead of one http request per target, per remote server.
# Especially useful when generating graphs with more than 4-5 targets or if
# there's significant latency between this server and the backends.
REMOTE_PREFETCH_DATA = os.environ.get("GRAPHITE_REMOTE_PREFETCH_DATA", "false").lower() in ['1', 'true', 'yes']

## Remote rendering settings
# Set to True to enable rendering of Graphs on a remote webapp
#REMOTE_RENDERING = True
# List of IP (and optionally port) of the webapp on each remote server that
# will be used for rendering. Note that each rendering host should have local
# access to metric data or should have CLUSTER_SERVERS configured
#RENDERING_HOSTS = []
#REMOTE_RENDER_CONNECT_TIMEOUT = 1.0

# If you are running multiple carbon-caches on this machine (typically behind
# a relay using consistent hashing), you'll need to list the ip address, cache
# query port, and instance name of each carbon-cache instance on the local
# machine (NOT every carbon-cache in the entire cluster). The default cache
# query port is 7002 and a common scheme is to use 7102 for instance b, 7202
# for instance c, etc.
# If you're using consistent hashing, please keep an order of hosts the same as
# order of DESTINATIONS in your relay - otherways you'll get cache misses.
#
# You *should* use 127.0.0.1 here in most cases.
#
#CARBONLINK_HOSTS = ["127.0.0.1:7002:a", "127.0.0.1:7102:b", "127.0.0.1:7202:c"]
CARBONLINK_HOSTS = [host.strip() for host in os.environ.get('GRAPHITE_CARBONLINK_HOSTS', "127.0.0.1:7002").split(",")]

CARBONLINK_TIMEOUT = float(os.environ.get('GRAPHITE_CARBONLINK_TIMEOUT', '1'))
#CARBONLINK_RETRY_DELAY = 15 # Seconds to blacklist a failed remote server
#

# Type of metric hashing function.
# The default `carbon_ch` is Graphite's traditional consistent-hashing implementation.
# Alternatively, you can use `fnv1a_ch`, which supports the Fowler-Noll-Vo hash
# function (FNV-1a) hash implementation offered by the carbon-c-relay project
# https://github.com/grobian/carbon-c-relay
#
# Supported values: carbon_ch, fnv1a_ch
#
CARBONLINK_HASHING_TYPE = os.environ.get("GRAPHITE_CARBONLINK_HASHING_TYPE", 'carbon_ch')

# A "keyfunc" is a user-defined python function that is given a metric name
# and returns a string that should be used when hashing the metric name.
# This is important when your hashing has to respect certain metric groupings.
#CARBONLINK_HASHING_KEYFUNC = "/opt/graphite/bin/keyfuncs.py:my_keyfunc"

# Prefix for internal carbon statistics.
#CARBON_METRIC_PREFIX='carbon'

# The replication factor to use with consistent hashing.
# This should usually match the value configured in Carbon.
REPLICATION_FACTOR = int(os.environ.get('GRAPHITE_REPLICATION_FACTOR', '1'))

#####################################
# TagDB Settings #
#####################################
# Tag Database

# set TAGDB to Redis if REDIS_TAGDB env var is set
_REDIS_TAGDB = os.environ.get('REDIS_TAGDB', 'false').lower() in ['1', 'true', 'yes']

# default TAGDB is local database. Set to '' to disable
TAGDB = 'graphite.tags.redis.RedisTagDB' if _REDIS_TAGDB else \
    os.environ.get('GRAPHITE_TAGDB', 'graphite.tags.localdatabase.LocalDatabaseTagDB')

# Time to cache seriesByTag results
TAGDB_CACHE_DURATION = int(os.environ.get('GRAPHITE_TAGDB_CACHE_DURATION') or 60)

# Autocomplete default result limit
TAGDB_AUTOCOMPLETE_LIMIT = int(os.environ.get('GRAPHITE_TAGDB_AUTOCOMPLETE_LIMIT') or 100)

# Settings for Redis TagDB
TAGDB_REDIS_HOST = os.environ.get('GRAPHITE_TAGDB_REDIS_HOST', 'localhost')
TAGDB_REDIS_PORT = int(os.environ.get('GRAPHITE_TAGDB_REDIS_PORT') or 6379)
TAGDB_REDIS_DB = int(os.environ.get('GRAPHITE_TAGDB_REDIS_DB') or 0)

# Settings for HTTP TagDB
TAGDB_HTTP_URL = os.environ.get('GRAPHITE_TAGDB_HTTP_URL', '')
TAGDB_HTTP_USER = os.environ.get('GRAPHITE_TAGDB_HTTP_USER', '')
TAGDB_HTTP_PASSWORD = os.environ.get('GRAPHITE_TAGDB_HTTP_PASSWORD', '')
# Does the remote TagDB support autocomplete?
TAGDB_HTTP_AUTOCOMPLETE = os.environ.get('GRAPHITE_TAGDB_HTTP_AUTOCOMPLETE', 'false').lower() in ['1', 'true', 'yes']

#####################################################
# Maximum number of legends when hideLegend is unset
#####################################################
LEGEND_MAX_ITEMS = 80
#####################################
# Function plugins #
#####################################
# List of custom function plugin modules
# See: http://graphite.readthedocs.io/en/latest/functions.html#function-plugins
FUNCTION_PLUGINS = []

#####################################
# Additional Django Settings #
#####################################

LOG_DIR = '/var/log/graphite'
_SECRET_KEY = '$(date +%s | sha256sum | base64 | head -c 64)'
SECRET_KEY = os.environ.get('GRAPHITE_SECRET_KEY', _SECRET_KEY)

if (os.getenv("MEMCACHE_HOST") is not None):
    MEMCACHE_HOSTS = os.getenv("MEMCACHE_HOST").split(",")

if (os.getenv("DEFAULT_CACHE_DURATION") is not None):
    DEFAULT_CACHE_DURATION = int(os.getenv("CACHE_DURATION"))

STATSD_HOST = os.environ.get('GRAPHITE_STATSD_HOST', '127.0.0.1')
if STATSD_HOST != '':
    from graphite.app_settings import *
    MIDDLEWARE = (
        'django_statsd.middleware.GraphiteRequestTimingMiddleware',
        'django_statsd.middleware.GraphiteMiddleware',
        ) + MIDDLEWARE
    try:
        MIDDLEWARE_CLASSES
    except NameError:
        pass
    else:
        MIDDLEWARE_CLASSES = MIDDLEWARE
