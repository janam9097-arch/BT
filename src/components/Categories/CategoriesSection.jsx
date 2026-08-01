import React from 'react';
import CategoryCard from './CategoryCard';
import styles from './CategoriesSection.module.css';
import categories from './categoryData';

function CategoriesSection() {
  return (
    <div className={styles.container}>
      {categories.map((cat) => (
        <div key={cat.title} className={styles.cardWrapper}>
          <CategoryCard title={cat.title} imgSrc={cat.imgSrc} />
        </div>
      ))}
    </div>
  );
}

export default CategoriesSection;
