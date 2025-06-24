import React from 'react';
import { useTranslation } from 'react-i18next';

function Documents() {
  const { t } = useTranslation();
  return (
    <div className="page-content">
      <h1>{t('documents')} page</h1>
    </div>
  );
}

export default Documents;
