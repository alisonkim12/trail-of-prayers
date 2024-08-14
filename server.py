from flask import Flask, render_template, jsonify
import multiprocessing
import prayers

app = Flask(__name__)
queue = multiprocessing.Queue()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_text')
def get_elements():
    # Fetch elements from the global queue in tasks.py and return as JSON
    if not queue.empty():
        element = queue.get()
        return jsonify({'element': element})
    else:
        return jsonify({'element': None})

if __name__ == "__main__":
    # Create separate processes for generating and displaying strings
    generate_process = multiprocessing.Process(target=prayers.generate_sentences, args=(queue,prayers.copy_of_sentences, prayers.current_sentence))

    # Start both processes
    generate_process.start()

    # Start Flask app
    app.run(debug=True)
