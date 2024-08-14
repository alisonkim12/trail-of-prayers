import nltk
from nltk.tokenize import sent_tokenize
import csv
import string


def main(): 
    def filter_strings(strings):
        special_chars = set(string.punctuation)
        filtered_strings = [s for s in strings if s and not all(char in special_chars for char in s)]
        return filtered_strings

    prayerData = []

    with open("src/miribai.txt", "r") as file:
        text = file.read()

    paragraphs = text.split("\n\n")
    result_array = []
    for paragraph in paragraphs:
        lines = paragraph.split("\n")
        paired_lines = ""
        for i in range(0, len(lines), 2):
            if i + 1 < len(lines):
                paired_lines += lines[i] + "\n" + lines[i + 1] + "\n"
        result_array.append(paired_lines)

    result_array = [string.replace("\n", "") for string in result_array] #if I want to get rid of all the newlines
    result_array = filter_strings(result_array)

    for result_line in result_array: 
        mysticData = {
            'writing-source-title': 'The Devotional Poems Of Mirabai',
            'writer-name' : 'Mirabai',
            'prayer-line' : result_line
        }
        prayerData.append(mysticData)


    # with open("src/divani_rumi.txt", "r") as file:
    #     text = file.read()

    # paragraphs = text.split("\n\n")
    # result_array = []
    # for paragraph in paragraphs:
    #     lines = paragraph.split("\n")
    #     paired_lines = ""
    #     for i in range(0, len(lines), 2):
    #         if i + 1 < len(lines):
    #             paired_lines += lines[i] + "\n" + lines[i + 1] + "\n"
    #     result_array.append(paired_lines)

    # result_array = [string.replace("\n", "") for string in result_array] #if I want to get rid of all the newlines
    # result_array = filter_strings(result_array)

    # for result_line in result_array: 
    #     mysticData = {
    #         'writing-source-title': 'Dīvāni Shamsi Tabrīz',
    #         'writer-name' : 'Jalāl ad-Dīn Muhammad Rūmī',
    #         'prayer-line' : result_line
    #     }
    #     prayerData.append(mysticData)

    """
    For the text: 'themother_meditations.txt' (for mother put in the conditional if line = "." skip...)

    'teresa_castle.txt'

    'angelafoligno.txt'

    'rabia_poems.txt'

    'catherine_purgatory.txt'

    """
    nltk.download('punkt')

    with open('src/themother_meditations.txt', 'r') as file:
        text = file.read()

    sentences = sent_tokenize(text)
    filter_sentences = filter_strings(sentences)

    # Print each sentence
    # for sentence in sentences:
    #     if sentence != ".":
    #         filter_sentences.append(sentence.strip())

    for filter_sentence in filter_sentences[:500]: 
        mysticData = {
            'writing-source-title': 'Prayers and Meditations',
            'writer-name' : 'Mirra Alfassa',
            'prayer-line' : filter_sentence
        }
        prayerData.append(mysticData)


    with open('src/teresa_castle.txt', 'r') as file:
        text = file.read()

    sentences = sent_tokenize(text)
    # filter_sentences = []
    # Print each sentence
    # for sentence in sentences:
    #     filter_sentences.append(sentence.strip())

    filter_sentences = filter_strings(sentences)

    for filter_sentence in filter_sentences[:500]: 
        mysticData = {
            'writing-source-title': 'The Interior Castle',
            'writer-name' : 'St. Teresa of Ávila',
            'prayer-line' : filter_sentence
        }
        prayerData.append(mysticData)

    with open('src/angelafoligno.txt', 'r') as file:
        text = file.read()

    sentences = sent_tokenize(text)
    # filter_sentences = []
    # Print each sentence
    # for sentence in sentences:
    #     filter_sentences.append(sentence.strip())

    filter_sentences = filter_strings(sentences)

    for filter_sentence in filter_sentences: 
        mysticData = {
            'writing-source-title': 'The Book of Divine Consolation of the Blessed Angela of Foligno',
            'writer-name' : 'Angela of Foligno',
            'prayer-line' : filter_sentence
        }
        prayerData.append(mysticData)

    with open('src/rabia_poems.txt', 'r') as file:
        text = file.read()

    sentences = sent_tokenize(text)
    # filter_sentences = []
    # Print each sentence
    # for sentence in sentences:
    #     filter_sentences.append(sentence.strip())
    filter_sentences = filter_strings(sentences)

    for filter_sentence in filter_sentences: 
        mysticData = {
            'writing-source-title': 'Rabia Al Basri poems',
            'writer-name' : 'Rābiʼa al-ʼAdawiyya al-Qaysiyya',
            'prayer-line' : filter_sentence
        }
        prayerData.append(mysticData)


    with open('src/catherine_purgatory.txt', 'r') as file:
        text = file.read()

    sentences = sent_tokenize(text)
    # filter_sentences = []
    # Print each sentence
    # for sentence in sentences:
    #     filter_sentences.append(sentence.strip())
    filter_sentences = filter_strings(sentences)

    for filter_sentence in filter_sentences: 
        mysticData = {
            'writing-source-title': 'Treatise on Purgatory',
            'writer-name' : 'Saint Catherine of Genoa',
            'prayer-line' : filter_sentence
        }
        prayerData.append(mysticData)

    with open('src/Bahiyyih_Khanum.txt', 'r') as file:
        text = file.read()

        sentences = sent_tokenize(text)
        # filter_sentences = []
        # Print each sentence
        # for sentence in sentences:
        #     filter_sentences.append(sentence.strip())
        filter_sentences = filter_strings(sentences)

        for filter_sentence in filter_sentences: 
            mysticData = {
                'writing-source-title': 'A Compilation from Bahá’í Sacred Texts and Writings of the Guardian of the Faith and Bahíyyih Khánum’s Own Letters',
                'writer-name' : 'Bahíyyih Khánum',
                'prayer-line' : filter_sentence
            }
            prayerData.append(mysticData)

    with open('src/ebner.txt', 'r') as file:
        text = file.read()

        sentences = sent_tokenize(text)
        # filter_sentences = []
        # Print each sentence
        # for sentence in sentences:
        #     filter_sentences.append(sentence.strip())
        filter_sentences = filter_strings(sentences)

        for filter_sentence in filter_sentences: 
            mysticData = {
                'writing-source-title': 'The Revelations of Margaret Ebner',
                'writer-name' : 'Margareta Ebner',
                'prayer-line' : filter_sentence
            }
            prayerData.append(mysticData)

    with open("processed_writing_data.csv", mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["writing-source-title", "writer-name", "prayer-line"])
        writer.writeheader()
        for song in prayerData:
            writer.writerow(song)


if __name__ == "__main__":
    main()