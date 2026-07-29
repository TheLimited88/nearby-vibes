import React from 'react';
import { Button } from './Button';
import styles from './PlanCard.module.css';

interface Feature {
  name: string;
  included: boolean;
}

interface PlanCardProps {
  name: string;
  price: number;
  period: string;
  description: string;
  features: Feature[];
  isPopular?: boolean;
  buttonText?: string;
  isCurrentPlan?: boolean;
  onSelect?: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  name,
  price,
  period,
  description,
  features,
  isPopular = false,
  buttonText = 'Select Plan',
  isCurrentPlan = false,
  onSelect,
}) => {
  return (
    <div className={`${styles.card} ${isPopular ? styles.popular : ''}`}>
      {isPopular && <div className={styles.badge}>MOST POPULAR</div>}

      <h3 className={styles.title}>{name}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.pricing}>
        <span className={styles.price}>${price}</span>
        <span className={styles.period}>/{period}</span>
      </div>

      <ul className={styles.features}>
        {features.map((feature, idx) => (
          <li key={idx} className={feature.included ? styles.included : styles.excluded}>
            <span className={styles.icon}>
              {feature.included ? '✓' : '✕'}
            </span>
            <span>{feature.name}</span>
          </li>
        ))}
      </ul>

      <Button
        fullWidth
        variant={isPopular ? 'primary' : 'outline'}
        onClick={onSelect}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? 'CURRENT PLAN' : buttonText}
      </Button>
    </div>
  );
};
