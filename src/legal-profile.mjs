// Central legal/business details. Fill verified information and obtain approval
// from Ahmed BEFORE switching from a preview to the public production domain.
export const LEGAL_APPROVED=false;
export const LEGAL_LAST_UPDATED='12 november 2026';
export const BUSINESS_DETAILS={
  tradingName:'MetaalMeesters',
  officialName:'Metaalmeesters BV', // Companyweb / Belgian business registers
  streetAndNumber:'Lange Lobroekstraat 58', // registered office, not necessarily showroom
  postalCode:'2060',
  municipality:'Antwerpen',
  enterpriseNumber:'1035.390.965',
  vatNumber:'BE 1035.390.965',
  email:'info@metaalmeesters.eu',
  phone:'+32 472 86 48 88',
  telephoneHref:'+32472864888',
  // Requires verification after the real infrastructure is connected:
  retentionPolicyConfirmed:false,
  hostingContractsReviewed:false,
  externalServicesReviewed:false
};
export const isLegalPage=route=>['privacy','cookies','bedrijfsgegevens'].includes(route);
