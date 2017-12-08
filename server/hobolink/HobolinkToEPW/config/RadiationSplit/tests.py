import datetime
from RadiationSplit import RadiationSplit

latitude, longitude = (42.358046, -71.092371)
dt = datetime.datetime(2017, 9, 25, 13)
solar_radiation = 623

rs = RadiationSplit(dt, solar_radiation, latitude, longitude)
print rs.split_radiation()
