import React from 'react';
import styles from './CategoryCard.module.css';

function CategoryCard({ title, imgSrc }) {
  return (
    <div className={styles.card}>
      <img className={styles.image} src={imgSrc} alt={title} />
      <div className={styles.title}>{title}</div>
    </div>
  );
}

export default CategoryCard;
