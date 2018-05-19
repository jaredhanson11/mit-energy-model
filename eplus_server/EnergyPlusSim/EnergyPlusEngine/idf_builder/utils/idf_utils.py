
def convert_value(line, template_var):
    start_val = -1
    start_comment = 0
    last_line = False
    ret = []
    for i, char in enumerate(line):
        if char != ' ' and start_val == -1:
            start_val = i
        if char == '!':
            start_comment = i
        if char == ';':
            last_line = True
    if len(line.split('!-')) > 1:
        for i in range(start_val):
            ret.append(' ')
        for c in template_var:
            ret.append(c)
        if last_line:
            ret.append(';')
        else:
            ret.append(',')
        for i in range(len(ret), start_comment):
            ret.append(' ')
        return ''.join(ret) + '!-' + line.split('!-', 1)[1]

def _get_value(line):
    if _get_value_name(line):
        return line.split(',', 1)[0].strip()

def _get_value_name(line):
    if len(line.split('!-')) > 1:
        val_raw = line.split('!-')[1].strip()
        if len(val_raw.split('{', 1)) > 1:
            return val_raw.split('{', 1)[0].strip()
        return val_raw
    return ''

def _get_zone_type(lines):
    '''
    1 for perim, 0 for core, -1 for undefined
    '''
    for line in lines:
        if _get_value_name(line).lower() == 'name':
            if 'perim' in _get_value(line).lower():
                return 1
            elif 'core' in _get_value(line).lower():
                return 0
            else:
                return -1

def get_object(next_lines):
    lines = []
    for line in next_lines:
        lines.append(line)
        if ';' in line:
            break
    return lines

def object_name(obj):
    return obj[0].split(',', 1)[0].strip().upper()

def _is_comment_or_whitespace(line):
    return line.strip().startswith('!') or line.strip() == ''
