import { SubmitKey } from "../store/config";

import type { PartialLocaleType } from "./index";

const ko: PartialLocaleType = {
  WIP: "곧 출시 예정...",
  Error: {
    Unauthorized:
      "권한이 없습니다. 설정 페이지에서 액세스 코드를 [입력하세요](/#/auth).",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count}개의 메시지`,
  },
  Chat: {
    SubTitle: (count: number) => `ChatGPT와의 ${count}개의 메시지`,
    Actions: {
      ChatList: "채팅 목록으로 이동",
      CompressedHistory: "압축된 기억력 메모리 프롬프트",
      Export: "모든 메시지를 Markdown으로 내보내기",
      Copy: "복사",
      Stop: "중지",
      Retry: "다시 시도",
      Delete: "삭제",
    },
    Rename: "채팅 이름 변경",
    Typing: "입력 중...",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey}를 눌러 보내기`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter로 줄 바꿈";
      }
      return inputHints + ", 프롬프트 검색을 위해 / 입력";
    },
    Send: "보내기",
    Config: {
      Reset: "기본값으로 재설정",
      SaveAs: "마스크로 저장",
    },
  },
  Export: {
    Title: "모든 메시지",
    Copy: "모두 복사",
    Download: "다운로드",
    MessageFromYou: "나의 메시지",
    MessageFromChatGPT: "ChatGPT의 메시지",
  },
  Memory: {
    Title: "기억 프롬프트",
    EmptyContent: "아직 내용이 없습니다.",
    Send: "기억 보내기",
    Copy: "기억 복사",
    Reset: "세션 재설정",
    ResetConfirm:
      "재설정하면 현재 대화 기록과 기억력이 삭제됩니다. 정말 재설정하시겠습니까?",
  },
  Home: {
    NewChat: "새로운 채팅",
    DeleteChat: "선택한 대화를 삭제하시겠습니까?",
    DeleteToast: "채팅이 삭제되었습니다.",
    Revert: "되돌리기",
  },
  Settings: {
    Title: "설정",
    SubTitle: "모든 설정",

    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "All Languages",
    },
    Avatar: "아바타",
    FontSize: {
      Title: "글꼴 크기",
      SubTitle: "채팅 내용의 글꼴 크기 조정",
    },
    FontFamily: {
      Title: "채팅 폰트",
      SubTitle: "채팅 내용의 폰트, 비워 두면 글로벌 기본 폰트를 적용",
      Placeholder: "폰트 이름",
    },
    InjectSystemPrompts: {
      Title: "시스템 프롬프트 주입",
      SubTitle:
        "각 요청의 메시지 목록의 시작에 ChatGPT 시스템 프롬프트를 강제로 추가합니다",
    },
    Update: {
      Version: (x: string) => `버전: ${x}`,
      IsLatest: "최신 버전",
      CheckUpdate: "업데이트 확인",
      IsChecking: "업데이트 확인 중...",
      FoundUpdate: (x: string) => `새 버전 발견: ${x}`,
      GoToUpdate: "업데이트",
    },
    SendKey: "전송 키",
    Theme: "테마",
    TightBorder: "조밀한 테두리",
    SendPreviewBubble: {
      Title: "미리 보기 버블 전송",
      SubTitle: "버블에서 마크다운 미리 보기",
    },
    Mask: {
      Splash: {
        Title: "마스크 시작 화면",
        SubTitle: "새로운 채팅 시작 전에 마스크 시작 화면 표시",
      },
    },
    Prompt: {
      Disable: {
        Title: "자동 완성 비활성화",
        SubTitle: "자동 완성을 활성화하려면 /를 입력하세요.",
      },
      List: "프롬프트 목록",
      ListCount: (builtin: number, custom: number) =>
        `내장 ${builtin}개, 사용자 정의 ${custom}개`,
      Edit: "편집",
      Modal: {
        Title: "프롬프트 목록",
        Add: "추가",
        Search: "프롬프트 검색",
      },
      EditModal: {
        Title: "프롬프트 편집",
      },
    },
    HistoryCount: {
      Title: "첨부된 메시지 수",
      SubTitle: "요청당 첨부된 전송된 메시지 수",
    },
    CompressThreshold: {
      Title: "기록 압축 임계값",
      SubTitle: "미압축 메시지 길이가 임계값을 초과하면 압축됨",
    },

    Usage: {
      Title: "계정 잔액",
      SubTitle(used: any, total: any) {
        return `이번 달 사용액 ${used}, 구독액 ${total}`;
      },
      IsChecking: "확인 중...",
      Check: "확인",
      NoAccess: "잔액 확인을 위해 API 키를 입력하세요.",
    },

    Model: "모델",
    Temperature: {
      Title: "온도 (temperature)",
      SubTitle: "값이 클수록 더 무작위한 출력이 생성됩니다.",
    },
    MaxTokens: {
      Title: "최대 토큰 수 (max_tokens)",
      SubTitle: "입력 토큰과 생성된 토큰의 최대 길이",
    },
    PresencePenalty: {
      Title: "존재 페널티 (presence_penalty)",
      SubTitle: "값이 클수록 새로운 주제에 대해 대화할 가능성이 높아집니다.",
    },
    FrequencyPenalty: {
      Title: "빈도 페널티(frequency penalty)",
      SubTitle: "값이 클수록 같은 줄이 반복될 가능성이 줄어듭니다.",
    },
  },
  Store: {
    DefaultTopic: "새 대화",
    BotHello: "안녕하세요! 오늘 도움이 필요하신가요?",
    Error: "문제가 발생했습니다. 나중에 다시 시도해주세요.",
    Prompt: {
      History: (content: string) =>
        "이것은 AI와 사용자 간의 대화 기록을 요약한 내용입니다: " + content,
      Topic:
        "다음과 같이 대화 내용을 요약하는 4~5단어 제목을 생성해주세요. 따옴표, 구두점, 인용부호, 기호 또는 추가 텍스트를 제거하십시오. 따옴표로 감싸진 부분을 제거하십시오.",
      Summarize:
        "200단어 이내로 저희 토론을 간략히 요약하여 앞으로의 맥락으로 사용할 수 있는 프롬프트로 만들어주세요.",
    },
  },
  Copy: {
    Success: "클립보드에 복사되었습니다.",
    Failed: "복사 실패, 클립보드 접근 권한을 허용해주세요.",
  },
  Context: {
    Toast: (x: any) => `컨텍스트 프롬프트 ${x}개 사용`,
    Edit: "컨텍스트 및 메모리 프롬프트",
    Add: "프롬프트 추가",
  },
  Plugin: {
    Name: "플러그인",
  },
  FineTuned: {
    Sysmessage: "당신은 어시스턴트입니다",
  },
  Mask: {
    Name: "마스크",
    Page: {
      Title: "프롬프트 템플릿",
      SubTitle: (count: number) => `${count}개의 프롬프트 템플릿`,
      Search: "템플릿 검색",
      Create: "생성",
    },
    Item: {
      Info: (count: number) => `${count}개의 프롬프롬프트`,
      Chat: "채팅",
      View: "보기",
      Edit: "편집",
      Delete: "삭제",
      DeleteConfirm: "삭제하시겠습니까?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `프롬프트 템플릿 편집 ${readonly ? "(읽기 전용)" : ""}`,
      Download: "다운로드",
      Clone: "복제",
    },
    Config: {
      Avatar: "봇 아바타",
      Name: "봇 이름",
    },
  },
  NewChat: {
    Return: "돌아가기",
    Skip: "건너뛰기",
    Title: "마스크 선택",
    SubTitle: "마스크 뒤의 영혼과 대화하세요",
    More: "더 보기",
    NotShow: "다시 표시하지 않음",
    ConfirmNoShow:
      "비활성화하시겠습니까? 나중에 설정에서 다시 활성화할 수 있습니다.",
  },

  UI: {
    Confirm: "확인",
    Cancel: "취소",
    Close: "닫기",
    Create: "생성",
    Edit: "편집",
  },
  Exporter: {
    Model: "모델",
    Messages: "메시지",
    Topic: "주제",
    Time: "시간",
  },
};

export default ko;
