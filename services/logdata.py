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

# example request payload for testing
# {"property":"abc-123456789-001","userHash":"90ek2bljzbnicx5skuvwu","refHash":"#90ek2bljzbnicx5skuvwu","href":"https://try.ladder.io/?utm_expid=.OShV8i84QBebyz05Qhs27g.1&utm_referrer=#90ek2bljzbnicx5skuvwu","referrer":"","title":"Award-Winning Marketing Agency: Growth, Scale, & ROI - Ladder","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0","doNotTrack":"unspecified","cookieEnabled":true,"height":1080,"width":1920,"colorDepth":24,"timeZone":"Europe/London","locale":"en-GB","timeZoneOffset":-60}

def make_viraldata(request):
    viraldata = {}
    var_list = ['property', 'userHash', 'refHash', 'href', 'referrer', 'title',
                'userAgent', 'doNotTrack', 'cookieEnabled', 'height', 'width',
                'colorDepth', 'timeZone', 'locale', 'timeZoneOffset']

    for var in var_list:
        value = parse_var(var, request)
        viraldata[var] = value

    return viraldata

def save_viraldata(viraldata):
    db = firestore.Client()

    post_ref = db.collection(u'posts').document()
    post_ref.set(viraldata)


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

    # Make the viral data dictionary
    viraldata = make_viraldata(request)
    print(viraldata)

    # Save the viral data dictionary
    save_viraldata(viraldata)

    # Return a 200 status
    return ("logged", 200, headers)