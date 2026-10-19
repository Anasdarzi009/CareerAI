const { TCS_DELOITTE_ACCENTURE_CODING } = require('./coding/tcsDeloitteAccenture');
const { LTI_HCL_WIPRO_CODING } = require('./coding/ltiHclWipro');
const { GOOGLE_INFOSYS_CODING } = require('./coding/googleInfosys');
const { ZENSAR_IBM_CODING } = require('./coding/zensarIbm');

const COMPANY_CODING_QUESTIONS = [
    ...TCS_DELOITTE_ACCENTURE_CODING,
    ...LTI_HCL_WIPRO_CODING,
    ...GOOGLE_INFOSYS_CODING,
    ...ZENSAR_IBM_CODING
];

module.exports = { COMPANY_CODING_QUESTIONS };
