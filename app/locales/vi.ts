import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";
import { getClientConfig } from "../config/client";
import { SAAS_CHAT_UTM_URL } from "@/app/constant";
const isApp = !!getClientConfig()?.isApp;

const vi: PartialLocaleType = {
  WIP: "Sắp ra mắt...",
  Error: {
    Unauthorized: isApp
      ? `😆 Cuộc trò chuyện gặp một số vấn đề, đừng lo lắng:
    \\ 1️⃣ Nếu bạn muốn bắt đầu mà không cần cấu hình, [nhấp vào đây để bắt đầu trò chuyện ngay lập tức 🚀](${SAAS_CHAT_UTM_URL})
    \\ 2️⃣ Nếu bạn muốn sử dụng tài nguyên OpenAI của riêng mình, hãy nhấp [vào đây](/#/settings) để thay đổi cài đặt ⚙️`
      : `😆 Cuộc trò chuyện gặp một số vấn đề, đừng lo lắng:
    \ 1️⃣ Nếu bạn muốn bắt đầu mà không cần cấu hình, [nhấp vào đây để bắt đầu trò chuyện ngay lập tức 🚀](${SAAS_CHAT_UTM_URL})
    \ 2️⃣ Nếu bạn đang sử dụng phiên bản triển khai riêng, hãy nhấp [vào đây](/#/auth) để nhập khóa truy cập 🔑
    \ 3️⃣ Nếu bạn muốn sử dụng tài nguyên OpenAI của riêng mình, hãy nhấp [vào đây](/#/settings) để thay đổi cài đặt ⚙️
 `,
  },
  Auth: {
    Title: "Cần mật khẩu",
    Tips: "Quản trị viên đã bật xác thực mật khẩu, vui lòng nhập mã truy cập ở dưới",
    SubTips: "Hoặc nhập khóa API OpenAI hoặc Google của bạn",
    Input: "Nhập mã truy cập tại đây",
    Confirm: "Xác nhận",
    Later: "Để sau",
    Return: "Trở lại",
    SaasTips: "Cấu hình quá phức tạp, tôi muốn sử dụng ngay lập tức",
    TopTips:
      "🥳 Ưu đãi ra mắt NextChat AI, mở khóa OpenAI o1, GPT-4o, Claude-3.5 và các mô hình lớn mới nhất ngay bây giờ",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} cuộc trò chuyện`,
  },
  Chat: {
    SubTitle: (count: number) => `Tổng cộng ${count} cuộc trò chuyện`,
    EditMessage: {
      Title: "Chỉnh sửa ghi chép tin nhắn",
      Topic: {
        Title: "Chủ đề trò chuyện",
        SubTitle: "Thay đổi chủ đề trò chuyện hiện tại",
      },
    },
    Actions: {
      ChatList: "Xem danh sách tin nhắn",
      CompressedHistory: "Xem lịch sử Prompt đã nén",
      Export: "Xuất khẩu ghi chép trò chuyện",
      Copy: "Sao chép",
      Stop: "Dừng lại",
      Retry: "Thử lại",
      Pin: "Ghim",
      PinToastContent: "Đã ghim 1 cuộc trò chuyện vào lời nhắc đã đặt sẵn",
      PinToastAction: "Xem",
      Delete: "Xóa",
      Edit: "Chỉnh sửa",
      RefreshTitle: "Làm mới tiêu đề",
      RefreshToast: "Đã gửi yêu cầu làm mới tiêu đề",
    },
    Commands: {
      new: "Tạo cuộc trò chuyện mới",
      newm: "Tạo cuộc trò chuyện từ mặt nạ",
      next: "Cuộc trò chuyện tiếp theo",
      prev: "Cuộc trò chuyện trước đó",
      clear: "Xóa ngữ cảnh",
      del: "Xóa cuộc trò chuyện",
    },
    InputActions: {
      Stop: "Dừng phản hồi",
      ToBottom: "Cuộn đến tin nhắn mới nhất",
      Theme: {
        auto: "Chủ đề tự động",
        light: "Chế độ sáng",
        dark: "Chế độ tối",
      },
      Prompt: "Lệnh tắt",
      Masks: "Tất cả mặt nạ",
      Clear: "Xóa cuộc trò chuyện",
      Settings: "Cài đặt trò chuyện",
      UploadImage: "Tải lên hình ảnh",
    },
    Rename: "Đổi tên cuộc trò chuyện",
    Typing: "Đang nhập…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} gửi`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "，Shift + Enter xuống dòng";
      }
      return inputHints + "，/ kích hoạt hoàn chỉnh, : kích hoạt lệnh";
    },
    Send: "Gửi",
    Config: {
      Reset: "Xóa trí nhớ",
      SaveAs: "Lưu dưới dạng mặt nạ",
    },
    IsContext: "Lời nhắc đã đặt sẵn",
  },
  Export: {
    Title: "Chia sẻ ghi chép trò chuyện",
    Copy: "Sao chép tất cả",
    Download: "Tải xuống tệp",
    Share: "Chia sẻ lên ShareGPT",
    MessageFromYou: "Người dùng",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "Định dạng xuất khẩu",
      SubTitle: "Có thể xuất khẩu dưới dạng văn bản Markdown hoặc hình ảnh PNG",
    },
    IncludeContext: {
      Title: "Bao gồm ngữ cảnh mặt nạ",
      SubTitle: "Có hiển thị ngữ cảnh mặt nạ trong tin nhắn không",
    },
    Steps: {
      Select: "Chọn",
      Preview: "Xem trước",
    },
    Image: {
      Toast: "Đang tạo ảnh chụp màn hình",
      Modal: "Nhấn giữ hoặc nhấp chuột phải để lưu hình ảnh",
    },
  },
  Select: {
    Search: "Tìm kiếm tin nhắn",
    All: "Chọn tất cả",
    Latest: "Một vài tin nhắn gần đây",
    Clear: "Xóa lựa chọn",
  },
  Memory: {
    Title: "Tóm tắt lịch sử",
    EmptyContent: "Nội dung trò chuyện quá ngắn, không cần tóm tắt",
    Send: "Tự động nén ghi chép trò chuyện và gửi dưới dạng ngữ cảnh",
    Copy: "Sao chép tóm tắt",
    Reset: "[unused]",
    ResetConfirm: "Xác nhận xóa tóm tắt lịch sử?",
  },
  Home: {
    NewChat: "Cuộc trò chuyện mới",
    DeleteChat: "Xác nhận xóa cuộc trò chuyện đã chọn?",
    DeleteToast: "Đã xóa cuộc trò chuyện",
    Revert: "Hoàn tác",
  },
  Settings: {
    Title: "Cài đặt",
    SubTitle: "Tất cả các tùy chọn cài đặt",

    Danger: {
      Reset: {
        Title: "Đặt lại tất cả cài đặt",
        SubTitle: "Đặt lại tất cả các mục cài đặt về giá trị mặc định",
        Action: "Đặt lại ngay",
        Confirm: "Xác nhận đặt lại tất cả cài đặt?",
      },
      Clear: {
        Title: "Xóa tất cả dữ liệu",
        SubTitle: "Xóa tất cả các cuộc trò chuyện và dữ liệu cài đặt",
        Action: "Xóa ngay",
        Confirm: "Xác nhận xóa tất cả cuộc trò chuyện và dữ liệu cài đặt?",
      },
    },
    Lang: {
      Name: "Language", // CHÚ Ý: nếu bạn muốn thêm một bản dịch mới, vui lòng không dịch giá trị này, để nó là `Language`
      All: "Tất cả ngôn ngữ",
    },
    Avatar: "Hình đại diện",
    FontSize: {
      Title: "Kích thước chữ",
      SubTitle: "Kích thước chữ của nội dung trò chuyện",
    },
    FontFamily: {
      Title: "Phông Chữ Trò Chuyện",
      SubTitle:
        "Phông chữ của nội dung trò chuyện, để trống để áp dụng phông chữ mặc định toàn cầu",
      Placeholder: "Tên Phông Chữ",
    },
    InjectSystemPrompts: {
      Title: "Tiêm thông báo hệ thống",
      SubTitle:
        "Buộc thêm một thông báo hệ thống giả ChatGPT vào đầu danh sách tin nhắn mỗi lần yêu cầu",
    },
    InputTemplate: {
      Title: "Xử lý đầu vào của người dùng",
      SubTitle: "Tin nhắn mới nhất của người dùng sẽ được điền vào mẫu này",
    },

    Update: {
      Version: (x: string) => `Phiên bản hiện tại: ${x}`,
      IsLatest: "Đã là phiên bản mới nhất",
      CheckUpdate: "Kiểm tra cập nhật",
      IsChecking: "Đang kiểm tra cập nhật...",
      FoundUpdate: (x: string) => `Tìm thấy phiên bản mới: ${x}`,
      GoToUpdate: "Đi đến cập nhật",
    },
    SendKey: "Phím gửi",
    Theme: "Giao diện",
    TightBorder: "Chế độ không viền",
    SendPreviewBubble: {
      Title: "Bong bóng xem trước",
      SubTitle: "Xem nội dung Markdown trong bong bóng xem trước",
    },
    AutoGenerateTitle: {
      Title: "Tự động tạo tiêu đề",
      SubTitle: "Tạo tiêu đề phù hợp dựa trên nội dung cuộc trò chuyện",
    },
    Sync: {
      CloudState: "Dữ liệu đám mây",
      NotSyncYet: "Chưa thực hiện đồng bộ",
      Success: "Đồng bộ thành công",
      Fail: "Đồng bộ thất bại",

      Config: {
        Modal: {
          Title: "Cấu hình đồng bộ đám mây",
          Check: "Kiểm tra khả dụng",
        },
        SyncType: {
          Title: "Loại đồng bộ",
          SubTitle: "Chọn máy chủ đồng bộ ưa thích",
        },
        Proxy: {
          Title: "Kích hoạt proxy",
          SubTitle:
            "Khi đồng bộ qua trình duyệt, cần kích hoạt proxy để tránh hạn chế ngang miền",
        },
        ProxyUrl: {
          Title: "Địa chỉ proxy",
          SubTitle: "Chỉ áp dụng cho proxy ngang miền của dự án này",
        },

        WebDav: {
          Endpoint: "Địa chỉ WebDAV",
          UserName: "Tên người dùng",
          Password: "Mật khẩu",
        },

        UpStash: {
          Endpoint: "URL UpStash Redis REST",
          UserName: "Tên sao lưu",
          Password: "Token UpStash Redis REST",
        },
      },

      LocalState: "Dữ liệu cục bộ",
      Overview: (overview: any) => {
        return `${overview.chat} cuộc trò chuyện, ${overview.message} tin nhắn, ${overview.prompt} lệnh, ${overview.mask} mặt nạ`;
      },
      ImportFailed: "Nhập không thành công",
    },
    Mask: {
      Splash: {
        Title: "Trang khởi động mặt nạ",
        SubTitle: "Hiển thị trang khởi động mặt nạ khi tạo cuộc trò chuyện mới",
      },
      Builtin: {
        Title: "Ẩn mặt nạ tích hợp",
        SubTitle: "Ẩn mặt nạ tích hợp trong danh sách tất cả mặt nạ",
      },
    },
    Prompt: {
      Disable: {
        Title: "Vô hiệu hóa tự động hoàn thành lệnh",
        SubTitle: "Nhập / ở đầu ô nhập để kích hoạt tự động hoàn thành",
      },
      List: "Danh sách lệnh tùy chỉnh",
      ListCount: (builtin: number, custom: number) =>
        `Tích hợp ${builtin} mục, người dùng định nghĩa ${custom} mục`,
      Edit: "Chỉnh sửa",
      Modal: {
        Title: "Danh sách lệnh",
        Add: "Tạo mới",
        Search: "Tìm kiếm lệnh",
      },
      EditModal: {
        Title: "Chỉnh sửa lệnh",
      },
    },
    HistoryCount: {
      Title: "Số tin nhắn lịch sử kèm theo",
      SubTitle: "Số tin nhắn lịch sử kèm theo mỗi yêu cầu",
    },
    CompressThreshold: {
      Title: "Ngưỡng nén tin nhắn lịch sử",
      SubTitle:
        "Khi tin nhắn lịch sử chưa nén vượt quá giá trị này, sẽ thực hiện nén",
    },

    Usage: {
      Title: "Tra cứu số dư",
      SubTitle(used: any, total: any) {
        return `Đã sử dụng trong tháng: $${used}, Tổng số đăng ký: $${total}`;
      },
      IsChecking: "Đang kiểm tra…",
      Check: "Kiểm tra lại",
      NoAccess: "Nhập khóa API hoặc mật khẩu truy cập để xem số dư",
    },

    Access: {
      SaasStart: {
        Title: "Sử dụng NextChat AI",
        Label: "(Giải pháp tiết kiệm chi phí nhất)",
        SubTitle:
          "Được NextChat chính thức duy trì, sẵn sàng sử dụng mà không cần cấu hình, hỗ trợ các mô hình lớn mới nhất như OpenAI o1, GPT-4o và Claude-3.5",
        ChatNow: "Chat ngay",
      },

      AccessCode: {
        Title: "Mật khẩu truy cập",
        SubTitle: "Quản trị viên đã bật truy cập mã hóa",
        Placeholder: "Nhập mật khẩu truy cập",
      },
      CustomEndpoint: {
        Title: "Giao diện tùy chỉnh",
        SubTitle: "Có sử dụng dịch vụ Azure hoặc OpenAI tùy chỉnh không",
      },
      Provider: {
        Title: "Nhà cung cấp dịch vụ mô hình",
        SubTitle: "Chuyển đổi giữa các nhà cung cấp khác nhau",
      },
      OpenAI: {
        ApiKey: {
          Title: "API Key",
          SubTitle:
            "Sử dụng khóa OpenAI tùy chỉnh để vượt qua hạn chế truy cập mật khẩu",
          Placeholder: "Khóa API OpenAI",
        },

        Endpoint: {
          Title: "Địa chỉ giao diện",
          SubTitle: "Ngoài địa chỉ mặc định, phải bao gồm http(s)://",
        },
      },
      Azure: {
        ApiKey: {
          Title: "Khóa giao diện",
          SubTitle:
            "Sử dụng khóa Azure tùy chỉnh để vượt qua hạn chế truy cập mật khẩu",
          Placeholder: "Khóa API Azure",
        },

        Endpoint: {
          Title: "Địa chỉ giao diện",
          SubTitle: "Ví dụ:",
        },

        ApiVerion: {
          Title: "Phiên bản giao diện (phiên bản API azure)",
          SubTitle: "Chọn phiên bản phần cụ thể",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "Khóa giao diện",
          SubTitle:
            "Sử dụng khóa Anthropic tùy chỉnh để vượt qua hạn chế truy cập mật khẩu",
          Placeholder: "Khóa API Anthropic",
        },

        Endpoint: {
          Title: "Địa chỉ giao diện",
          SubTitle: "Ví dụ:",
        },

        ApiVerion: {
          Title: "Phiên bản giao diện (phiên bản API claude)",
          SubTitle: "Chọn một phiên bản API cụ thể để nhập",
        },
      },
      Google: {
        ApiKey: {
          Title: "Khóa API",
          SubTitle: "Lấy khóa API từ Google AI",
          Placeholder: "Nhập khóa API Google AI Studio của bạn",
        },

        Endpoint: {
          Title: "Địa chỉ cuối",
          SubTitle: "Ví dụ:",
        },

        ApiVersion: {
          Title: "Phiên bản API (chỉ áp dụng cho gemini-pro)",
          SubTitle: "Chọn một phiên bản API cụ thể",
        },
        GoogleSafetySettings: {
          Title: "Mức độ lọc an toàn Google",
          SubTitle: "Cài đặt mức độ lọc nội dung",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Sử dụng khóa Baidu API tùy chỉnh",
          Placeholder: "Khóa API Baidu",
        },
        SecretKey: {
          Title: "Secret Key",
          SubTitle: "Sử dụng khóa bí mật Baidu tùy chỉnh",
          Placeholder: "Khóa bí mật Baidu",
        },
        Endpoint: {
          Title: "Địa chỉ giao diện",
          SubTitle: "Không hỗ trợ tùy chỉnh, hãy cấu hình trong .env",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "Khóa giao diện",
          SubTitle: "Sử dụng khóa ByteDance API tùy chỉnh",
          Placeholder: "Khóa API ByteDance",
        },
        Endpoint: {
          Title: "Địa chỉ giao diện",
          SubTitle: "Ví dụ:",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "Khóa giao diện",
          SubTitle: "Sử dụng khóa Alibaba Cloud API tùy chỉnh",
          Placeholder: "Khóa API Alibaba Cloud",
        },
        Endpoint: {
          Title: "Địa chỉ giao diện",
          SubTitle: "Ví dụ:",
        },
      },
      AI302: {
        ApiKey: {
          Title: "Khóa API 302.AI",
          SubTitle: "Sử dụng khóa API 302.AI tùy chỉnh",
          Placeholder: "302.AI API Key",
        },
        Endpoint: {
          Title: "Địa chỉ giao diện",
          SubTitle: "Ví dụ:",
        },
      },
      CustomModel: {
        Title: "Tên mô hình tùy chỉnh",
        SubTitle:
          "Thêm tùy chọn mô hình tùy chỉnh, sử dụng dấu phẩy để phân cách",
      },
    },

    Model: "Mô hình (model)",
    CompressModel: {
      Title: "Mô hình nén",
      SubTitle: "Mô hình được sử dụng để nén lịch sử",
    },
    Temperature: {
      Title: "Độ ngẫu nhiên (temperature)",
      SubTitle: "Giá trị càng lớn, câu trả lời càng ngẫu nhiên",
    },
    TopP: {
      Title: "Lấy mẫu hạt nhân (top_p)",
      SubTitle: "Tương tự như độ ngẫu nhiên, nhưng không thay đổi cùng một lúc",
    },
    MaxTokens: {
      Title: "Giới hạn phản hồi (max_tokens)",
      SubTitle: "Số Token tối đa cho mỗi tương tác",
    },
    PresencePenalty: {
      Title: "Độ mới của chủ đề (presence_penalty)",
      SubTitle:
        "Giá trị càng lớn, khả năng mở rộng đến các chủ đề mới càng cao",
    },
    FrequencyPenalty: {
      Title: "Hình phạt tần suất (frequency_penalty)",
      SubTitle: "Giá trị càng lớn, khả năng giảm từ ngữ lặp lại càng cao",
    },
  },
  Store: {
    DefaultTopic: "Trò chuyện mới",
    BotHello: "Có thể giúp gì cho bạn?",
    Error: "Đã xảy ra lỗi, vui lòng thử lại sau",
    Prompt: {
      History: (content: string) =>
        "Đây là tóm tắt cuộc trò chuyện lịch sử như tiền đề: " + content,
      Topic:
        'Sử dụng bốn đến năm từ để trả lại chủ đề tóm tắt của câu này, không giải thích, không dấu câu, không từ cảm thán, không văn bản thừa, không in đậm, nếu không có chủ đề, hãy trả lại "Tán gẫu"',
      Summarize:
        "Tóm tắt nội dung cuộc trò chuyện một cách ngắn gọn, dùng làm gợi ý ngữ cảnh cho các lần sau, giữ trong vòng 200 từ",
    },
  },
  Copy: {
    Success: "Đã sao chép vào clipboard",
    Failed: "Sao chép thất bại, vui lòng cấp quyền clipboard",
  },
  Download: {
    Success: "Nội dung đã được tải xuống thư mục của bạn.",
    Failed: "Tải xuống thất bại.",
  },
  Context: {
    Toast: (x: any) => `Bao gồm ${x} lệnh gợi ý đã định sẵn`,
    Edit: "Cài đặt cuộc trò chuyện hiện tại",
    Add: "Thêm một cuộc trò chuyện",
    Clear: "Ngữ cảnh đã được xóa",
    Revert: "Khôi phục ngữ cảnh",
  },
  Plugin: {
    Name: "Plugin",
  },
  FineTuned: {
    Sysmessage: "Bạn là một trợ lý",
  },
  SearchChat: {
    Name: "Tìm kiếm",
    Page: {
      Title: "Tìm kiếm lịch sử trò chuyện",
      Search: "Nhập từ khóa tìm kiếm",
      NoResult: "Không tìm thấy kết quả",
      NoData: "Không có dữ liệu",
      Loading: "Đang tải",

      SubTitle: (count: number) => `Tìm thấy ${count} kết quả`,
    },
    Item: {
      View: "Xem",
    },
  },
  Mask: {
    Name: "Mặt nạ",
    Page: {
      Title: "Mặt nạ vai trò đã định sẵn",
      SubTitle: (count: number) => `${count} định nghĩa vai trò đã định sẵn`,
      Search: "Tìm kiếm mặt nạ vai trò",
      Create: "Tạo mới",
    },
    Item: {
      Info: (count: number) => `Bao gồm ${count} cuộc trò chuyện đã định sẵn`,
      Chat: "Trò chuyện",
      View: "Xem",
      Edit: "Chỉnh sửa",
      Delete: "Xóa",
      DeleteConfirm: "Xác nhận xóa?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Chỉnh sửa mặt nạ định sẵn ${readonly ? "(chỉ đọc)" : ""}`,
      Download: "Tải xuống mặt nạ",
      Clone: "Nhân bản mặt nạ",
    },
    Config: {
      Avatar: "Hình đại diện vai trò",
      Name: "Tên vai trò",
      Sync: {
        Title: "Sử dụng cài đặt toàn cục",
        SubTitle:
          "Cuộc trò chuyện hiện tại có sử dụng cài đặt mô hình toàn cục không",
        Confirm:
          "Cài đặt tùy chỉnh của cuộc trò chuyện hiện tại sẽ bị ghi đè tự động, xác nhận bật cài đặt toàn cục?",
      },
      HideContext: {
        Title: "Ẩn cuộc trò chuyện đã định sẵn",
        SubTitle:
          "Sau khi ẩn, cuộc trò chuyện đã định sẵn sẽ không xuất hiện trong giao diện trò chuyện",
      },
      Share: {
        Title: "Chia sẻ mặt nạ này",
        SubTitle: "Tạo liên kết trực tiếp đến mặt nạ này",
        Action: "Sao chép liên kết",
      },
    },
  },
  NewChat: {
    Return: "Trở lại",
    Skip: "Bắt đầu ngay",
    NotShow: "Không hiển thị nữa",
    ConfirmNoShow:
      "Xác nhận vô hiệu hóa? Sau khi vô hiệu hóa, bạn có thể bật lại bất cứ lúc nào trong cài đặt.",
    Title: "Chọn một mặt nạ",
    SubTitle: "Bắt đầu ngay, va chạm với suy nghĩ của linh hồn đứng sau mặt nạ",
    More: "Xem tất cả",
  },

  URLCommand: {
    Code: "Phát hiện mã truy cập trong liên kết, có tự động điền không?",
    Settings:
      "Phát hiện cài đặt định sẵn trong liên kết, có tự động điền không?",
  },

  UI: {
    Confirm: "Xác nhận",
    Cancel: "Hủy",
    Close: "Đóng",
    Create: "Tạo mới",
    Edit: "Chỉnh sửa",
    Export: "Xuất",
    Import: "Nhập",
    Sync: "Đồng bộ",
    Config: "Cấu hình",
  },
  Exporter: {
    Description: {
      Title: "Chỉ tin nhắn sau khi xóa ngữ cảnh mới được hiển thị",
    },
    Model: "Mô hình",
    Messages: "Tin nhắn",
    Topic: "Chủ đề",
    Time: "Thời gian",
  },
};

export default vi;
