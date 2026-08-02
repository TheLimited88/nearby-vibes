import React, { ReactNode } from 'react';
import { Button } from './Button';
import styles from './MultiStepForm.module.css';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  children: ReactNode;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  currentStep,
  onStepChange,
  children,
  onSubmit,
  isSubmitting = false,
  isValid = true,
}) => {
  const canGoPrevious = currentStep > 0;
  const canGoNext = currentStep < steps.length - 1;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className={styles.progressText}>
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <div className={styles.stepsNav}>
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`${styles.stepItem} ${
              idx <= currentStep ? styles.completed : ''
            } ${idx === currentStep ? styles.active : ''}`}
            onClick={() => onStepChange(idx)}
          >
            <div className={styles.stepNumber}>{idx + 1}</div>
            <div className={styles.stepLabel}>{step.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.stepTitle}>
        <h2>{steps[currentStep].label}</h2>
        {steps[currentStep].description && (
          <p className={styles.stepDesc}>{steps[currentStep].description}</p>
        )}
      </div>

      <div className={styles.content}>{children}</div>

      <div className={styles.actions}>
        <Button
          variant="outline"
          onClick={() => onStepChange(currentStep - 1)}
          disabled={!canGoPrevious}
        >
          Previous
        </Button>

        {isLastStep ? (
          <Button
            onClick={onSubmit}
            isLoading={isSubmitting}
            disabled={!isValid || isSubmitting}
          >
            Publish Post
          </Button>
        ) : (
          <Button
            onClick={() => onStepChange(currentStep + 1)}
            disabled={!canGoNext || !isValid}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
