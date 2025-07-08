# Diabetes Prediction Using Machine Learning

This project demonstrates how to build a machine learning model to predict whether a person is diabetic or not, using the PIMA Indians Diabetes dataset. The workflow includes data analysis, preprocessing, model training, evaluation, and making predictions.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Dataset](#dataset)
- [Step-by-Step Workflow](#step-by-step-workflow)
  - [1. Importing Dependencies](#1-importing-dependencies)
  - [2. Data Collection and Analysis](#2-data-collection-and-analysis)
  - [3. Data Preprocessing](#3-data-preprocessing)
  - [4. Splitting the Data](#4-splitting-the-data)
  - [5. Data Standardization](#5-data-standardization)
  - [6. Model Training](#6-model-training)
  - [7. Model Evaluation](#7-model-evaluation)
  - [8. Making Predictions](#8-making-predictions)
- [Results](#results)
- [How to Use](#how-to-use)
- [Requirements](#requirements)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

The goal of this project is to predict diabetes in female patients based on diagnostic measurements. The model uses a Support Vector Machine (SVM) classifier with a linear kernel.

---

## Dataset

- **Source:** PIMA Indians Diabetes Dataset
- **Features:** Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age
- **Target:** Outcome (0 = Non-diabetic, 1 = Diabetic)
- **Rows:** 768
- **Columns:** 9

---

## Step-by-Step Workflow

### 1. Importing Dependencies

The following libraries are used:
- `numpy` and `pandas` for data manipulation
- `sklearn.preprocessing.StandardScaler` for feature scaling
- `sklearn.model_selection.train_test_split` for splitting the dataset
- `sklearn.svm` for the Support Vector Machine classifier
- `sklearn.metrics.accuracy_score` for evaluating the model

### 2. Data Collection and Analysis

- The dataset is loaded using `pandas.read_csv`.
- The first 10 rows are displayed to understand the structure.
- The shape of the dataset is checked: **768 rows, 9 columns**.
- Statistical measures (mean, std, min, max, etc.) are computed using `describe()`.
- The distribution of the target variable (`Outcome`) is analyzed:
  - 500 non-diabetic (0)
  - 268 diabetic (1)
- The mean values of features are compared between diabetic and non-diabetic groups.

### 3. Data Preprocessing

- The features (`X`) and target (`Y`) are separated:
  - `X` contains all columns except `Outcome`.
  - `Y` contains only the `Outcome` column.

### 4. Splitting the Data

- The dataset is split into training and testing sets using `train_test_split`:
  - 80% for training, 20% for testing
  - Stratified split to maintain the proportion of classes
  - Random state set for reproducibility

### 5. Data Standardization

- Features are standardized using `StandardScaler` to have zero mean and unit variance.
- The scaler is fit on the training data and applied to both training and test sets.

### 6. Model Training

- An SVM classifier with a linear kernel is created and trained on the standardized training data.

### 7. Model Evaluation

- The model's accuracy is evaluated on both the training and test sets using `accuracy_score`.
- **Training accuracy:** ~78.7%
- **Test accuracy:** ~77.3%

### 8. Making Predictions

- The model is used to predict diabetes for new input data.
- Example input: `(5, 166, 72, 19, 175, 25.8, 0.587, 51)`
- The input is converted to a numpy array, reshaped, standardized, and passed to the trained model.
- The prediction is interpreted and printed: "The person is diabetic" or "The person is not diabetic".

---

## Results

- The SVM model achieved an accuracy of approximately **78%** on the training set and **77%** on the test set.
- The model can be used to predict diabetes for new patients based on their medical measurements.

---

## How to Use

1. Clone this repository and ensure you have the required dependencies installed.
2. Place the `diabetes.csv` dataset in the project directory.
3. Run the notebook `Project_1_Diabetes_Prediction.ipynb` step by step.
4. To make a prediction for a new patient, modify the `input_data` variable in the last section of the notebook.

---

## Requirements

- Python 3.x
- numpy
- pandas
- scikit-learn

You can install the dependencies using:

```bash
pip install numpy pandas scikit-learn
