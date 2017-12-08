from config import CommonConfig, EPWConfig
from config.EPWModels import EPWModel

class EPWInterface:

    @staticmethod
    def update_epw_db(hobolink_data):
        '''
        Input:
            hobolink_data (dict) - hobolink data split by hour
        '''
        sorted_hours = sorted(hobolink_data.keys(), cmp=CommonConfig.date_cmp_fn)
        for hour in sorted_hours:
            hobolink_hour_data = hobolink_data[hour]
            epw_record_data = EPWInterface.convert_hour_to_epw(hobolink_hour_data)
            epw_record = EPWModel.exists(**epw_record_data)
            if epw_record:
                if epw_record.update_record(**epw_record_data):
                    print 'Updated record ' + hour
            else:
                if EPWModel.create_record(**epw_record_data):
                    print 'Created record ' + hour

    @staticmethod
    def convert_hour_to_epw(hour_data):
        '''
        Gets epw data from an hour of hobolink data.

        Inputs:
            hour_data(list) - [{hourdata},...]
        Returns:
            {epw_data}
        '''
        epw_data = {}
        converters = EPWConfig.get_hobolink_converters()
        for converter in converters:
            epw_data.update(converter.convert(hour_data))
        return epw_data
