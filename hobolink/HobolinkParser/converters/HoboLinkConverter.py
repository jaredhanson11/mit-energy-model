import pandas as pd
from datetime import datetime

import ConverterConfig

class HoboLinkConverter:

    def __init__(self, data_type, input_values, datetime_values):
        self.data_type = data_type
        self.input_values = input_values
        self.datetime_values = datetime_values

    def convert(self):
        pass

    def get_epw_column(self, data_type=None):
      # go to a map that takes datatype and maps to index of epw header
      # datatype : epw_column (if string)
      # else if list, run converters again and try to get index again
      if data_type == None:
          data_type = self.data_type
      return ConverterConfig.get_epw_column(data_type)
