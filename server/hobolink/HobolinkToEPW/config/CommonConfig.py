from datetime import datetime

### Date related common configurations ###
DATE_FORMAT = '%m-%d-%y:%H'

def str_dt_to_dt(str_dt):
    '''Converts CommonConfig.DATE_FORMAT to datetime object'''
    return datetime.strptime(str_dt, DATE_FORMAT)


def dt_to_str_dt(dt):
    '''Converts datetime object to CommonConfig.DATE_FORMAT'''
    return datetime.strftime(dt, DATE_FORMAT)


def date_cmp_fn(a, b):
    '''Comparator function for sorting on CommonConfig.date_format'''
    dt_a = str_dt_to_dt(a)
    dt_b = str_dt_to_dt(b)
    return dt_a > dt_b

### Handling converting values ###
UNIVERSAL_NULL_VALUE = None
