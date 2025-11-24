# Autism Screening Likelihood Predictor (Machine Learning model)

## Table of Contents
- [Project Overview](#project-overview)
- [Dataset](#dataset)
- [Step-by-Step Workflow](#step-by-step-workflow)
  - [1. Importing the Dependencies](#1-importing-the-dependencies)
  - [2. Data Loading and Understanding the Data](#2-data-loading-and-understanding-the-data)
  - [3. Explore the Data and Analysis (EDA)](#3-explore-the-data-and-analysis-eda)
  - [4. Data Preprocessing](#4-data-preprocessing)
  - [5. Model Training](#5-model-training)
  - [6. Model Selection and Hyperparameter Tuning](#6-model-selection-and-hyperparameter-tuning)
  - [7. Evaluation](#7-evaluation)
- [Clinical Disclaimer](#clinical-disclaimer)
- [Conclusion](#conclusion)

---

## Project Overview

This project builds a machine learning system that estimates the **likelihood that an individual screens positive for autism traits** using AQ-10 questionnaire responses and demographic information. The goal is to create an accurate and replicable **pre-screening aid**, not a diagnostic tool.

The pipeline includes: data loading, exploratory analysis, preprocessing, class-imbalance correction, model training, hyperparameter tuning, and final evaluation.

---

## Dataset

**Source:**  
https://www.kaggle.com/competitions/autismdiagnosis/data

### Key Features
- **A1_Score – A10_Score:** AQ-10 screening items  
- **age:** Age  
- **gender, ethnicity, jaundice, autism, relation:** Categorical attributes  
- **contry_of_res:** Cleaned country names  
- **used_app_before:** Prior screening indicator  
- **result:** Sum of AQ scores  
- **Class/ASD:** Target variable (1 = screening-positive, 0 = screening-negative)

### Dropped Columns
- `ID`  
- `age_desc`  

### Known Issues
- Inconsistent categories  
- Missing categorical values  
- Outliers in numeric fields  
- Strong class imbalance  
- Self-reported (not clinically validated)

---

## Step-by-Step Workflow

---

## 1. Importing the Dependencies

Libraries for:

- Data manipulation: `pandas`, `numpy`  
- Visualization: `matplotlib`, `seaborn`  
- Label encoding: `LabelEncoder`  
- Class imbalance correction: `SMOTE`  
- Model training: Decision Tree, Random Forest, XGBoost  
- Hyperparameter tuning: `RandomizedSearchCV`, `cross_val_score`  
- Evaluation: accuracy, confusion matrix, classification report  
- Saving pipelines: `pickle`  

---

## 2. Data Loading and Understanding the Data

Dataset loaded with:

```python
df = pd.read_csv('/content/train.csv')
```

### Initial inspection includes:

- Viewing head/tail samples  
- Checking shape and data types  
- Listing unique values per feature  
- Dropping `ID` and `age_desc`  
- Fixing inconsistent country names  
- Inspecting target distribution  

**Findings:**
- `"Viet Nam"` normalized to `"Vietnam"`  
- Missing or inconsistent entries in `ethnicity` and `relation`  
- Strong imbalance between ASD vs non-ASD classes  

---

## 3. Explore the Data and Analysis (EDA)

EDA includes:

### **Visual exploration**
- Distributions of `age` and `result`  
- Boxplots for outlier detection  
- Countplots for all categorical features  
- Heatmap of correlations  

### **Insights**
- Some outliers in numerical features  
- No dangerously correlated features  
- Clear class imbalance  
- Several categorical features unevenly distributed  

---

## 4. Data Preprocessing

### **4.1 Cleaning categorical features**
- Replace `"?"`, `"others"`, `"Unknown"` with `"Others"`  
- Normalize country names  
- Group relation categories into `"Others"`  

### **4.2 Label Encoding**
Categorical (`object`) features encoded using `LabelEncoder`.

Encoders saved to:

```
label_encoders.pkl
```

### **4.3 Outlier Handling**
Outliers in `age` and `result` replaced using the median (IQR method).

### **4.4 Feature/Target Split**
```python
X = df.drop('Class/ASD', axis=1)
y = df['Class/ASD']
```

### **4.5 Train/Test Split**
```python
train_test_split(X, y, test_size=0.2, random_state=42)
```

### **4.6 Handling Class Imbalance (SMOTE)**
SMOTE applied **only** to training data:

```
X_train, y_train → SMOTE → X_train_smote, y_train_smote
```

---

## 5. Model Training

Three baseline models trained:

- **Decision Tree Classifier**  
- **Random Forest Classifier**  
- **XGBoost Classifier**  

Each model evaluated with **5-fold cross-validation** using the SMOTE-resampled training set.

**Metric used:** Accuracy  

---

## 6. Model Selection and Hyperparameter Tuning

`RandomizedSearchCV` applied with:

- 50 randomized parameter combinations  
- 5-fold CV  
- Accuracy scoring  

### Tuned parameters include:
- Split criteria  
- Max depth  
- Minimum samples per split/leaf  
- Number of estimators  
- Learning rate (XGBoost)  
- Subsampling  
- Column sampling  
- Bootstrap options  

### Best Model Saving
The highest-performing model is saved as:

```
<BestModelName>_overall_best_model.pkl
```

---

## 7. Evaluation

Final evaluation performed on the **untouched test set** using:

- Accuracy score  
- Confusion matrix  
- Classification report (precision, recall, F1-score)  

**Random Forest** typically performs best after tuning.

---

## Clinical Disclaimer

This project does **not** diagnose Autism Spectrum Disorder (ASD).  
It predicts **screening likelihood** based solely on the AQ-10 self-reported questionnaire.

A formal autism diagnosis requires:

- ADOS-2  
- ADI-R  
- CARS-2, SRS-2, Vineland  
- Cognitive/IQ testing  
- Developmental & medical history  
- In-person evaluation by licensed clinicians  

This project is intended for **research, education, and early triage support**, not clinical decision-making.

---

## Conclusion

The **Autism Screening Likelihood Predictor** provides a full machine learning workflow for estimating ASD screening likelihood using AQ-10 data.

This repository includes:

- Full EDA  
- Preprocessing pipeline  
- Outlier handling  
- Class imbalance correction  
- Label encoding  
- Multiple ML models  
- Hyperparameter tuning  
- Final evaluation  
- Exported model & encoders  

### Future Enhancements
- SHAP/LIME explainability  
- Streamlit/FastAPI deployment  
- Bias/Fairness analysis  
- Uncertainty estimation  
- Model calibration  
