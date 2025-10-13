export enum TicketStatusEnum {
  OPEN = 1,
  CLOSED = 2,
  RESOLVED = 3,
}

export const TicketStatusLabels: Record<TicketStatusEnum, string> = {
  [TicketStatusEnum.OPEN]: 'Open',
  [TicketStatusEnum.CLOSED]: 'Closed',
  [TicketStatusEnum.RESOLVED]: 'Resolved',
};
