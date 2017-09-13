RESPONSE_HEADERS = {
        'Content-Type': 'application/json'
    }

def success(json_success_response, status_code=200):
    success_headers = {}.update(RESPONSE_HEADERS)
    success_response = {'success': True, 'content': json_success_response}
    return success_response, status_code, success_headers

def error(json_err_response, status_code=400):
    error_headers = {}.update(RESPONSE_HEADERS)
    error_response = {'success': False, 'content': json_err_response}
    return error_response, status_code, error_headers
