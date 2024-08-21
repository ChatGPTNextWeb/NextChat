import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";
import { getClientConfig } from "../config/client";

const isApp = !!getClientConfig()?.isApp;

const ar: PartialLocaleType = {
  WIP: "قريبًا...",
  Error: {
    Unauthorized: isApp
      ? "تم اكتشاف مفتاح API غير صالح، يرجى الذهاب إلى [الإعدادات](/#/settings) للتحقق من صحة مفتاح API."
      : "كلمة المرور غير صحيحة أو فارغة، يرجى الذهاب إلى [تسجيل الدخول](/#/auth) لإدخال كلمة مرور صحيحة، أو أدخل مفتاح OpenAI API الخاص بك في [الإعدادات](/#/settings).",
  },
  Auth: {
    Title: "تحتاج إلى كلمة مرور",
    Tips: "قام المشرف بتفعيل التحقق بكلمة المرور، يرجى إدخال رمز الوصول أدناه",
    SubTips: "أو إدخال مفتاح API الخاص بـ OpenAI أو Google",
    Input: "أدخل رمز الوصول هنا",
    Confirm: "تأكيد",
    Later: "في وقت لاحق",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} محادثة`,
  },
  Chat: {
    SubTitle: (count: number) => `إجمالي ${count} محادثة`,
    EditMessage: {
      Title: "تحرير سجل الرسائل",
      Topic: {
        Title: "موضوع الدردشة",
        SubTitle: "تغيير موضوع الدردشة الحالي",
      },
    },
    Actions: {
      ChatList: "عرض قائمة الرسائل",
      CompressedHistory: "عرض التاريخ المضغوط",
      Export: "تصدير سجل الدردشة",
      Copy: "نسخ",
      Stop: "إيقاف",
      Retry: "إعادة المحاولة",
      Pin: "تثبيت",
      PinToastContent: "تم تثبيت 1 محادثة في الإشعارات المسبقة",
      PinToastAction: "عرض",
      Delete: "حذف",
      Edit: "تحرير",
    },
    Commands: {
      new: "دردشة جديدة",
      newm: "إنشاء دردشة من القناع",
      next: "الدردشة التالية",
      prev: "الدردشة السابقة",
      clear: "مسح السياق",
      del: "حذف الدردشة",
    },
    InputActions: {
      Stop: "إيقاف الاستجابة",
      ToBottom: "الانتقال إلى الأحدث",
      Theme: {
        auto: "موضوع تلقائي",
        light: "الوضع الفاتح",
        dark: "الوضع الداكن",
      },
      Prompt: "الأوامر السريعة",
      Masks: "جميع الأقنعة",
      Clear: "مسح الدردشة",
      Settings: "إعدادات الدردشة",
      UploadImage: "تحميل صورة",
    },
    Rename: "إعادة تسمية الدردشة",
    Typing: "يكتب…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} إرسال`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "، Shift + Enter لإدراج سطر جديد";
      }
      return inputHints + "، / لتفعيل الإكمال التلقائي، : لتفعيل الأوامر";
    },
    Send: "إرسال",
    Config: {
      Reset: "مسح الذاكرة",
      SaveAs: "حفظ كقناع",
    },
    IsContext: "الإشعارات المسبقة",
  },
  Export: {
    Title: "مشاركة سجل الدردشة",
    Copy: "نسخ الكل",
    Download: "تحميل الملف",
    Share: "مشاركة على ShareGPT",
    MessageFromYou: "المستخدم",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "تنسيق التصدير",
      SubTitle: "يمكنك تصدير النص كـ Markdown أو صورة PNG",
    },
    IncludeContext: {
      Title: "تضمين سياق القناع",
      SubTitle: "هل تريد عرض سياق القناع في الرسائل",
    },
    Steps: {
      Select: "اختيار",
      Preview: "معاينة",
    },
    Image: {
      Toast: "يتم إنشاء لقطة الشاشة",
      Modal: "اضغط مطولاً أو انقر بزر الماوس الأيمن لحفظ الصورة",
    },
  },
  Select: {
    Search: "بحث في الرسائل",
    All: "تحديد الكل",
    Latest: "أحدث الرسائل",
    Clear: "مسح التحديد",
  },
  Memory: {
    Title: "ملخص التاريخ",
    EmptyContent: "محتوى المحادثة قصير جداً، لا حاجة للتلخيص",
    Send: "ضغط تلقائي لسجل الدردشة كـ سياق",
    Copy: "نسخ الملخص",
    Reset: "[غير مستخدم]",
    ResetConfirm: "تأكيد مسح ملخص التاريخ؟",
  },
  Home: {
    NewChat: "دردشة جديدة",
    DeleteChat: "تأكيد حذف المحادثة المحددة؟",
    DeleteToast: "تم حذف المحادثة",
    Revert: "تراجع",
  },
  Settings: {
    Title: "الإعدادات",
    SubTitle: "جميع خيارات الإعدادات",

    Danger: {
      Reset: {
        Title: "إعادة تعيين جميع الإعدادات",
        SubTitle: "إعادة تعيين جميع عناصر الإعدادات إلى القيم الافتراضية",
        Action: "إعادة التعيين الآن",
        Confirm: "تأكيد إعادة تعيين جميع الإعدادات؟",
      },
      Clear: {
        Title: "مسح جميع البيانات",
        SubTitle: "مسح جميع الدردشات وبيانات الإعدادات",
        Action: "مسح الآن",
        Confirm: "تأكيد مسح جميع الدردشات وبيانات الإعدادات؟",
      },
    },
    Lang: {
      Name: "Language", // انتبه: إذا كنت ترغب في إضافة ترجمة جديدة، يرجى عدم ترجمة هذه القيمة، اتركها كما هي "Language"
      All: "جميع اللغات",
    },
    Avatar: "الصورة الشخصية",
    FontSize: {
      Title: "حجم الخط",
      SubTitle: "حجم الخط في محتوى الدردشة",
    },
    FontFamily: {
      Title: "خط الدردشة",
      SubTitle: "خط محتوى الدردشة، اتركه فارغًا لتطبيق الخط الافتراضي العالمي",
      Placeholder: "اسم الخط",
    },
    InjectSystemPrompts: {
      Title: "حقن الرسائل النصية النظامية",
      SubTitle:
        "فرض إضافة رسالة نظامية تحاكي ChatGPT في بداية قائمة الرسائل لكل طلب",
    },
    InputTemplate: {
      Title: "معالجة الإدخال من قبل المستخدم",
      SubTitle: "سيتم ملء آخر رسالة من المستخدم في هذا القالب",
    },

    Update: {
      Version: (x: string) => `الإصدار الحالي: ${x}`,
      IsLatest: "أنت على أحدث إصدار",
      CheckUpdate: "التحقق من التحديثات",
      IsChecking: "جارٍ التحقق من التحديثات...",
      FoundUpdate: (x: string) => `تم العثور على إصدار جديد: ${x}`,
      GoToUpdate: "انتقل للتحديث",
    },
    SendKey: "زر الإرسال",
    Theme: "السمة",
    TightBorder: "وضع بدون حدود",
    SendPreviewBubble: {
      Title: "فقاعة المعاينة",
      SubTitle: "معاينة محتوى Markdown في فقاعة المعاينة",
    },
    AutoGenerateTitle: {
      Title: "توليد العنوان تلقائيًا",
      SubTitle: "توليد عنوان مناسب بناءً على محتوى الدردشة",
    },
    Sync: {
      CloudState: "بيانات السحابة",
      NotSyncYet: "لم يتم التزامن بعد",
      Success: "تم التزامن بنجاح",
      Fail: "فشل التزامن",

      Config: {
        Modal: {
          Title: "تكوين التزامن السحابي",
          Check: "التحقق من التوفر",
        },
        SyncType: {
          Title: "نوع التزامن",
          SubTitle: "اختر خادم التزامن المفضل",
        },
        Proxy: {
          Title: "تفعيل الوكيل",
          SubTitle: "يجب تفعيل الوكيل عند التزامن عبر المتصفح لتجنب قيود CORS",
        },
        ProxyUrl: {
          Title: "عنوان الوكيل",
          SubTitle: "ينطبق فقط على الوكيل المتاح في هذا المشروع",
        },

        WebDav: {
          Endpoint: "عنوان WebDAV",
          UserName: "اسم المستخدم",
          Password: "كلمة المرور",
        },

        UpStash: {
          Endpoint: "رابط UpStash Redis REST",
          UserName: "اسم النسخ الاحتياطي",
          Password: "رمز UpStash Redis REST",
        },
      },

      LocalState: "بيانات محلية",
      Overview: (overview: any) => {
        return `${overview.chat} دردشة، ${overview.message} رسالة، ${overview.prompt} إشعار، ${overview.mask} قناع`;
      },
      ImportFailed: "فشل الاستيراد",
    },
    Mask: {
      Splash: {
        Title: "صفحة بدء القناع",
        SubTitle: "عرض صفحة بدء القناع عند بدء دردشة جديدة",
      },
      Builtin: {
        Title: "إخفاء الأقنعة المدمجة",
        SubTitle: "إخفاء الأقنعة المدمجة في قائمة الأقنعة",
      },
    },
    Prompt: {
      Disable: {
        Title: "تعطيل الإكمال التلقائي للإشعارات",
        SubTitle: "استخدم / في بداية مربع النص لتفعيل الإكمال التلقائي",
      },
      List: "قائمة الإشعارات المخصصة",
      ListCount: (builtin: number, custom: number) =>
        `مدمج ${builtin} إشعار، مخصص ${custom} إشعار`,
      Edit: "تحرير",
      Modal: {
        Title: "قائمة الإشعارات",
        Add: "جديد",
        Search: "بحث عن إشعارات",
      },
      EditModal: {
        Title: "تحرير الإشعارات",
      },
    },
    HistoryCount: {
      Title: "عدد الرسائل التاريخية المرفقة",
      SubTitle: "عدد الرسائل التاريخية المرفقة مع كل طلب",
    },
    CompressThreshold: {
      Title: "عتبة ضغط طول الرسائل التاريخية",
      SubTitle:
        "عندما يتجاوز طول الرسائل التاريخية غير المضغوطة هذه القيمة، سيتم الضغط",
    },

    Usage: {
      Title: "التحقق من الرصيد",
      SubTitle(used: any, total: any) {
        return `تم استخدام $${used} هذا الشهر، إجمالي الاشتراك $${total}`;
      },
      IsChecking: "جارٍ التحقق...",
      Check: "إعادة التحقق",
      NoAccess: "أدخل مفتاح API أو كلمة مرور للوصول إلى الرصيد",
    },

    Access: {
      AccessCode: {
        Title: "كلمة المرور للوصول",
        SubTitle: "قام المشرف بتمكين الوصول المشفر",
        Placeholder: "أدخل كلمة المرور للوصول",
      },
      CustomEndpoint: {
        Title: "واجهة مخصصة",
        SubTitle: "هل تستخدم خدمة Azure أو OpenAI مخصصة",
      },
      Provider: {
        Title: "موفر الخدمة النموذجية",
        SubTitle: "التبديل بين مقدمي الخدمة المختلفين",
      },
      OpenAI: {
        ApiKey: {
          Title: "مفتاح API",
          SubTitle: "استخدم مفتاح OpenAI مخصص لتجاوز قيود كلمة المرور",
          Placeholder: "مفتاح OpenAI API",
        },

        Endpoint: {
          Title: "عنوان الواجهة",
          SubTitle: "يجب أن يحتوي على http(s):// بخلاف العنوان الافتراضي",
        },
      },
      Azure: {
        ApiKey: {
          Title: "مفتاح الواجهة",
          SubTitle: "استخدم مفتاح Azure مخصص لتجاوز قيود كلمة المرور",
          Placeholder: "مفتاح Azure API",
        },

        Endpoint: {
          Title: "عنوان الواجهة",
          SubTitle: "مثال:",
        },

        ApiVerion: {
          Title: "إصدار الواجهة (azure api version)",
          SubTitle: "اختر إصدارًا معينًا",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "مفتاح الواجهة",
          SubTitle: "استخدم مفتاح Anthropic مخصص لتجاوز قيود كلمة المرور",
          Placeholder: "مفتاح Anthropic API",
        },

        Endpoint: {
          Title: "عنوان الواجهة",
          SubTitle: "مثال:",
        },

        ApiVerion: {
          Title: "إصدار الواجهة (claude api version)",
          SubTitle: "اختر إصدار API محدد",
        },
      },
      Google: {
        ApiKey: {
          Title: "مفتاح API",
          SubTitle: "احصل على مفتاح API الخاص بك من Google AI",
          Placeholder: "أدخل مفتاح Google AI Studio API",
        },

        Endpoint: {
          Title: "عنوان النهاية",
          SubTitle: "مثال:",
        },

        ApiVersion: {
          Title: "إصدار API (مخصص لـ gemini-pro)",
          SubTitle: "اختر إصدار API معين",
        },
        GoogleSafetySettings: {
          Title: "مستوى تصفية الأمان من Google",
          SubTitle: "تعيين مستوى تصفية المحتوى",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "مفتاح API",
          SubTitle: "استخدم مفتاح Baidu API مخصص",
          Placeholder: "مفتاح Baidu API",
        },
        SecretKey: {
          Title: "المفتاح السري",
          SubTitle: "استخدم مفتاح Baidu Secret مخصص",
          Placeholder: "مفتاح Baidu Secret",
        },
        Endpoint: {
          Title: "عنوان الواجهة",
          SubTitle: "لا يدعم التخصيص، انتقل إلى .env للتكوين",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "مفتاح الواجهة",
          SubTitle: "استخدم مفتاح ByteDance API مخصص",
          Placeholder: "مفتاح ByteDance API",
        },
        Endpoint: {
          Title: "عنوان الواجهة",
          SubTitle: "مثال:",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "مفتاح الواجهة",
          SubTitle: "استخدم مفتاح Alibaba Cloud API مخصص",
          Placeholder: "مفتاح Alibaba Cloud API",
        },
        Endpoint: {
          Title: "عنوان الواجهة",
          SubTitle: "مثال:",
        },
      },
      CustomModel: {
        Title: "اسم النموذج المخصص",
        SubTitle: "أضف خيارات نموذج مخصص، مفصولة بفواصل إنجليزية",
      },
    },

    Model: "النموذج",
    Temperature: {
      Title: "العشوائية (temperature)",
      SubTitle: "كلما زادت القيمة، زادت العشوائية في الردود",
    },
    TopP: {
      Title: "عينات النواة (top_p)",
      SubTitle: "مشابه للعشوائية ولكن لا تغيره مع العشوائية",
    },
    MaxTokens: {
      Title: "حد أقصى للرموز لكل رد (max_tokens)",
      SubTitle: "أقصى عدد للرموز في تفاعل واحد",
    },
    PresencePenalty: {
      Title: "تجدد الموضوع (presence_penalty)",
      SubTitle: "كلما زادت القيمة، زادت احتمالية التوسع في مواضيع جديدة",
    },
    FrequencyPenalty: {
      Title: "عقوبة التكرار (frequency_penalty)",
      SubTitle: "كلما زادت القيمة، زادت احتمالية تقليل تكرار الكلمات",
    },
  },
  Store: {
    DefaultTopic: "دردشة جديدة",
    BotHello: "كيف يمكنني مساعدتك؟",
    Error: "حدث خطأ، يرجى المحاولة مرة أخرى لاحقًا",
    Prompt: {
      History: (content: string) =>
        "هذا ملخص للدردشة السابقة كنقطة انطلاق: " + content,
      Topic:
        "استخدم أربع إلى خمس كلمات لإرجاع ملخص مختصر لهذه الجملة، بدون شرح، بدون علامات ترقيم، بدون كلمات تعبيرية، بدون نص إضافي، بدون تنسيق عريض، إذا لم يكن هناك موضوع، يرجى العودة إلى 'دردشة عامة'",
      Summarize:
        "قم بتلخيص محتوى الدردشة باختصار، لاستخدامه كإشارة سياقية لاحقة، اجعلها في حدود 200 كلمة",
    },
  },
  Copy: {
    Success: "تم الكتابة إلى الحافظة",
    Failed: "فشل النسخ، يرجى منح أذونات الحافظة",
  },
  Download: {
    Success: "تم تنزيل المحتوى إلى مجلدك.",
    Failed: "فشل التنزيل.",
  },
  Context: {
    Toast: (x: any) => `يحتوي على ${x} إشعارات مخصصة`,
    Edit: "إعدادات الدردشة الحالية",
    Add: "إضافة دردشة جديدة",
    Clear: "تم مسح السياق",
    Revert: "استعادة السياق",
  },
  Plugin: {
    Name: "الإضافات",
  },
  FineTuned: {
    Sysmessage: "أنت مساعد",
  },
  SearchChat: {
    Name: "بحث",
    Page: {
      Title: "البحث في سجلات الدردشة",
      Search: "أدخل كلمات البحث",
      NoResult: "لم يتم العثور على نتائج",
      NoData: "لا توجد بيانات",
      Loading: "جارٍ التحميل",

      SubTitle: (count: number) => `تم العثور على ${count} نتائج`,
    },
    Item: {
      View: "عرض",
    },
  },
  Mask: {
    Name: "القناع",
    Page: {
      Title: "أقنعة الأدوار المخصصة",
      SubTitle: (count: number) => `${count} تعريف لدور مخصص`,
      Search: "بحث عن قناع الدور",
      Create: "إنشاء جديد",
    },
    Item: {
      Info: (count: number) => `يحتوي على ${count} محادثات مخصصة`,
      Chat: "الدردشة",
      View: "عرض",
      Edit: "تحرير",
      Delete: "حذف",
      DeleteConfirm: "تأكيد الحذف؟",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `تحرير القناع المخصص ${readonly ? " (للقراءة فقط)" : ""}`,
      Download: "تنزيل القناع المخصص",
      Clone: "استنساخ القناع",
    },
    Config: {
      Avatar: "صورة الدور",
      Name: "اسم الدور",
      Sync: {
        Title: "استخدام الإعدادات العالمية",
        SubTitle: "هل تستخدم الدردشة الحالية الإعدادات العالمية للنموذج",
        Confirm:
          "ستتم الكتابة فوق الإعدادات المخصصة للدردشة الحالية تلقائيًا، تأكيد تفعيل الإعدادات العالمية؟",
      },
      HideContext: {
        Title: "إخفاء المحادثات المخصصة",
        SubTitle: "بعد الإخفاء، لن تظهر المحادثات المخصصة في واجهة الدردشة",
      },
      Share: {
        Title: "مشاركة هذا القناع",
        SubTitle: "إنشاء رابط مباشر لهذا القناع",
        Action: "نسخ الرابط",
      },
    },
  },
  NewChat: {
    Return: "العودة",
    Skip: "بدء الآن",
    NotShow: "عدم العرض مرة أخرى",
    ConfirmNoShow:
      "تأكيد إلغاء العرض؟ بعد الإلغاء، يمكنك إعادة تفعيله في الإعدادات في أي وقت.",
    Title: "اختر قناعًا",
    SubTitle: "ابدأ الآن وتفاعل مع الأفكار خلف القناع",
    More: "عرض الكل",
  },

  URLCommand: {
    Code: "تم الكشف عن رمز وصول في الرابط، هل تريد تعبئته تلقائيًا؟",
    Settings: "تم الكشف عن إعدادات مسبقة في الرابط، هل تريد تعبئتها تلقائيًا؟",
  },

  UI: {
    Confirm: "تأكيد",
    Cancel: "إلغاء",
    Close: "إغلاق",
    Create: "إنشاء",
    Edit: "تحرير",
    Export: "تصدير",
    Import: "استيراد",
    Sync: "مزامنة",
    Config: "تكوين",
  },
  Exporter: {
    Description: {
      Title: "فقط الرسائل بعد مسح السياق سيتم عرضها",
    },
    Model: "النموذج",
    Messages: "الرسائل",
    Topic: "الموضوع",
    Time: "الوقت",
  },
};

export default ar;
