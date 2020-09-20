import nltk
from textblob import TextBlob

def subjectivity(text):

    sentence_subjectivity = []
    sentences = nltk.tokenize.sent_tokenize(text)

    for count, sentence in enumerate(sentences):
        sentence_testimonial = TextBlob(sentence)
        sentence_subjectivity.append({"sentence": sentence, 'subjectivity': sentence_testimonial.sentiment.subjectivity})

    testimonial = TextBlob(text)
    return {"subjectivity": testimonial.sentiment.subjectivity, "sentence subjectivity": sentence_subjectivity}

print(subjectivity("Textblob is amazingly simple to use. What great fun!"))