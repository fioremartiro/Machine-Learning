# Regression Algorithms in Supervised Learning

Regression algorithms are used in supervised learning to model the relationship between input variables (independent variables) and a **continuous output variable** (dependent variable). These algorithms predict numeric values based on patterns found in the data.

Below are the regression algorithms demonstrated in this folder:

---

## 1. Linear Regression
Linear regression is the simplest type of regression algorithm. It models the relationship between the independent variables and the dependent variable using a linear function.

## 2. Multiple Regression
Multiple regression is an extension of linear regression that allows modeling the relationship between multiple independent variables and a single dependent variable.

## 3. Polynomial Regression
Polynomial regression models the relationship between the independent variables and the dependent variable using a polynomial function. It is useful when data shows a non-linear trend.

## 4. Ridge Regression
Ridge Regression addresses multicollinearity in multiple regression by adding a regularization term to the cost function, which penalizes large coefficients and helps avoid overfitting.

## 5. Lasso Regression
Lasso Regression also handles multicollinearity but uses L1 regularization, which can shrink some coefficients to zero, effectively performing feature selection.

## 6. Elastic Net Regression
Elastic Net combines both Ridge (L2) and Lasso (L1) regularization penalties. It is particularly useful when there are multiple correlated features.

---

Each algorithm in this folder is demonstrated with example notebooks:

- `1_linear_regression.ipynb`
- `2_polynomial_regression.ipynb`
- `3_multiple_regression.ipynb`
- `4_ridge_regression.ipynb`
- `5_lasso_regression.ipynb`
- `6_elastic_net_regression.ipynb`
