const AppConstants = {
  AccountStatus: {
    BLOCKED: 0,
    ACTIVE: 1,
  },
  NewAccountStatus: {
    PENDING: "Pending",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
  },
  CustomerStatus: {
    PENDING: "Pending",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
  },
  ContactStatus: {
    PENDING: "Pending",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
  },
  OpportunityStatus: {
    PENDING: "Pending",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
  },
  ProjectStatus: {
    PENDING: "Pending",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
  },
  QuotStatus: {
    SENT: "Sent",
    COMPLETED: "Completed",
    DRAFT: "Draft",
  },
  InvoiceStatus: {
    PAID: "Paid",
    PENDING: "Pending",
    OVERDUE: "Completed",
    DRAFT: "Draft",
  },
  TaskPriority: {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
  },
  SubTaskStatus: {
    TODO: "Todo",
    ACTIVE: "Active",
    DONE: "Done",
  },
};

module.exports = AppConstants;
