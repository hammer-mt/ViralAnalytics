from google.cloud import firestore

def parse_var(var, request):
    request_json = request.get_json(silent=True)
    request_args = request.args

    if request_json and var in request_json:
        return request_json[var]
    elif request_args and var in request_args:
        return request_args[var]
    else:
        return ""

def make_viraldata(request):
    viraldata = {}
    for var in request:
        print(var)
        value = parse_var(var, request)
        print(value)
        viraldata[var] = value

    return viraldata
    
def save_viraldata(viraldata):
    db = firestore.Client()

    property_id = viraldata.get('property')
    property_ref = db.collection(u'{}'.format(property_id))
    property_ref.set(viraldata)


def main(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
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

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    
    # Parse the data from the request
    user_hash = parse_var('userHash', request)
    print(user_hash)

    # Make the viral data dictionary
    viraldata = make_viraldata(request)

    # Save the viral data dictionary
    save_viraldata(viraldata)

    # Return a 200 status
    return ("logged", 200, headers)

    
    