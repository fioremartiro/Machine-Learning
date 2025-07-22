# Classification Algorithms in Supervised Learning

Classification algorithms are used in supervised learning when the output variable is categorical. These algorithms predict class labels for input data and are widely used for problems like spam detection, medical diagnosis, and image recognition.

This folder contains examples of the following classification algorithms:

## 1. Logistic Regression
Logistic regression is a classification algorithm that models the probability of a binary outcome based on the independent variables. It uses the sigmoid function to map predictions to probabilities and applies a threshold to classify inputs.

## 2. Linear Discriminant Analysis (LDA)
Linear Discriminant Analysis is used to find a linear combination of features that best separates two or more classes. It’s often applied to multi-class classification and can also serve as a dimensionality reduction technique.

## 3. Stochastic Gradient Descent Classifier
The SGD Classifier trains linear models for classification using stochastic gradient descent optimization. It is efficient for large-scale datasets and supports different loss functions (e.g., hinge for SVM, log for logistic regression).

---

Each algorithm in this folder is demonstrated with example notebooks:

- `1_logistic_regression.ipynb`
- `2_linear_discriminant_analysis.ipynb`
- `3_sgd_classifier.ipynb`
