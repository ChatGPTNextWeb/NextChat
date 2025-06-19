import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";
import { getClientConfig } from "../config/client";
import { SAAS_CHAT_UTM_URL } from "@/app/constant";
const isApp = !!getClientConfig()?.isApp;

const ko: PartialLocaleType = {
  WIP: "곧 출시 예정...",
  Error: {
    Unauthorized: isApp
      ? `😆 대화 중 문제가 발생했습니다, 걱정하지 마세요:
    \\ 1️⃣ 제로 구성으로 시작하고 싶다면, [여기를 클릭하여 즉시 대화를 시작하세요 🚀](${SAAS_CHAT_UTM_URL})
    \\ 2️⃣ 자신의 OpenAI 리소스를 사용하고 싶다면, [여기를 클릭하여](/#/settings) 설정을 수정하세요 ⚙️`
      : `😆 대화 중 문제가 발생했습니다, 걱정하지 마세요:
    \ 1️⃣ 제로 구성으로 시작하고 싶다면, [여기를 클릭하여 즉시 대화를 시작하세요 🚀](${SAAS_CHAT_UTM_URL})
    \ 2️⃣ 개인 배포 버전을 사용하고 있다면, [여기를 클릭하여](/#/auth) 접근 키를 입력하세요 🔑
    \ 3️⃣ 자신의 OpenAI 리소스를 사용하고 싶다면, [여기를 클릭하여](/#/settings) 설정을 수정하세요 ⚙️
 `,
  },
  Auth: {
    Title: "비밀번호 필요",
    Tips: "관리자가 비밀번호 인증을 활성화했습니다. 아래에 접근 코드를 입력하십시오.",
    SubTips: "또는 OpenAI 또는 Google API 키를 입력하십시오.",
    Input: "여기에 접근 코드를 입력하십시오.",
    Confirm: "확인",
    Later: "나중에 하기",
    Return: "돌아가기",
    SaasTips: "설정이 너무 복잡합니다. 즉시 사용하고 싶습니다.",
    TopTips:
      "🥳 NextChat AI 출시 기념 할인, 지금 OpenAI o1, GPT-4o, Claude-3.5 및 최신 대형 모델을 해제하세요",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} 개의 대화`,
  },
  Chat: {
    SubTitle: (count: number) => `총 ${count} 개의 대화`,
    EditMessage: {
      Title: "메시지 기록 편집",
      Topic: {
        Title: "채팅 주제",
        SubTitle: "현재 채팅 주제 변경",
      },
    },
    Actions: {
      ChatList: "메시지 목록 보기",
      CompressedHistory: "압축된 히스토리 프롬프트 보기",
      Export: "채팅 기록 내보내기",
      Copy: "복사",
      Stop: "정지",
      Retry: "다시 시도",
      Pin: "고정",
      PinToastContent: "1 개의 대화를 프롬프트에 고정했습니다.",
      PinToastAction: "보기",
      Delete: "삭제",
      Edit: "편집",
      RefreshTitle: "제목 새로고침",
      RefreshToast: "제목 새로고침 요청이 전송되었습니다",
    },
    Commands: {
      new: "새 채팅",
      newm: "마스크에서 새 채팅",
      next: "다음 채팅",
      prev: "이전 채팅",
      clear: "컨텍스트 지우기",
      del: "채팅 삭제",
    },
    InputActions: {
      Stop: "응답 중지",
      ToBottom: "최신으로 스크롤",
      Theme: {
        auto: "자동 테마",
        light: "라이트 모드",
        dark: "다크 모드",
      },
      Prompt: "빠른 명령",
      Masks: "모든 마스크",
      Clear: "채팅 지우기",
      Settings: "채팅 설정",
      UploadImage: "이미지 업로드",      
      PasteQuestion: "Questions",
      PasteResponse: "Answers",
    },
    Rename: "채팅 이름 변경",
    Typing: "입력 중…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} 전송`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "，Shift + Enter 줄 바꿈";
      }
      return inputHints + "，/ 자동 완성，: 명령어 입력";
    },
    Send: "전송",
    Config: {
      Reset: "기억 지우기",
      SaveAs: "마스크로 저장",
    },
    IsContext: "프롬프트 설정",
  },
  Export: {
    Title: "채팅 기록 공유",
    Copy: "모두 복사",
    Download: "파일 다운로드",
    Share: "ShareGPT에 공유",
    MessageFromYou: "사용자",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "내보내기 형식",
      SubTitle: "Markdown 텍스트 또는 PNG 이미지로 내보낼 수 있습니다.",
    },
    IncludeContext: {
      Title: "프롬프트 컨텍스트 포함",
      SubTitle: "메시지에 프롬프트 컨텍스트를 표시할지 여부",
    },
    Steps: {
      Select: "선택",
      Preview: "미리보기",
    },
    Image: {
      Toast: "스크린샷 생성 중",
      Modal: "길게 누르거나 오른쪽 클릭하여 이미지를 저장하십시오.",
    },
  },
  Select: {
    Search: "메시지 검색",
    All: "모두 선택",
    Latest: "최근 몇 개",
    Clear: "선택 지우기",
  },
  Memory: {
    Title: "기록 요약",
    EmptyContent: "대화 내용이 너무 짧아 요약할 필요 없음",
    Send: "자동으로 채팅 기록을 압축하여 컨텍스트로 전송",
    Copy: "요약 복사",
    Reset: "[사용되지 않음]",
    ResetConfirm: "기록 요약을 지우겠습니까?",
  },
  Home: {
    NewChat: "새 채팅",
    DeleteChat: "선택한 대화를 삭제하시겠습니까?",
    DeleteToast: "대화가 삭제되었습니다.",
    Revert: "되돌리기",
  },
  Settings: {
    Title: "설정",
    SubTitle: "모든 설정 옵션",

    Danger: {
      Reset: {
        Title: "모든 설정 초기화",
        SubTitle: "모든 설정 항목을 기본값으로 초기화",
        Action: "지금 초기화",
        Confirm: "모든 설정을 초기화하시겠습니까?",
      },
      Clear: {
        Title: "모든 데이터 지우기",
        SubTitle: "모든 채팅 및 설정 데이터 지우기",
        Action: "지금 지우기",
        Confirm: "모든 채팅 및 설정 데이터를 지우시겠습니까?",
      },
    },
    Lang: {
      Name: "Language", // 주의: 새 번역을 추가하려면 이 값을 번역하지 말고 그대로 유지하세요.
      All: "모든 언어",
    },
    Avatar: "아바타",
    FontSize: {
      Title: "글꼴 크기",
      SubTitle: "채팅 내용의 글꼴 크기",
    },
    FontFamily: {
      Title: "채팅 폰트",
      SubTitle: "채팅 내용의 폰트, 비워 두면 글로벌 기본 폰트를 적용",
      Placeholder: "폰트 이름",
    },
    InjectSystemPrompts: {
      Title: "시스템 수준 프롬프트 삽입",
      SubTitle:
        "각 요청 메시지 목록의 시작 부분에 ChatGPT 시스템 프롬프트를 강제로 추가",
    },
    InputTemplate: {
      Title: "사용자 입력 전처리",
      SubTitle: "사용자의 최신 메시지가 이 템플릿에 채워집니다.",
    },

    Update: {
      Version: (x: string) => `현재 버전: ${x}`,
      IsLatest: "최신 버전입니다.",
      CheckUpdate: "업데이트 확인",
      IsChecking: "업데이트 확인 중...",
      FoundUpdate: (x: string) => `새 버전 발견: ${x}`,
      GoToUpdate: "업데이트로 이동",
    },
    SendKey: "전송 키",
    Theme: "테마",
    TightBorder: "테두리 없는 모드",
    SendPreviewBubble: {
      Title: "미리보기 버블",
      SubTitle: "미리보기 버블에서 Markdown 콘텐츠 미리보기",
    },
    AutoGenerateTitle: {
      Title: "제목 자동 생성",
      SubTitle: "대화 내용에 따라 적절한 제목 생성",
    },
    Sync: {
      CloudState: "클라우드 데이터",
      NotSyncYet: "아직 동기화되지 않았습니다.",
      Success: "동기화 성공",
      Fail: "동기화 실패",

      Config: {
        Modal: {
          Title: "클라우드 동기화 구성",
          Check: "사용 가능성 확인",
        },
        SyncType: {
          Title: "동기화 유형",
          SubTitle: "선호하는 동기화 서버 선택",
        },
        Proxy: {
          Title: "프록시 사용",
          SubTitle:
            "브라우저에서 동기화할 때 프록시를 활성화하여 교차 출처 제한을 피해야 함",
        },
        ProxyUrl: {
          Title: "프록시 주소",
          SubTitle: "이 프로젝트에서 제공하는 교차 출처 프록시만 해당",
        },

        WebDav: {
          Endpoint: "WebDAV 주소",
          UserName: "사용자 이름",
          Password: "비밀번호",
        },

        UpStash: {
          Endpoint: "UpStash Redis REST URL",
          UserName: "백업 이름",
          Password: "UpStash Redis REST Token",
        },
      },

      LocalState: "로컬 데이터",
      Overview: (overview: any) => {
        return `${overview.chat} 회의 대화, ${overview.message} 개의 메시지, ${overview.prompt} 개의 프롬프트, ${overview.mask} 개의 마스크`;
      },
      ImportFailed: "가져오기 실패",
    },
    Mask: {
      Splash: {
        Title: "마스크 시작 페이지",
        SubTitle: "새 채팅 시 마스크 시작 페이지 표시",
      },
      Builtin: {
        Title: "내장 마스크 숨기기",
        SubTitle: "모든 마스크 목록에서 내장 마스크 숨기기",
      },
    },
    Prompt: {
      Disable: {
        Title: "프롬프트 자동 완성 비활성화",
        SubTitle: "입력 상자 시작 부분에 / 를 입력하여 자동 완성 활성화",
      },
      List: "사용자 정의 프롬프트 목록",
      ListCount: (builtin: number, custom: number) =>
        `내장 ${builtin} 개, 사용자 정의 ${custom} 개`,
      Edit: "편집",
      Modal: {
        Title: "프롬프트 목록",
        Add: "새로 만들기",
        Search: "프롬프트 검색",
      },
      EditModal: {
        Title: "프롬프트 편집",
      },
    },
    HistoryCount: {
      Title: "히스토리 메시지 수",
      SubTitle: "각 요청에 포함된 히스토리 메시지 수",
    },
    CompressThreshold: {
      Title: "히스토리 메시지 길이 압축 임계값",
      SubTitle: "압축되지 않은 히스토리 메시지가 이 값을 초과하면 압축 수행",
    },

    Usage: {
      Title: "잔액 조회",
      SubTitle(used: any, total: any) {
        return `이번 달 사용된 금액: $${used}，총 구독 금액: $${total}`;
      },
      IsChecking: "확인 중...",
      Check: "다시 확인",
      NoAccess: "잔액을 보려면 API 키 또는 접근 비밀번호를 입력하십시오.",
    },

    Access: {
      SaasStart: {
        Title: "NextChat AI 사용하기",
        Label: "(가장 비용 효율적인 솔루션)",
        SubTitle:
          "NextChat에 의해 공식적으로 유지 관리되며, 제로 구성으로 즉시 사용할 수 있으며, OpenAI o1, GPT-4o, Claude-3.5와 같은 최신 대형 모델을 지원합니다",
        ChatNow: "지금 채팅하기",
      },

      AccessCode: {
        Title: "접근 비밀번호",
        SubTitle: "관리자가 암호화된 접근을 활성화했습니다.",
        Placeholder: "접근 비밀번호를 입력하십시오.",
      },
      CustomEndpoint: {
        Title: "커스텀 엔드포인트",
        SubTitle: "커스텀 Azure 또는 OpenAI 서비스를 사용할지 여부",
      },
      Provider: {
        Title: "모델 서비스 제공업체",
        SubTitle: "다른 서비스 제공업체로 전환",
      },
      OpenAI: {
        ApiKey: {
          Title: "API 키",
          SubTitle: "커스텀 OpenAI 키를 사용하여 비밀번호 접근 제한 우회",
          Placeholder: "OpenAI API 키",
        },

        Endpoint: {
          Title: "엔드포인트 주소",
          SubTitle: "기본 주소 외에 http(s)://을 포함해야 함",
        },
      },
      Azure: {
        ApiKey: {
          Title: "엔드포인트 키",
          SubTitle: "커스텀 Azure 키를 사용하여 비밀번호 접근 제한 우회",
          Placeholder: "Azure API 키",
        },

        Endpoint: {
          Title: "엔드포인트 주소",
          SubTitle: "예: ",
        },

        ApiVerion: {
          Title: "API 버전 (azure api version)",
          SubTitle: "특정 부분 버전 선택",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "엔드포인트 키",
          SubTitle: "커스텀 Anthropic 키를 사용하여 비밀번호 접근 제한 우회",
          Placeholder: "Anthropic API 키",
        },

        Endpoint: {
          Title: "엔드포인트 주소",
          SubTitle: "예: ",
        },

        ApiVerion: {
          Title: "API 버전 (claude api version)",
          SubTitle: "특정 API 버전 입력",
        },
      },
      Google: {
        ApiKey: {
          Title: "API 키",
          SubTitle: "Google AI에서 API 키를 가져오세요.",
          Placeholder: "Google AI Studio API 키 입력",
        },

        Endpoint: {
          Title: "엔드포인트 주소",
          SubTitle: "예: ",
        },

        ApiVersion: {
          Title: "API 버전 (gemini-pro 전용)",
          SubTitle: "특정 API 버전 선택",
        },
        GoogleSafetySettings: {
          Title: "Google 안전 필터링 수준",
          SubTitle: "콘텐츠 필터링 수준 설정",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "API 키",
          SubTitle: "커스텀 Baidu API 키 사용",
          Placeholder: "Baidu API 키",
        },
        SecretKey: {
          Title: "Secret 키",
          SubTitle: "커스텀 Baidu Secret 키 사용",
          Placeholder: "Baidu Secret 키",
        },
        Endpoint: {
          Title: "엔드포인트 주소",
          SubTitle: "커스터마이즈는 .env에서 설정",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "엔드포인트 키",
          SubTitle: "커스텀 ByteDance API 키 사용",
          Placeholder: "ByteDance API 키",
        },
        Endpoint: {
          Title: "엔드포인트 주소",
          SubTitle: "예: ",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "엔드포인트 키",
          SubTitle: "커스텀 Alibaba Cloud API 키 사용",
          Placeholder: "Alibaba Cloud API 키",
        },
        Endpoint: {
          Title: "엔드포인트 주소",
          SubTitle: "예: ",
        },
      },
      CustomModel: {
        Title: "커스텀 모델 이름",
        SubTitle: "커스텀 모델 옵션 추가, 영어 쉼표로 구분",
      },
    },

    Model: "모델 (model)",
    CompressModel: {
      Title: "압축 모델",
      SubTitle: "기록을 압축하는 데 사용되는 모델",
    },
    Temperature: {
      Title: "무작위성 (temperature)",
      SubTitle: "값이 클수록 응답이 더 무작위적",
    },
    TopP: {
      Title: "탑 P 샘플링 (top_p)",
      SubTitle: "무작위성과 유사하지만, 무작위성과 함께 변경하지 마십시오.",
    },
    MaxTokens: {
      Title: "단일 응답 제한 (max_tokens)",
      SubTitle: "단일 상호작용에 사용되는 최대 토큰 수",
    },
    PresencePenalty: {
      Title: "주제 신선도 (presence_penalty)",
      SubTitle: "값이 클수록 새로운 주제로 확장할 가능성이 높음",
    },
    FrequencyPenalty: {
      Title: "빈도 벌점 (frequency_penalty)",
      SubTitle: "값이 클수록 중복 단어 감소 가능성 높음",
    },
  },
  Store: {
    DefaultTopic: "새 채팅",
    BotHello: "무엇을 도와드릴까요?",
    Error: "오류가 발생했습니다. 나중에 다시 시도해 주세요.",
    Prompt: {
      History: (content: string) => "이것은 이전 채팅 요약입니다: " + content,
      Topic:
        "네 글자에서 다섯 글자로 이 문장의 간략한 주제를 반환하세요. 설명이나 문장 부호, 어미, 불필요한 텍스트, 굵은 글씨는 필요 없습니다. 주제가 없다면 '잡담'이라고만 반환하세요.",
      Summarize:
        "대화 내용을 간략히 요약하여 후속 컨텍스트 프롬프트로 사용하세요. 200자 이내로 작성하세요.",
    },
  },
  Copy: {
    Success: "클립보드에 복사되었습니다.",
    Failed: "복사 실패, 클립보드 권한을 부여해주세요.",
  },
  Download: {
    Success: "내용이 디렉토리에 다운로드되었습니다.",
    Failed: "다운로드 실패.",
  },
  Context: {
    Toast: (x: any) => ` ${x} 개의 프리셋 프롬프트 포함됨`,
    Edit: "현재 대화 설정",
    Add: "대화 추가",
    Clear: "컨텍스트가 지워졌습니다.",
    Revert: "컨텍스트 복원",
  },
  Plugin: {
    Name: "플러그인",
  },
  FineTuned: {
    Sysmessage: "당신은 보조자입니다.",
  },
  SearchChat: {
    Name: "검색",
    Page: {
      Title: "채팅 기록 검색",
      Search: "검색어 입력",
      NoResult: "결과를 찾을 수 없습니다",
      NoData: "데이터가 없습니다",
      Loading: "로딩 중",

      SubTitle: (count: number) => `${count}개의 결과를 찾았습니다`,
    },
    Item: {
      View: "보기",
    },
  },
  Mask: {
    Name: "마스크",
    Page: {
      Title: "프리셋 캐릭터 마스크",
      SubTitle: (count: number) => `${count} 개의 프리셋 캐릭터 정의`,
      Search: "캐릭터 마스크 검색",
      Create: "새로 만들기",
    },
    Item: {
      Info: (count: number) => ` ${count} 개의 프리셋 대화 포함`,
      Chat: "대화",
      View: "보기",
      Edit: "편집",
      Delete: "삭제",
      DeleteConfirm: "삭제를 확인하시겠습니까?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `프리셋 마스크 편집 ${readonly ? "（읽기 전용）" : ""}`,
      Download: "프리셋 다운로드",
      Clone: "프리셋 복제",
    },
    Config: {
      Avatar: "캐릭터 아바타",
      Name: "캐릭터 이름",
      Sync: {
        Title: "전역 설정 사용",
        SubTitle: "현재 대화가 전역 모델 설정을 사용하는지 여부",
        Confirm:
          "현재 대화의 사용자 정의 설정이 자동으로 덮어쓰여질 것입니다. 전역 설정을 활성화하시겠습니까?",
      },
      HideContext: {
        Title: "프리셋 대화 숨기기",
        SubTitle: "숨기면 프리셋 대화가 채팅 화면에 나타나지 않습니다.",
      },
      Share: {
        Title: "이 마스크 공유하기",
        SubTitle: "이 마스크의 직접 링크 생성",
        Action: "링크 복사",
      },
    },
  },
  NewChat: {
    Return: "돌아가기",
    Skip: "바로 시작",
    NotShow: "다시 보지 않기",
    ConfirmNoShow:
      "비활성화하시겠습니까? 비활성화 후 언제든지 설정에서 다시 활성화할 수 있습니다.",
    Title: "마스크 선택",
    SubTitle: "지금 시작하여 마스크 뒤의 사고와 교류해보세요.",
    More: "모두 보기",
  },

  URLCommand: {
    Code: "링크에 액세스 코드가 포함되어 있습니다. 자동으로 입력하시겠습니까?",
    Settings:
      "링크에 프리셋 설정이 포함되어 있습니다. 자동으로 입력하시겠습니까?",
  },

  UI: {
    Confirm: "확인",
    Cancel: "취소",
    Close: "닫기",
    Create: "새로 만들기",
    Edit: "편집",
    Export: "내보내기",
    Import: "가져오기",
    Sync: "동기화",
    Config: "구성",
  },
  Exporter: {
    Description: {
      Title: "컨텍스트가 지워진 후의 메시지만 표시됩니다.",
    },
    Model: "모델",
    Messages: "메시지",
    Topic: "주제",
    Time: "시간",
  },
};

export default ko;
