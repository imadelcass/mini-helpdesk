export enum TicketPriorityEnum {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export const TicketPriorityLabels: Record<TicketPriorityEnum, string> = {
  [TicketPriorityEnum.LOW]: 'Low',
  [TicketPriorityEnum.MEDIUM]: 'Medium',
  [TicketPriorityEnum.HIGH]: 'High',
};
