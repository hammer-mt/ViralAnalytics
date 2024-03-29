def main(request):
    """
    For testing input
    {"property": "lad-000000003-001", "refHash": "#e0yxeeaf596p8p1tvskqr"}
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

    def parse_var(var, request):
        request_json = request.get_json(silent=True)
        request_args = request.args

        if request_json and var in request_json:
            return request_json[var]
        elif request_args and var in request_args:
            return request_args[var]
        else:
            return None

    prop_id = parse_var("property", request)
    refHash = parse_var("refHash", request)

    import firebase_admin
    from firebase_admin import firestore
    from firebase_admin import credentials

    if (not len(firebase_admin._apps)):
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)

    db = firestore.client()

    leaderboards_ref = db.collection(u'leaderboards')
    property_ref = leaderboards_ref.document(u'{}'.format(prop_id))

    leader_board = property_ref.get().to_dict()

    place = leader_board[refHash]

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # Return a 200 status
    return (str(place), 200, headers)