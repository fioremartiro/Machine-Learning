# Heart Disease prediction using Machine Learning

This project demonstrates how to build a machine learning model to predict whether a person is at risk of heart disease, using the UCI Heart Disease dataset. The workflow includes data analysis, preprocessing, model training, evaluation, and making predictions.

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

The goal of this project is to predict the presence of heart disease in patients based on diagnostic measurements. The model uses a Logistic Regression classifier for binary classification.

---

## Dataset

- **Source:** UCI Heart Disease Dataset - Kaggle
- **Features:** age, sex, chest pain type, resting blood pressure, serum cholesterol, fasting blood sugar, resting ECG results, maximum heart rate achieved, exercise-induced angina, ST depression, slope of peak exercise ST segment, number of major vessels, thalassemia
- **Target:** presence of heart disease (1 = disease, 0 = no disease)
- **Rows:** 303
- **Columns:** 14

---

## Step-by-Step Workflow

### 1. Importing Dependencies

The following libraries are used:
- `numpy` and `pandas` for data manipulation
- `sklearn.preprocessing.StandardScaler` for feature scaling
- `sklearn.model_selection.train_test_split` for splitting the dataset
- `sklearn.linear_model.LogisticRegression` for the classification model
- `sklearn.metrics.accuracy_score` for evaluating the model

### 2. Data Collection and Analysis

- The dataset is loaded using `pandas.read_csv`.
- Displayed the first few rows to understand the data structure.
- Checked dataset shape: **303 rows, 14 columns**.
- Analyzed summary statistics using `describe()`.
- Checked class distribution of the target variable:
  - Presence of heart disease: 165 patients (1)
  - No heart disease: 138 patients (0)

### 3. Data Preprocessing

- Features (`X`) and target (`Y`) separated:
  - `X`: all columns except the target
  - `Y`: the target column indicating presence of disease

### 4. Splitting the Data

- Used `train_test_split` to divide the dataset:
  - 80% for training, 20% for testing
  - `stratify=Y` ensures both sets maintain class distribution
  - `random_state=2` for reproducibility

### 5. Data Standardization

- Standardized feature values using `StandardScaler`.
- Fitted the scaler on training data and applied it to both train and test sets.

### 6. Model Training

- Trained a Logistic Regression model on the standardized training set.

### 7. Model Evaluation

- Evaluated the model’s accuracy on both training and test sets using `accuracy_score`.
- **Training accuracy:** ~85%
- **Test accuracy:** ~82%

### 8. Making Predictions

- Created a function to predict heart disease for new patient data.
- Example input: `(63, 1, 3, 145, 233, 1, 0, 150, 0, 2.3, 0, 0, 1)`
- Converted input to numpy array, reshaped, standardized, and passed it to the model.
- Printed prediction: "The patient is at risk of heart disease" or "The patient is not at risk of heart disease".

---

## Results

- The Logistic Regression model achieved an accuracy of approximately **85%** on training data and **82%** on test data.
- This model can assist healthcare professionals in identifying patients at higher risk of heart disease.

---

## How to Use

1. Clone this repository and ensure all dependencies are installed.
2. Place the `heart.csv` dataset in the project directory.
3. Open and run the notebook `Heart_Disease_Prediction.ipynb` step by step.
4. To predict for a new patient, modify the `input_data` variable in the last section of the notebook.

---

## Requirements

- Python 3.x
- numpy
- pandas
- scikit-learn

Install the required libraries using:

```bash
pip install numpy pandas scikit-learn
