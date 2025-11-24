# Parkinson's Disease Detection Using Machine Learning

This project demonstrates how to build a machine learning model to detect Parkinson's disease using biomedical voice measurements. The workflow includes data analysis, preprocessing, model training, evaluation, and making predictions.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Dataset](#dataset)
- [Step-by-Step Workflow](#step-by-step-workflow)
  - [1. Importing Dependencies](#1-importing-dependencies)
  - [2. Data Collection and Analysis](#2-data-collection-and-analysis)
  - [3. Data Preprocessing](#3-data-preprocessing)
  - [4. Splitting the Dataset](#4-splitting-the-dataset)
  - [5. Data Standardization](#5-data-standardization)
  - [6. Model Training](#6-model-training)
  - [7. Model Evaluation](#7-model-evaluation)
  - [8. Building a Predictive System](#8-building-a-predictive-system)
- [How to Use](#how-to-use)
- [Requirements](#requirements)
- [Conclusion](#conclusion)
- [References](#references)

---

## Project Overview

Parkinson's disease is a progressive neurological disorder that affects movement. Early detection can help manage symptoms more effectively. In this project, a Support Vector Machine (SVM) classifier is used to predict whether a person has Parkinson's disease based on voice measurements.

---

## Dataset

The dataset originates from the UCI Machine Learning Repository (Oxford Parkinson's Disease Detection Dataset, donated June 25, 2008). It includes:

- **195** voice recordings from **31** individuals (23 diagnosed with Parkinson's, 8 healthy).
- **24 columns**:
  - `name`: subject and recording ID
  - **22 biomedical features**, including:
    - Fundamental frequency: MDVP\:Fo(Hz), MDVP\:Fhi(Hz), MDVP\:Flo(Hz)
    - Jitter measures: MDVP\:Jitter(%), MDVP\:Jitter(Abs), MDVP\:RAP, MDVP\:PPQ, Jitter\:DDP
    - Shimmer measures: MDVP\:Shimmer, MDVP\:Shimmer(dB), Shimmer\:APQ3, Shimmer\:APQ5, MDVP\:APQ, Shimmer\:DDA
    - Noise-to-harmonics ratio: NHR, HNR
    - Nonlinear dynamics: RPDE, DFA, spread1, spread2, D2, PPE
  - `status`: target variable (1 = Parkinson's, 0 = Healthy)
- No missing values; fully numeric except `name`.
- Approximately six recordings per subject.
- Ideal for binary classification tasks.

---

## Step-by-Step Workflow

### 1. Importing Dependencies

Libraries used: `pandas`, `numpy`, `scikit-learn` (for preprocessing, model building, and evaluation).

### 2. Data Collection and Analysis

- Loaded `parkinsons.csv` into a DataFrame.
- Explored shape, data types, summary statistics, and target distribution.
- Detected no missing values.
- Inspected mean feature values by `status`.

### 3. Data Preprocessing

- Dropped the `name` column.
- Separated data into features (`X`) and target (`Y`).

### 4. Splitting the Dataset

- Performed an 80/20 train-test split using a fixed `random_state=2` for reproducibility.

### 5. Data Standardization

- Standardized features (zero mean, unit variance) using `StandardScaler`, fitted on training data to avoid leakage.

### 6. Model Training

- Initialized and trained an SVM classifier with a linear kernel.

### 7. Model Evaluation

- **Training Accuracy**: 88%
- **Testing Accuracy**: 87%
- Comparable performance suggests good generalization with minimal overfitting.

### 8. Building a Predictive System

- Created a pipeline to:
  1. Accept new voice measurement input.
  2. Reshape and standardize data.
  3. Predict Parkinson's status (0 or 1).

---

## How to Use

1. Clone this repository and ensure all dependencies are installed.
2. Place the `parkinsons.csv` dataset in the project directory.
3. Open and run the notebook `Project_3_Parkinson's_Disease_Detection.ipynb` step by step.
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
```

---

## Conclusion

This project implements a clean, end-to-end pipeline for Parkinson's disease detection using voice data and SVM. The model demonstrates strong performance, but future enhancements could include:

- Addressing class imbalance (e.g., SMOTE, SVM class weights).
- Exploring other classifiers (Random Forest, XGBoost, deep learning).
- Validating with cross-validation or larger, external datasets.
- Expanding clinical features or including telemonitoring data.

---

## References

- Little, M. A., McSharry, P. E., Hunter, E. J., & Ramig, L. O. (2008). *Suitability of dysphonia measurements for telemonitoring of Parkinson's disease*. IEEE Transactions on Biomedical Engineering. Dataset from UCI Machine Learning Repository ([archive.ics.uci.edu](https://archive.ics.uci.edu/ml/datasets/parkinsons)).
- UCI Parkinson’s dataset entry, 2008 ([archive.ics.uci.edu](https://archive.ics.uci.edu/ml/datasets/parkinsons)).

