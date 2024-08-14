import reading_text
reading_text.main()

import numpy as np
import csv
import sys
# from gensim.models import KeyedVectors
from sklearn.metrics.pairwise import cosine_similarity
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.decomposition import PCA
# from sklearn.preprocessing import StandardScaler
from datasketch import MinHashLSH
from datasketch import MinHash
import umap.umap_ as umap
# import matplotlib.pyplot as plt
# import multiprocessing
# import time
from queue import Empty  # Import Empty exception from the queue module
import nltk
from nltk.corpus import stopwords
import json
# nltk.download('stopwords')
csv.field_size_limit(sys.maxsize)
prayerData = []
title_and_author_array = []

with open('processed_writing_data.csv', mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        prayer_line = row['prayer-line']
        title_and_author_array.append({'writing-source-title': row['writing-source-title'], 'writer-name': row['writer-name']})
        prayerData.append(prayer_line)

# Load GloVe embeddings
def load_glove_embeddings(file_path):
    # word_to_vec = KeyedVectors.load_word2vec_format(file_path, binary=False)
    # return word_to_vec
    word_to_vec = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            values = line.split()
            word = values[0]
            vec = np.asarray(values[1:], dtype='float32')
            assert len(vec) == 300
            word_to_vec[word] = vec
    return word_to_vec

glove_embeddings = load_glove_embeddings('src/glove.6B.300d.txt')

# Function to calculate sentence embeddings
def sentence_embedding(sentence):
    words = sentence.lower().split()
    embedding = []
    for word in words:
        if word in glove_embeddings:
            embedding.append(glove_embeddings[word])
    if not embedding:
        return None
    embedding = np.array(embedding)
    return np.mean(embedding, axis=0)

def preprocess(sentence):
    # Tokenize the sentence
    stop_words = set(stopwords.words('english'))
    stop_words.update(['thy','thou','hast','thee'])
    words = nltk.word_tokenize(sentence)
    # Filter out stop words
    filtered_words = [word for word in words if word.lower() not in stop_words]
    # Join the filtered words back into a sentence
    return ' '.join(filtered_words)

# Function to find the most similar sentence using LSH
def find_most_similar(sentence, candidates, lsh, minhash_objects):
    sentence = preprocess(sentence)
    sentence_emb = sentence_embedding(sentence)
    if sentence_emb is None:
        return None
    minhash = MinHash(num_perm=128)
    minhash.update(sentence_emb)
    result = []
    for mh in minhash_objects:
        query = minhash.digest()
        similarity = lsh.query(mh)
        result.extend(similarity)
    if len(result) == 0:
        return None
    max_similarity = -1
    most_similar_sentence = ""
    visited_indices = set()  # Keep track of visited indices to avoid duplicates

    for idx in result:
        if idx < len(candidates) and idx not in visited_indices:
            candidate = candidates[idx]
            candidate_emb = sentence_embedding(candidate)
            if candidate_emb is None:
                continue
            actual_similarity = cosine_similarity([sentence_emb], [candidate_emb])[0][0]
            if actual_similarity > max_similarity:
                max_similarity = actual_similarity
                most_similar_sentence = candidate
            visited_indices.add(idx)
    return most_similar_sentence


# Select a random starting sentence
copy_of_sentences = prayerData
current_sentence = np.random.choice(copy_of_sentences)
copy_of_sentences.remove(current_sentence)

# Prepare data for LSH
minhash_objects = []
for sentence in prayerData:
    emb = sentence_embedding(sentence)
    if emb is not None:
        mh = MinHash(num_perm=128)  # Specify num_perm=128 for MinHash
        mh.update(emb)
        minhash_objects.append(mh)

# Configure LSH
lsh = MinHashLSH(threshold=0.5, num_perm=128)
for i, emb in enumerate(minhash_objects):
    lsh.insert(i, emb)

def generate_sentences(queue, copy_of_sentences, current_sentence):
    sentence_morphing_order = []
    sentence_morphing_order.append(current_sentence)
    visited_sentences = {current_sentence}
    og = len(copy_of_sentences)
    batch_size = 100
    while len(visited_sentences) < og:
        candidates = []
        remaining_sentences = [sentence for sentence in copy_of_sentences if sentence not in visited_sentences]  # Remove visited sentences from copy_of_sentences
        for _ in range(min(batch_size, len(remaining_sentences))):
            if remaining_sentences: 
                candidates.append(remaining_sentences.pop())
        most_similar_sentence = find_most_similar(current_sentence, candidates, lsh, minhash_objects)
        if most_similar_sentence != "" and most_similar_sentence not in visited_sentences:
            visited_sentences.add(most_similar_sentence)
            sentence_morphing_order.append(most_similar_sentence)
            current_sentence = most_similar_sentence
            queue.put(most_similar_sentence)
    return sentence_morphing_order

"""
UMAP stuff here

"""

def getPrayerCoords():
    def reduce_dimensionality(similarity_matrix):
        reducer = umap.UMAP(n_neighbors=3, min_dist=0.5, metric='cosine')
        embedding = reducer.fit_transform(similarity_matrix)
        return embedding
    
    sentence_embeddings = []
    prayerData_with_embedding = []
    data_with_coordinates = []
    counter = 0

    for sentence in prayerData:
        counter = counter + 1
        embedding = sentence_embedding(sentence)
        if embedding is not None:
            sentence_embeddings.append(embedding)
            prayerData_with_embedding.append(sentence)
        else: 
            title_and_author_array.pop(counter)

    sentence_embeddings_array = np.array(sentence_embeddings)
    umap_embeddings = reduce_dimensionality(sentence_embeddings_array) #currently length is 4729 while prayerData length is 4775. 46 sentences don't have embeddings. 

    for i in range(len(umap_embeddings)):  # Iterate over indices of umap_embeddings
        data_with_coordinates.append({'sentence': prayerData_with_embedding[i], 'x': str(umap_embeddings[i, 0]), 'y': str(umap_embeddings[i, 1]), 'writing-source-title': title_and_author_array[i]['writing-source-title'],'writer-name': title_and_author_array[i]['writer-name']})

    with open("./static/prayer_coordinates.json", "w") as json_file:
        json.dump(data_with_coordinates, json_file, indent=4, ensure_ascii=False)  


getPrayerCoords()

"""
Info about the dataset: 
Minimum x coordinate: -10.787012
Maximum x coordinate: 17.512138
Minimum y coordinate: -4.6884336
Maximum y coordinate: 15.773928
"""

# print(prayerData)
# sentence_embeddings = [sentence_embedding(sentence) for sentence in prayerData]
# print(len(prayerData))
# print((sentence_embeddings[0]))

# sentence_morphing_order = generate_sentences(queue, copy_of_sentences, current_sentence)
# sentence_embeddings_bh = [sentence_embedding(sentence) for sentence in sentence_morphing_order]

# print(len(sentence_morphing_order))
# print((sentence_embeddings_bh[0]))

# print(prayerData)

# def generate_and_display_strings(queue, sentences_in_order):
#     for each_sentence in sentences_in_order: 
#         queue.put(each_sentence)
#         time.sleep(5)  # Wait for 5 second


# if __name__ == "__main__":
#     # Generate the array of strings using your algorithm
#     # Run this part of the code in parallel
#     # Create a multiprocessing queue for communication between processes
#     queue = multiprocessing.Queue()
#     display_queue = multiprocessing.Queue()

#     # Create separate processes for generating and displaying strings
#     generate_process = multiprocessing.Process(target=generate_sentences, args=(queue, copy_of_sentences, current_sentence))
#     display_process = multiprocessing.Process(target=display_strings, args=(queue,display_queue))

#     # Start both processes
#     generate_process.start()
#     display_process.start()

#     # Wait for both processes to finish
#     generate_process.join()
#     display_process.join()
