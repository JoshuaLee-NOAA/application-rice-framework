/**
 * JSON Schema Validation Module
 * Validates portfolio data structure before analysis
 */

/**
 * Validate that a value matches the expected type
 */
function validateType(value, expectedType, fieldPath) {
  const actualType = Array.isArray(value) ? 'array' : typeof value;
  
  if (expectedType === 'number') {
    const num = Number(value);
    if (isNaN(num)) {
      return { valid: false, error: `${fieldPath}: Expected number, got '${value}'` };
    }
  } else if (expectedType === 'integer') {
    const num = Number(value);
    if (isNaN(num) || !Number.isInteger(num)) {
      return { valid: false, error: `${fieldPath}: Expected integer, got '${value}'` };
    }
  } else if (expectedType !== actualType) {
    return { valid: false, error: `${fieldPath}: Expected ${expectedType}, got ${actualType}` };
  }
  
  return { valid: true };
}

/**
 * Validate a single application against the schema
 */
export function validateApplicationSchema(app, index) {
  const errors = [];
  const appIdentifier = app['Application'] || `Application at index ${index}`;
  
  // Required string fields
  const requiredStringFields = [
    'Application', 'Program Name', 'Prod URL', 'Public Access?',
    'Technology Stack', 'Product Owner', 'Product Contact',
    'Development Org', 'Hosting Org', 'Purpose'
  ];
  
  requiredStringFields.forEach(field => {
    if (app[field] === undefined || app[field] === null) {
      errors.push(`${appIdentifier}: Missing required field '${field}'`);
    } else if (typeof app[field] !== 'string') {
      errors.push(`${appIdentifier}: Field '${field}' must be a string`);
    }
  });
  
  // Number of Users - must be convertible to number
  if (app['Number of Users'] !== undefined && app['Number of Users'] !== null) {
    const validation = validateType(app['Number of Users'], 'number', `${appIdentifier}.Number of Users`);
    if (!validation.valid) {
      errors.push(validation.error);
    }
  }
  
  // Validate User Metrics if present
  if (app['User Metrics'] !== undefined) {
    if (typeof app['User Metrics'] !== 'object' || Array.isArray(app['User Metrics'])) {
      errors.push(`${appIdentifier}: User Metrics must be an object`);
    } else {
      const metrics = app['User Metrics'];
      
      // Validate numeric fields
      const numericFields = ['External Users', 'Internal Users', 'Number of Regions Served'];
      numericFields.forEach(field => {
        if (metrics[field] !== undefined) {
          const validation = validateType(metrics[field], 'integer', `${appIdentifier}.User Metrics.${field}`);
          if (!validation.valid) {
            errors.push(validation.error);
          }
        }
      });
      
      // Validate Geographic Scope enum
      if (metrics['Geographic Scope'] !== undefined) {
        const validScopes = ['National', 'Regional', 'Local'];
        if (!validScopes.includes(metrics['Geographic Scope'])) {
          errors.push(`${appIdentifier}: User Metrics.Geographic Scope must be one of: ${validScopes.join(', ')}`);
        }
      }
      
      // Validate FMC Coverage is array
      if (metrics['FMC Coverage'] !== undefined && !Array.isArray(metrics['FMC Coverage'])) {
        errors.push(`${appIdentifier}: User Metrics.FMC Coverage must be an array`);
      }
    }
  }
  
  // Validate Mission Metrics if present
  if (app['Mission Metrics'] !== undefined) {
    if (typeof app['Mission Metrics'] !== 'object' || Array.isArray(app['Mission Metrics'])) {
      errors.push(`${appIdentifier}: Mission Metrics must be an object`);
    } else {
      const metrics = app['Mission Metrics'];
      
      // Validate Business Criticality enum
      if (metrics['Business Criticality'] !== undefined) {
        const validTiers = ['Tier 1', 'Tier 2', 'Tier 3'];
        if (!validTiers.includes(metrics['Business Criticality'])) {
          errors.push(`${appIdentifier}: Mission Metrics.Business Criticality must be one of: ${validTiers.join(', ')}`);
        }
      }
      
      // Validate Statutory Requirements is array
      if (metrics['Statutory Requirements'] !== undefined && !Array.isArray(metrics['Statutory Requirements'])) {
        errors.push(`${appIdentifier}: Mission Metrics.Statutory Requirements must be an array`);
      }
      
      // Validate numeric fields
      if (metrics['Downtime Cost Per Hour'] !== undefined) {
        const validation = validateType(metrics['Downtime Cost Per Hour'], 'number', `${appIdentifier}.Mission Metrics.Downtime Cost Per Hour`);
        if (!validation.valid) {
          errors.push(validation.error);
        }
      }
      
      // Validate Compliance Mandates is array if present
      if (metrics['Compliance Mandates'] !== undefined && !Array.isArray(metrics['Compliance Mandates'])) {
        errors.push(`${appIdentifier}: Mission Metrics.Compliance Mandates must be an array`);
      }
    }
  }
  
  // Validate Resource Metrics if present
  if (app['Resource Metrics'] !== undefined) {
    if (typeof app['Resource Metrics'] !== 'object' || Array.isArray(app['Resource Metrics'])) {
      errors.push(`${appIdentifier}: Resource Metrics must be an object`);
    } else {
      const metrics = app['Resource Metrics'];
      
      // Validate numeric fields
      const numericFields = {
        'Annual Hosting Cost': 'number',
        'FTE Dedicated': 'number',
        'Support Tickets Annual': 'integer',
        'Incident Count Annual': 'integer',
        'Tech Stack Age Years': 'integer',
        'Lines of Code': 'integer',
        'Technical Debt Hours': 'integer',
        'Security Vulnerabilities': 'integer'
      };
      
      Object.entries(numericFields).forEach(([field, type]) => {
        if (metrics[field] !== undefined) {
          const validation = validateType(metrics[field], type, `${appIdentifier}.Resource Metrics.${field}`);
          if (!validation.valid) {
            errors.push(validation.error);
          }
        }
      });
      
      // Validate date format for Last Major Update
      if (metrics['Last Major Update'] !== undefined) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(metrics['Last Major Update'])) {
          errors.push(`${appIdentifier}: Resource Metrics.Last Major Update must be in YYYY-MM-DD format`);
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate entire portfolio structure
 */
export function validatePortfolioSchema(data) {
  const errors = [];
  
  // Check if data is an array
  if (!Array.isArray(data)) {
    return {
      valid: false,
      errors: ['Portfolio data must be an array of application objects']
    };
  }
  
  // Check if array is not empty
  if (data.length === 0) {
    return {
      valid: false,
      errors: ['Portfolio data cannot be empty']
    };
  }
  
  // Validate each application
  data.forEach((app, index) => {
    if (typeof app !== 'object' || app === null || Array.isArray(app)) {
      errors.push(`Item at index ${index} must be an object`);
      return;
    }
    
    const validation = validateApplicationSchema(app, index);
    if (!validation.valid) {
      errors.push(...validation.errors);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    totalApplications: data.length,
    validApplications: data.length - errors.length
  };
}

/**
 * Generate schema validation report
 */
export function generateSchemaValidationReport(validation) {
  if (validation.valid) {
    return `✅ Schema Validation: PASSED (${validation.totalApplications} applications)\n`;
  }
  
  let report = '\n';
  report += '═══════════════════════════════════════════════════════════════\n';
  report += '   JSON SCHEMA VALIDATION ERRORS\n';
  report += '═══════════════════════════════════════════════════════════════\n\n';
  report += `❌ Found ${validation.errors.length} schema validation error(s):\n\n`;
  
  validation.errors.forEach((error, index) => {
    report += `${index + 1}. ${error}\n`;
  });
  
  report += '\n';
  report += 'Please fix these structural errors before running analysis.\n';
  report += 'See data/portfolio-template.json for correct data structure.\n';
  report += '═══════════════════════════════════════════════════════════════\n\n';
  
  return report;
}
