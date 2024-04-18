from flask import Flask, jsonify, redirect, request
from pymongo import MongoClient
from datetime import datetime
from flask_cors import CORS
from bson.json_util import dumps
from datetime import datetime
from spotipy import oauth2, Spotify

app = Flask(__name__)
CORS(app)

# Initialize MongoDB client and connect to the database
client = MongoClient('mongodb+srv://admin:admin@database.r0vy6ca.mongodb.net/')
db = client['tpe']

def get_audio_features(track_id):
    audio_features = sp.audio_features(tracks=[track_id])
    if audio_features:
        track_features = audio_features[0]
        valence = track_features['valence']
        energy = track_features['energy']
        return valence, energy
    else:
        return None, None

app = Flask(__name__)
CORS(app) 

app.secret_key = 'your_secret_key'

# Spotify API credentials
CLIENT_ID = 'd4de6894fc7f4fdc86716e8f84ad19df'
CLIENT_SECRET = 'e877a071b150405a828758d796ab1ada'
# CLIENT_ID = '403ad84743764e23a37a940624c42395'
# CLIENT_SECRET = '202803b9bbd3464c806fdf2395aa7c0c'
REDIRECT_URI = 'http://localhost:5000/callback'  # Update with your redirect URI

# Define Spotify OAuth scope
SCOPE = 'user-read-recently-played'

# Initialize Spotipy OAuth2 object
sp_oauth = oauth2.SpotifyOAuth(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, scope=SCOPE)

# Initialize Spotipy object globally
sp = None

@app.route('/api/mood', methods=['POST'])
def receive_mood():
    if request.method == 'POST':
        content = request.json
        user = content.get('user')
        mood = content.get('mood')
        date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Find the document for the user
        user_doc = db.mood.find_one({'user': user})

        if user_doc:
            # If user document exists, append mood to the existing array
            mood_data = {
                'mood': mood,
                'date': date
            }
            db.mood.update_one({'user': user}, {'$push': {'mood_history': mood_data}})
        else:
            # If user document doesn't exist, create a new one
            mood_data = {
                'user': user,
                'mood_history': [{
                    'mood': mood,
                    'date': date
                }]
            }
            db.mood.insert_one(mood_data)

        return jsonify({'success': True}), 200
    else:
        return jsonify({'success': False, 'error': 'Invalid method'}), 405

@app.route('/api/chat_history', methods=['POST'])
def receive_chat_history():
    if request.method == 'POST':
        content = request.json
        user = content.get('user')
        sender = content.get('sender')
        message = content.get('message')
        date = datetime.utcnow()

        user_chat = db.chat_history.find_one({'user': user})
        if user_chat:
            chat = user_chat['chat']
        else:
            chat = []

        chat.append({'sender': sender, 'message': message, 'date': date})
        
        # Update or insert chat history
        db.chat_history.update_one({'user': user}, {'$set': {'chat': chat}}, upsert=True)

        return jsonify({'success': True}), 200
    else:
        return jsonify({'success': False, 'error': 'Invalid method'}), 405


@app.route('/api/predictions', methods=['POST'])
def receive_predictions():
    if request.method == 'POST':
        content = request.json
        user = request.args.get('user')
        predictions = content.get('predictions')
        date = datetime.utcnow()

        # Store predictions in MongoDB
        for prediction in predictions:
            prediction_data = {
                'user': user,
                'prediction': prediction,
                'date': date
            }
            db.predictions.insert_one(prediction_data)

        return jsonify({'success': True}), 200
    else:
        return jsonify({'success': False, 'error': 'Invalid method'}), 405

@app.route('/api/patients', methods=['GET'])
def get_patients():
    patients = list(db.patients.find({}, {'_id': 0}))
    return jsonify(patients)

@app.route('/api/mood_history', methods=['GET'])
def get_mood_history():
    user = request.args.get('user')
    mood_history = list(db.mood.find({'user': user}, {'_id': 0, 'user': 0}))
    return jsonify(mood_history)

@app.route('/api/chat_history', methods=['GET'])
def get_chat_history():
    user = request.args.get('user')

    # Retrieve chat history from MongoDB
    chat_history = list(db.chat_history.find({'user': user}, {'_id': 0}))
    
    return jsonify(chat_history)

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    user = request.args.get('user')

    # Retrieve predictions from MongoDB
    predictions = list(db.predictions.find({'user': user}, {'_id': 0}))
    
    return jsonify(predictions)

@app.route('/callback')
def callback():
    global sp
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    access_token = token_info['access_token']
    sp = Spotify(auth=access_token, requests_timeout=50)
    return redirect("/api/get_spotify")

@app.route('/api/get_spotify', methods=['GET'])
def get_spotify_info():
    results = sp.current_user_recently_played()
    tracks = [item['track']['name'] for item in results['items']]
        
    # Define sliding window parameters
    window_size = 20
    window_jump = 10

    # Initialize mood progression
    mood_progression = []

    # Process sliding windows
    for i in range(0, len(tracks), window_jump):
        window_tracks = tracks[i:i+window_size]
        valences = []
        energies = []
        for track_name in window_tracks:
            track_info = sp.search(q=track_name, type='track')
            if track_info and track_info['tracks']['items']:
                track_id = track_info['tracks']['items'][0]['id']
                print(f"Processing track: {track_name} ({track_id})")  # Print track being processed
                valence, energy = get_audio_features(track_id)
                if valence is not None and energy is not None:
                    valences.append(valence)
                    energies.append(energy)

        # Calculate average valence and arousal for the window
        if valences and energies:
            avg_valence = sum(valences) / len(valences)
            avg_energy = sum(energies) / len(energies)

            # Determine mood based on average valence and arousal
            if avg_valence > 0.5:
                mood = "calm" if avg_energy < 0.5 else "happy"
            else:
                mood = "anxious" if avg_energy < 0.5 else "sad"
        else:
            mood = "unknown"  # Mood cannot be determined

        mood_progression.append(mood)

    # Construct mood progression message
    mood_message = "<br>".join([f"Window {i+1}: {mood}" for i, mood in enumerate(mood_progression)])
    print(mood_message)
    return jsonify({'mood_message': mood_message})

@app.route('/api/spotify/authorize', methods=['GET'])
def authorize_spotify():
    auth_url = sp_oauth.get_authorize_url()
    print(auth_url)
    sp = Spotify(auth=sp_oauth.get_access_token())
    return jsonify({'auth_url': auth_url})

if __name__ == '__main__':
    app.run(debug=True)