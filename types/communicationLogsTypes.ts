export type CommunicationLogsPayloadType = {
  meta: CommunicationLogsMetaType;
  data: CommunicationLogsDataType[];
};

export type CommunicationLogsMetaType = {
  total: number;
  page: number;
  limit: number;
};

export type CommunicationLogsDataType = {
  id: number;
  type: string;
  recipient: string;
  subject: string | null;
  message: string;
  htmlContent: string | null;
  params: string | null;
  status: string;
  error_message: string | null;
  response_data: CommunicationLogsResponseDataType;
  retried_count: number;
  last_attempt_at: string;
  next_retry_at: string | null;
  created_at: string;
  updated_at: string;
  reference_type: string | null;
  reference_id: number | null;
};

export type CommunicationLogsResponseDataType = {
  data: {
    data: [
      {
        otptype: string | null;
        otherurl: string | null;
        messageid: string;
        recipient: string;
        originator: string;
        statuscode: string;
        messagedata: string;
        messagetype: string;
        statusmessage: string;
      }
    ];
    action: string;
  };
  status: number;
};

export type CommunicationLogsResponseType = {
  status: 1 | 0;
  message: string;
  payload: CommunicationLogsPayloadType[];
};