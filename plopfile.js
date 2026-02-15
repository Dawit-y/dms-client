export default function (plop) {
  // Helper to capitalize first letter
  plop.setHelper('capitalize', (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  });

  // Helper to uppercase
  plop.setHelper('uppercase', (text) => {
    return text.toUpperCase();
  });

  // Helper to pluralize (simple version)
  plop.setHelper('pluralize', (text) => {
    if (text.endsWith('y')) {
      return text.slice(0, -1) + 'ies';
    }
    return text + 's';
  });

  // Helper to check equality
  plop.setHelper('eq', function (a, b) {
    return a === b;
  });

  // Helper to check not equal
  plop.setHelper('ne', function (a, b) {
    return a !== b;
  });

  // Helper to get field type for Yup validation
  plop.setHelper('yupType', (type) => {
    const typeMap = {
      Number: 'number',
      String: 'string',
      Boolean: 'boolean',
      Date: 'date',
    };
    return typeMap[type] || 'string';
  });

  // Helper to get form component based on type
  plop.setHelper('formComponent', (type, fieldId, label) => {
    const componentMap = {
      Number: `            <NumberField
              formik={formik}
              fieldId={'${fieldId}'}
              label={t('${label}')}
            />`,
      Select: `            <AsyncSelectField
              formik={formik}
              fieldId={'${fieldId}'}
              label={t('${label}')}
              // TODO: Add options for this select field
            />`,
      Boolean: `            <Input
              type="checkbox"
              formik={formik}
              fieldId={'${fieldId}'}
              label={t('${label}')}
            />`,
      Date: `            <Input
              type="date"
              formik={formik}
              fieldId={'${fieldId}'}
              label={t('${label}')}
            />`,
      default: `            <Input formik={formik} fieldId={'${fieldId}'} label={t('${label}')} />`,
    };
    return componentMap[type] || componentMap['default'];
  });

  plop.setGenerator('page', {
    description: 'Generate a new page with all components',
    prompts: [
      {
        type: 'input',
        name: 'pageName',
        message: 'What is the page name? (e.g., project, user, role)',
      },
      {
        type: 'input',
        name: 'primaryKey',
        message:
          'What is the primary key field name? (e.g., id, prj_id, emp_pk)',
        default: 'id',
      },
      {
        type: 'input',
        name: 'columns',
        message:
          'Enter columns in format: name:type (e.g., title:String, budget:Number, status:Select, is_active:Boolean)',
      },
    ],
    actions: (data) => {
      const pageName = data.pageName.toLowerCase();
      const capitalizedPageName = plop.getHelper('capitalize')(pageName);
      const pluralPageName = plop.getHelper('pluralize')(pageName);

      // Parse columns with types
      const columnList = data.columns.split(',').map((col) => {
        const [name, type] = col.trim().split(':');
        return {
          name: name.trim(),
          type: type ? type.trim() : 'String',
          label: name.trim().replace(/_/g, ' '),
        };
      });

      data.columns = columnList;

      const actions = [
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/index.jsx',
          templateFile: 'plop-templates/PageIndex.jsx.hbs',
          data: {
            capitalizedPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/columns.jsx',
          templateFile: 'plop-templates/Columns.jsx.hbs',
          data: {
            capitalizedPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/Form.jsx',
          templateFile: 'plop-templates/Form.jsx.hbs',
          data: {
            capitalizedPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/Add{{capitalizedPageName}}.jsx',
          templateFile: 'plop-templates/AddPage.jsx.hbs',
          data: {
            capitalizedPageName,
            pluralPageName,
            pageName,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/Edit{{capitalizedPageName}}.jsx',
          templateFile: 'plop-templates/EditPage.jsx.hbs',
          data: {
            capitalizedPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        // Add these to your actions array in the page generator
        {
          type: 'add',
          path: 'src/queries/{{pageName}}s_query.jsx',
          templateFile: 'plop-templates/Query.jsx.hbs',
          data: {
            capitalizedPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/helpers/{{pageName}}s_helper.js',
          templateFile: 'plop-templates/Helper.js.hbs',
          data: {
            capitalizedPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
      ];

      return actions;
    },
  });
}
