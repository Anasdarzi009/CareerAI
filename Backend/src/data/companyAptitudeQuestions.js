const { TCS_DELOITTE_ACCENTURE_APTITUDE } = require('./aptitude/tcsDeloitteAccenture');
const { LTI_HCL_WIPRO_APTITUDE } = require('./aptitude/ltiHclWipro');
const { GOOGLE_INFOSYS_APTITUDE } = require('./aptitude/googleInfosys');
const { ZENSAR_IBM_APTITUDE } = require('./aptitude/zensarIbm');

const COMPANY_APTITUDE_QUESTIONS = [
  ...TCS_DELOITTE_ACCENTURE_APTITUDE,
  ...LTI_HCL_WIPRO_APTITUDE,
  ...GOOGLE_INFOSYS_APTITUDE,
  ...ZENSAR_IBM_APTITUDE
];

module.exports = { COMPANY_APTITUDE_QUESTIONS };
