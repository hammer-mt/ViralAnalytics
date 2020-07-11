def main(data, context):
    import firebase_admin
    from firebase_admin import firestore
    from firebase_admin import credentials

    if (not len(firebase_admin._apps)):
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    
    from collections import defaultdict
    import re 

    properties_to_run = ['lad-000000003-001', 'ham-777777777-003']

    def generate_leaderboard(property, db):
        print("running property {}".format(property))
        posts_ref = db.collection(u'posts')

        query = posts_ref.where(u'property', u'==', u'{}'.format(property))

        results = query.stream()

        records = defaultdict() # use defaultdict so you can append to a list in a key
        for doc in results:
            user_hash = doc.to_dict().get('userHash')
            ref_hash = doc.to_dict().get('refHash')

            # check if the ref_hash is valid
            valid_ref_hash = re.search("^#\w{18}", ref_hash) 

            # generates a dict of all the users someone referred
            if user_hash and valid_ref_hash:
                if ref_hash in records:
                    records[ref_hash].append(user_hash)
                else:
                    records[ref_hash] = [user_hash]

        # make the dict a count of the unique users they referred
        leader_board_unsort = {}
        for ref_hash, user_hashes in records.items():
            print(len(set(user_hashes)))
            leader_board_unsort[ref_hash] = len(set(user_hashes))

        # sort the dict by number of users referred
        leader_board_sort = sorted(leader_board_unsort.items(), key=lambda x: x[1], reverse=True)

        print(leader_board_sort)

        # create a dict to look up the place of the user in order
        leader_board_place = {}
        place_counter = 0
        last_share_count = -1
        for item in leader_board_sort:
            share_count = item[1]
            # if you have the same share count as the last user, you're in the same place
            if not share_count == last_share_count:
                place_counter += 1
                last_share_count = share_count
            
            leader_board_place[item[0]] = place_counter

        return leader_board_place

    def save_leaderboard(leader_board_place, property, db):
        leaderboards_ref = db.collection(u'leaderboards')
        property_ref = leaderboards_ref.document(u'{}'.format(property))
        return property_ref.set(leader_board_place)

    for property in properties_to_run:
        leader_board_place = generate_leaderboard(property, db)
        print(leader_board_place)
        print(save_leaderboard(leader_board_place, property, db))