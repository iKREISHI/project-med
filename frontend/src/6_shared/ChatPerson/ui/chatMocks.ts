// @ts-nocheck
// @ts-nocheck



export const mockMessages = [
  {
    id: "1",
    name: "Иван Иванов",
    messages: [
      { text: "Привет!", time: "10:00", isMe: false, author: "Иван", isRead: true },
      { text: "Здравствуйте!", time: "10:05", isMe: true, author: "Я", isRead: true },
    ],
    unreadCount: 0,
  },
  {
    id: "2",
    name: "Петр Петров",
    messages: [
      { text: "Привет!", time: "10:00", isMe: false, author: "Петр", isRead: false },
      { text: "Здравствуйте!", time: "10:05", isMe: true, author: "Я", isRead: true },
    ],
    unreadCount: 1,
  },
  {
    id: "3",
    name: "Общий чат",
    messages: [
      { text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", time: "10:00", isMe: false, author: "Петр", isRead: true },
      { text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ", time: "10:05", isMe: true, author: "Я", isRead: true },
      { text: "Здравствуйте!", time: "10:05", isMe: true, author: "Я", isRead: true },
      { text: "Здравствуйте!", time: "10:05", isMe: true, author: "Я", isRead: true },
      { text: "Здравствуйте!", time: "10:05", isMe: true, author: "Я", isRead: true },
      { text: "Здравствуйте!", time: "10:05", isMe: true, author: "Я", isRead: true },
      { text: "Здравствуйте!", time: "10:05", isMe: true, author: "Я", isRead: true },
      { text: "Здравствуйте!", time: "10:05", isMe: false, author: "Иван", isRead: false },
    ],
    unreadCount: 1,
  },
];
