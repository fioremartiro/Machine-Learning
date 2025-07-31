# Breast Cancer Detection Using Machine Learning

This project demonstrates how to build a machine learning model to detect breast cancer using real diagnostic measurements. It includes all steps from data preprocessing to training and evaluating a Logistic Regression model, followed by a 3D visualization of synthetic tumor shapes based on patient data.

## Table of Contents

- [Project Overview](#project-overview)
- [Dataset](#dataset)
- [Step-by-Step Workflow](#step-by-step-workflow)
  - [1. Importing Dependencies](#1-importing-dependencies)
  - [2. Data Collection](#2-data-collection)
  - [3. Data Preprocessing and Analysis](#3-data-preprocessing-and-analysis)
  - [4. Splitting the Dataset](#4-splitting-the-dataset)
  - [5. Model Training](#5-model-training)
  - [6. Model Evaluation](#6-model-evaluation)
  - [7. Building a Predictive System](#7-building-a-predictive-system)
  - [8. 3D Visualization of Tumor Shape](#8-3d-visualization-of-tumor-shape)
- [Conclusion](#conclusion)

## Project Overview

The objective is to develop a binary classification model that predicts whether a tumor is malignant (`0`) or benign (`1`) using 30 numerical diagnostic features derived from digitized images of breast masses.

## Dataset

- **Source:** [UCI Machine Learning Repository – Breast Cancer Wisconsin (Diagnostic) Data Set](https://archive.ics.uci.edu/ml/datasets/Breast+Cancer+Wisconsin+(Diagnostic))
- **Samples:** 569 patients
- **Features:** 30 numeric features (mean, standard error, and worst-case of attributes like radius, texture, smoothness, etc.)
- **Target Variable:** Diagnosis (`M`=Malignant, `B`=Benign), converted to `0` and `1` for modeling

## Step-by-Step Workflow

### 1. Importing Dependencies

The following Python libraries are used:

- `pandas` and `numpy` for data manipulation
- `scikit-learn` for preprocessing, model training, and evaluation (`train_test_split`, `LogisticRegression`, `accuracy_score`)
- `plotly.graph_objects` and `numpy` for 3D visualization of tumor shape

### 2. Data Collection

The dataset is loaded into a Pandas DataFrame. Initial inspection includes:
- Viewing the first few rows using `.head()`
- Checking shape using `.shape()` to confirm 569 rows and 32 columns (including ID and label)

### 3. Data Preprocessing and Analysis

Key preprocessing steps include:
- Dropping irrelevant columns (like `id`)
- Encoding the diagnosis column: `M` → `0` and `B` → `1`
- Checking for missing/null values
- Computing class balance
- Generating basic statistics (mean, std) for feature exploration

### 4. Splitting the Dataset

The dataset is split into features (`X`) and target labels (`Y`), and then into:
- **80% training data**
- **20% testing data**

Stratification is used to maintain class distribution in both sets. A fixed `random_state` ensures reproducibility.

### 5. Model Training

A **Logistic Regression** classifier is used due to its simplicity and interpretability in binary classification.

- The model is trained on the 80% training set.
- It learns to associate feature patterns with class labels (`0` = Malignant, `1` = Benign).

### 6. Model Evaluation

Model performance is evaluated using:
- **Training accuracy** to check how well the model fits known data
- **Testing accuracy** to evaluate generalization to unseen data

Accuracy is calculated using `accuracy_score` from `sklearn.metrics`.

### 7. Building a Predictive System

Once trained, the model can be used to classify new, unseen patient data by:
- Accepting a single patient's 30 diagnostic measurements
- Reshaping the input for prediction
- Returning a class prediction: Malignant (`0`) or Benign (`1`)

This predictive step simulates real-world application of the trained model.

### 8. 3D Visualization of Tumor Shape

This final step creates a **synthetic 3D representation of tumor geometry** based entirely on the patient's real input features. It is not a medical image, but a mathematically generated visualization that reflects:

- Radius, texture, perimeter, and concavity of the tumor
- Surface bumpiness derived from selected features
- Geometric distortions to visually emphasize tumor characteristics

Each patient’s input produces a unique 3D shape. The shape is colored using a continuous colormap (`Inferno`) based on internal surface intensity calculated from features.

The plot is rendered using **Plotly** as an interactive 3D surface that can be rotated and inspected. The title dynamically reflects the predicted diagnosis (Malignant or Benign).

## Conclusion

This project walks through the full machine learning pipeline for breast cancer classification using logistic regression. Beyond metrics, the use of a 3D synthetic tumor visualization brings interpretability and an intuitive understanding of how patient data influences model outcomes.
