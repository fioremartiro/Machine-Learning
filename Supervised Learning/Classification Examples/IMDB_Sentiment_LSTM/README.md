# IMDB Reviews - Sentiment Analysis Using LSTM

This project demonstrates how to build a deep learning model to predict the sentiment (positive or negative) of movie reviews using Long Short-Term Memory (LSTM) neural networks. The workflow includes data collection via Kaggle API, preprocessing, model training, evaluation, and making predictions. It is designed to be simple, technical, and educational for learners getting started with NLP and deep learning.

## Table of Contents
- [Project Overview](#project-overview)
- [Dataset](#dataset)
- [Step-by-Step Workflow](#step-by-step-workflow)
  - [1. Importing Dependencies](#1-importing-dependencies)
  - [2. Data Collection - Kaggle API](#2-data-collection---kaggle-api)
  - [3. Loading the Dataset](#3-loading-the-dataset)
  - [4. Splitting Data](#4-splitting-data)
  - [5. Data Preprocessing](#5-data-preprocessing)
  - [6. LSTM - Long Short Term Memory](#6-lstm---long-short-term-memory)
  - [7. Compiling and Training the Model](#7-compiling-and-training-the-model)
  - [8. Evaluating the Model](#8-evaluating-the-model)
  - [9. Building a Predictive System](#9-building-a-predictive-system)
- [Results](#results)
- [How to Use](#how-to-use)
- [Requirements](#requirements)
- [Acknowledgements](#acknowledgements)

## Project Overview

The goal of this project is to classify IMDB movie reviews as positive or negative using natural language processing (NLP) and deep learning. We build an LSTM-based neural network with TensorFlow/Keras because LSTMs handle sequences well and can capture context across words, which is crucial for understanding sentiment.

What you will learn:
- How to load text data and prepare it for modeling (tokenization and padding)
- How to build an Embedding + LSTM model for binary classification
- How to train, evaluate, and use the model for predictions on new text

## Dataset

- Source: IMDB 50K Movie Reviews dataset
  - Kaggle: https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews/code
- Columns:
  - review: the text of the movie review
  - sentiment: “positive” or “negative”
- Size: 50,000 rows, 2 columns
- Balanced classes: 25K positive, 25K negative

## Step-by-Step Workflow

### 1. Importing Dependencies

Libraries used:
- os, json for Kaggle API credentials handling
- zipfile.ZipFile for extracting the downloaded dataset
- pandas for data loading/manipulation
- sklearn.model_selection.train_test_split for creating train/test splits
- tensorflow.keras (Sequential, Dense, Embedding, LSTM) for the model
- tensorflow.keras.preprocessing.text.Tokenizer for converting text to integer sequences
- tensorflow.keras.preprocessing.sequence.pad_sequences for making sequences equal length

Why these are needed:
- NLP pipelines require converting text into numbers
- LSTMs expect padded sequences of consistent length
- Train-test splits are essential for unbiased evaluation

### 2. Data Collection - Kaggle API

Steps:
1. Get your Kaggle API key (kaggle.json) from your Kaggle account (Account Settings → Create New API Token).
2. Place kaggle.json in your project directory.
3. Load credentials, set environment variables, and download the dataset:
   - Set KAGGLE_USERNAME and KAGGLE_KEY from kaggle.json
   - Run: kaggle datasets download -d lakshmi25npathi/imdb-dataset-of-50k-movie-reviews
4. Unzip the downloaded file to extract IMDB Dataset.csv

Tips:
- Never commit kaggle.json to a public repo
- If using Colab, upload kaggle.json to the runtime first

### 3. Loading the Dataset

- Load the CSV: pd.read_csv("IMDB Dataset.csv")
- Inspect with .head(), .shape, and .value_counts() on the sentiment column
- Convert labels to binary for modeling:
  - positive → 1
  - negative → 0

Why convert? Neural nets typically expect numeric targets for classification.

### 4. Splitting Data

- Use train_test_split with test_size=0.2 and random_state=42
- 80% train (40,000 reviews), 20% test (10,000 reviews)
- Keep the split fixed (random_state) for reproducibility

### 5. Data Preprocessing

- Tokenization:
  - Fit a Tokenizer on training reviews (e.g., num_words=5000 for top 5,000 words)
  - Convert text to integer sequences
- Padding:
  - Pad sequences to a fixed length (e.g., maxlen=200) so all inputs have the same shape
- Targets:
  - y_train = train_data["sentiment"], y_test = test_data["sentiment"]

Notes:
- num_words controls vocabulary size; larger vocab = more capacity, more memory
- maxlen balances context length vs. speed/memory

### 6. LSTM - Long Short Term Memory

Model architecture (Sequential):
1. Embedding layer
   - Transforms token ids into dense vectors (e.g., 128-dim)
   - Example: input_dim=10000, output_dim=128, input_length=300 (note: align with your padded length)
2. LSTM layer
   - Learns sequence patterns and long-range dependencies
   - Example: units=192, dropout=0.2, recurrent_dropout=0.2
3. Dense output layer
   - Sigmoid activation for binary classification (outputs probability)

Important consistency note:
- If you pad to 200 tokens, set input_length=200 in Embedding. Keep these consistent.

### 7. Compiling and Training the Model

- Compile with:
  - optimizer="adam"
  - loss="binary_crossentropy"
  - metrics=["accuracy"]
- Fit the model:
  - epochs=5
  - batch_size=64
  - validation_split=0.2 (use a slice of training data for validation)
- Monitor training vs. validation accuracy/loss to check for over/underfitting

### 8. Evaluating the Model

- Evaluate on test set with model.evaluate(x_test, y_test)
- Report Test Loss and Test Accuracy
- Print model.summary() to review architecture and parameter counts

Optional metrics:
- Confusion matrix, precision/recall, ROC-AUC (not included in base script, but recommended for deeper evaluation)

### 9. Building a Predictive System

- Define a helper function predict_sentiment(review):
  - Tokenize and pad the input review using the same tokenizer and maxlen
  - Run model.predict to get a probability
  - Map probability > 0.5 to "positive", else "negative"
- Example:
  - Input: "This movie was fantastic! I loved every minute of it."
  - Output: positive

Tips:
- Save the trained model and tokenizer (e.g., using model.save() and pickle for tokenizer) to reuse without retraining.

## Results

- Expected: Strong accuracy on held-out test data (exact values vary by run, epochs, and hyperparameters)
- The LSTM handles context better than bag-of-words models, improving sentiment classification for longer reviews
- For higher accuracy, consider:
  - More epochs with early stopping
  - Larger vocabulary and sequence length
  - Pretrained embeddings (e.g., GloVe)
  - BiLSTM or additional layers
  - Regularization and learning rate tuning

## How to Use

1. Clone the repository and open the project folder.
2. Ensure you have a valid kaggle.json in the project root.
3. Install requirements (see below).
4. Run the notebook IMDB Reviews - Sentiment Analysis - LSTM.ipynb (or the Python script imdb_reviews_sentiment_analysis_lstm.py) step-by-step.
5. After training, use predict_sentiment("your text here") to classify new reviews.

Recommended repo structure:
- Supervised Learning/Classification Examples/IMDB_Sentiment_LSTM/
  - README.md
  - IMDB Reviews - Sentiment Analysis - LSTM.ipynb
  - imdb_reviews_sentiment_analysis_lstm.py
  - requirements.txt
  - data/ (optional; add instructions to download via Kaggle)

## Requirements

- Python 3.x
- pandas
- scikit-learn
- tensorflow
- kaggle

Install with:
```bash
pip install pandas scikit-learn tensorflow kaggle
```
If using Kaggle CLI for the first time:

```bash
# Place kaggle.json in the working directory or ~/.kaggle/
mkdir -p ~/.kaggle
cp kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json
```
## Acknowledgements

### Dataset
- IMDB Dataset of 50K Movie Reviews by Lakshmi Narayana Pandey on Kaggle:  
  - https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews/code

### Frameworks and Libraries
- TensorFlow/Keras for implementing the Embedding + LSTM model  
- pandas and scikit-learn for data handling and splitting

### Purpose
- This repository is for educational use, aimed at teaching machine learning and NLP fundamentals with a clear, simple, and technically accurate example.
