"""
PhishLens - Evaluation Report Generator
Evaluates the saved Random Forest model on test data and prints classification metrics.
"""

import os
import json
from ml.train_model import train_and_evaluate

def main():
    print("Executing full model training and held-out test evaluation...")
    _, report = train_and_evaluate()
    print("\n--- TEST EVALUATION SUMMARY ---")
    rf_metrics = report['metrics']['random_forest']
    print(f"Accuracy:            {rf_metrics['accuracy'] * 100:.2f}%")
    print(f"Precision:           {rf_metrics['precision'] * 100:.2f}%")
    print(f"Recall:              {rf_metrics['recall'] * 100:.2f}%")
    print(f"F1-Score:            {rf_metrics['f1_score']:.4f}")
    print(f"PR-AUC:              {rf_metrics['pr_auc']:.4f}")
    print(f"False Positive Rate: {rf_metrics['false_positive_rate'] * 100:.2f}%")
    print(f"Confusion Matrix:    TP={rf_metrics['confusion_matrix']['true_positives']}, FP={rf_metrics['confusion_matrix']['false_positives']}, FN={rf_metrics['confusion_matrix']['false_negatives']}, TN={rf_metrics['confusion_matrix']['true_negatives']}")

if __name__ == '__main__':
    main()
