# Supervised Learning

Supervised learning is a type of machine learning where the model is trained on a labeled dataset. This means each training example includes input features (independent variables) and a known output (dependent variable). The goal is for the model to learn a mapping from inputs to outputs so it can predict outcomes for new, unseen data.

Supervised learning problems are broadly categorized into:

---

## 📈 Regression
Regression algorithms are used when the output variable is continuous and numeric. They predict values such as prices, temperatures, or probabilities.

Example algorithms:
- **Linear Regression**
- **Polynomial Regression**
- **Multiple Regression**
- **Ridge Regression**
- **Lasso Regression**
- **Elastic Net Regression**

👉 See [Regression Examples](./Regression%20examples/README.md)

## **Example - Predicting House Prices** 

You have a dataset with features like square footage, number of bedrooms, and location. The goal is to predict the **price** of a house.  
Here the output (price) is a continuous numeric value.

---

## 🏷️ Classification
Classification algorithms are used when the output variable is categorical. The goal is to assign input data to one of several predefined classes or categories.

Example algorithms:
- **Logistic Regression**
- **Decision Trees**
- **Random Forest**
- **Support Vector Machines (SVM)**
- **K-Nearest Neighbors (KNN)**
- **Naive Bayes**

👉 See [Classification Examples](./Classification%20Examples/README.md)

## **Example - Email Spam Detection**

You have a dataset of emails with features like word frequency, presence of links, and sender reputation. The goal is to predict whether each email is **spam or not spam**. Here the output (spam/not spam) is a discrete class.

---

Each algorithm has its own subfolder with example notebooks
