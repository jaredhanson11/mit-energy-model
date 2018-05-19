"""
Converts IDFs in Shreshth Nagpal's (shreshth@mit.edu) workflow output form to
    .idf.template files. These .idf.template files can be used for creating
    multiple different idf's from a csv file for usage in simualating a single
    building's energy usage.
"""
import idf_utils
VAR_TEMPLATE = '&&%s&&'

def general_converter(name_to_template):
    def _converter(lines):
        converted_lines = []
        is_perim = idf_utils._get_zone_type(lines)
        for line in lines:
            converted_line = line
            value_name = idf_utils._get_value_name(line)
            if value_name in name_to_template:
                template_var_name = name_to_template[value_name]
                if type(template_var_name) == list:
                    if is_perim == 1:
                        converted_line = idf_utils.convert_value(line, VAR_TEMPLATE%template_var_name[1])
                    elif is_perim == 0:
                        converted_line = idf_utils.convert_value(line, VAR_TEMPLATE%template_var_name[0])
                elif type(name_to_template[idf_utils._get_value_name(line)]) == str:
                    converted_line = idf_utils.convert_value(line, VAR_TEMPLATE%template_var_name)
            converted_lines.append(converted_line)
        return converted_lines
    return _converter

def thermostat_converter(lines):
    if len(lines) != 1 or \
        ('heating_sp_sch' not in lines[0].lower() and 'cooling_sp_sch' not in lines[0].lower()):
        return lines
    else:
        split = lines[0].split(',')
        split[-1] = (VAR_TEMPLATE%'INP_THERM_STPT') + ';' + '\n'
        return [','.join(split)]

people_template = {
    'Number of People Schedule Name': 'INP_OCC_SCH',
    'People per Zone Floor Area': ['INP_OCC_DENS_C', 'INP_OCC_DENS_P']
}

elec_equip_template = {
    'Schedule Name': 'INP_EQP_SCH',
    'Watts per Zone Floor Area': ['INP_EQP_PWR_C', 'INP_EQP_PWR_P']
}

lights_template = {
    'Schedule Name': 'INP_LTG_SCH',
    'Watts per Zone Floor Area': ['INP_LTG_PWR_C', 'INP_LTG_PWR_P']
}

air_system_template = {
    'Outdoor Air Economizer Type': 'INP_ECON_TYPE',
    'Heat Recovery Type': 'INP_ERV_TYPE'
}

outdoor_air_template = {
    'Outdoor Air Flow per Person': ['INP_OA_PER_C', 'INP_OA_PER_P'],
    'Outdoor Air Schedule Name': ['INP_DCV_SCH_C', 'INP_DCV_SCH_P']
}

energy_management_template = {
    'Output:Variable or Output:Meter Index Key Name': ['INP_NV_SCH', 'INP_NV_SCH'] # Force the converter to check a zone is present
}

infiltration_template = {
    'Air Changes per Hour': 'INP_INF_ACH'
}

water_use_template = {
        'Peak Flow Rate': 'INP_DHW_FLOW'
}

objects_to_convert = {
    'PEOPLE': general_converter(people_template),
    'ELECTRICEQUIPMENT': general_converter(elec_equip_template),
    'LIGHTS': general_converter(lights_template),
    'ZONEHVAC:IDEALLOADSAIRSYSTEM': general_converter(air_system_template),
    'DESIGNSPECIFICATION:OUTDOORAIR': general_converter(outdoor_air_template),
    'ENERGYMANAGEMENTSYSTEM:SENSOR': general_converter(energy_management_template),
    'ZONEINFILTRATION:DESIGNFLOWRATE': general_converter(infiltration_template),
    'WATERUSE:EQUIPMENT': general_converter(water_use_template),
    'SCHEDULE:CONSTANT': thermostat_converter
}

def convert_idf(input_idf):
    idf_fh = open(input_idf, 'r')

    converted_lines = []
    lines = idf_fh.readlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if idf_utils._is_comment_or_whitespace(line):
            converted_lines.append(line)
            i += 1
        else:
            curr_object = idf_utils.get_object(lines[i:])
            offset = len(curr_object)
            object_name = idf_utils.object_name(curr_object)
            if object_name in objects_to_convert:
                converter = objects_to_convert[object_name]
                curr_object = converter(curr_object)

            i += offset
            converted_lines.extend(curr_object)
    idf_fh.close()
    idf_fh=open(input_idf + '.template', 'w')
    idf_fh.writelines(converted_lines)

