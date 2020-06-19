def main(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    request_json = request.get_json()
    if request.args and 'message' in request.args:
        print(request.args.get('message'))
    elif request_json and 'message' in request_json:
        print(request_json['message'])
    else:
        print(f'No error messages')


    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # Return a 200 status
    return ("", 200, headers)