enum SingleDepositActionTypes {
  BOTTOM_INFORMATION = 'BOTTOM_INFORMATION',
  TOP_INFORMATION = 'TOP_INFORMATION',
}

enum MonthsMultiplier {
  ONE_MONTH = 1,
  THREE_MONTHS = 2,
  SIX_MONTHS = 3,
  TWELVE_MONTHS = 4,
}

export const { BOTTOM_INFORMATION, TOP_INFORMATION } = SingleDepositActionTypes;
export const { ONE_MONTH, THREE_MONTHS, SIX_MONTHS, TWELVE_MONTHS } =
  MonthsMultiplier;
