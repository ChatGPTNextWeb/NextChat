import { SubmitKey } from "../store/config";
import { PartialLocaleType } from "./index";

const bn: PartialLocaleType = {
  WIP: "শীঘ্রই আসছে...",
  Error: {
    Unauthorized:
      "অননুমোদিত অ্যাক্সেস, অনুগ্রহ করে [অথোরাইজশন](/#/auth) পৃষ্ঠায় অ্যাক্সেস কোড ইনপুট করুন।",
  },
  Auth: {
    Title: "একটি অ্যাক্সেস কোড প্রয়োজন",
    Tips: "নীচে অ্যাক্সেস কোড ইনপুট করুন",
    SubTips: "অথবা আপনার OpenAI API কী প্রবেশ করুন",
    Input: "অ্যাক্সেস কোড",
    Confirm: "নিশ্চিত করুন",
    Later: "পরে",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} টি বার্তা`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} টি বার্তা`,
    Actions: {
      ChatList: "চ্যাট তালিকায় যান",
      CompressedHistory: "সংক্ষিপ্ত ইতিহাস মেমোরি প্রম্পট",
      Export: "সমস্ত বার্তা মার্কডাউন হিসাবে রপ্তানি করুন",
      Copy: "কপি",
      Stop: "বন্ধ করুন",
      Retry: "পুনরায় চেষ্টা করুন",
      Pin: "পিন করুন",
      PinToastContent: "পিন করা হয়েছে ২টি বার্তা প্রম্পটে",
      PinToastAction: "দেখুন",
      Delete: "মুছে ফেলুন",
      Edit: "সম্পাদন করুন",
    },
    Commands: {
      new: "নতুন চ্যাট শুরু করুন",
      newm: "মাস্ক সহ নতুন চ্যাট শুরু করুন",
      next: "পরবর্তী চ্যাট",
      prev: "পূর্ববর্তী চ্যাট",
      clear: "সংশ্লিষ্টতাবদ্ধকরণ পরিষ্কার করুন",
      del: "চ্যাট মুছুন",
    },
    InputActions: {
      Stop: "বন্ধ করুন",
      ToBottom: "সর্বশেষতম দিকে",
      Theme: {
        auto: "অটো",
        light: "হালকা থিম",
        dark: "ডার্ক থিম",
      },
      Prompt: "প্রম্পটগুলিতে",
      Masks: "মাস্কগুলি",
      Clear: "সংশ্লিষ্টতাবদ্ধকরণ পরিষ্কার করুন",
      Settings: "সেটিংস",
    },
    Rename: "চ্যাট পুনঃনামকরণ করুন",
    Typing: "টাইপিং...",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} to send`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter to wrap";
      }
      return inputHints + ", / to search prompts, : to use commands";
    },
    Send: "প্রেরণ করুন",
    Config: {
      Reset: "ডিফল্টে রিসেট করুন",
      SaveAs: "মাস্ক হিসাবে সংরক্ষণ করুন",
    },
  },
  Export: {
    Title: "বার্তা রপ্তানিকরণ",
    Copy: "সমস্তটি কপি করুন",
    Download: "ডাউনলোড করুন",
    MessageFromYou: "আপনার বার্তা",
    MessageFromChatGPT: "চ্যাটজিপিটির বার্তা",
    Share: "শেয়ার করুন শেয়ারজিপিটি তে",
    Format: {
      Title: "রপ্তানি ফরম্যাট",
      SubTitle: "মার্কডাউন বা পিএনজি চিত্র",
    },
    IncludeContext: {
      Title: "মাস্ক অন্তর্ভুক্ত করুন",
      SubTitle: "মাস্কগুলি সংরক্ষণ করবেন না কি",
    },
    Steps: {
      Select: "নির্বাচন করুন",
      Preview: "প্রিভিউ করুন",
    },
  },
  Select: {
    Search: "অনুসন্ধান করুন",
    All: "সমস্তটি নির্বাচন করুন",
    Latest: "সর্বশেষতমটি নির্বাচন করুন",
    Clear: "পরিষ্কার করুন",
  },
  Memory: {
    Title: "মেমোরি প্রম্পট",
    EmptyContent: "এখনও কিছুই নেই।",
    Send: "মেমোরি প্রেরণ করুন",
    Copy: "মেমোরি কপি করুন",
    Reset: "পুনরায় নিশ্চিত করুন",
    ResetConfirm:
      "রিসেট করলে বর্তমান চ্যাট ইতিহাস এবং ঐতিহাসিক মেমোরি মুছে যাবে। পুনরায় নির্দিষ্ট করতে চান তা নিশ্চিত করতে চান?",
  },
  Home: {
    NewChat: "নতুন চ্যাট",
    DeleteChat: "নির্বাচিত সংলাপটি মুছতে নিশ্চিত করুন?",
    DeleteToast: "চ্যাটটি মুছেছেন",
    Revert: "পুনরায়",
  },
  Settings: {
    Title: "সেটিংস",
    SubTitle: "সমস্ত সেটিংস",
    Danger: {
      Reset: {
        Title: "সমস্ত সেটিংস পুনঃনির্দেশ দিন",
        SubTitle: "সকল সেটিংস ডিফল্টে পুনঃনির্দেশ দিতে",
        Action: "পুনঃনির্দেশ দিন",
        Confirm: "সমস্ত সেটিংস ডিফল্টে পুনঃনির্দেশ করতে নিশ্চিত করতে?",
      },
      Clear: {
        Title: "সমস্ত তথ্য মুছুন",
        SubTitle: "সমস্ত বার্তা এবং সেটিংস মুছুন",
        Action: "মুছুন",
        Confirm: "সমস্ত বার্তা এবং সেটিংস মুছে ফেলতে নিশ্চিত করতে?",
      },
    },
    Lang: {
      Name: "বাংলা", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "সমস্ত ভাষা",
    },
    Avatar: "অবতার",
    FontSize: {
      Title: "ফন্ট সাইজ",
      SubTitle: "চ্যাট সামগ্রীর ফন্ট সাইজ সংশোধন করুন",
    },
    FontFamily: {
      Title: "চ্যাট ফন্ট",
      SubTitle:
        "চ্যাট সামগ্রীর ফন্ট, বিশ্বব্যাপী ডিফল্ট ফন্ট প্রয়োগ করতে খালি রাখুন",
      Placeholder: "ফন্টের নাম",
    },
    InjectSystemPrompts: {
      Title: "حقن تلميحات النظام",
      SubTitle:
        "قم بإضافة تلميحة نظام محاكاة ChatGPT إلى بداية قائمة الرسائل المُطلَبة في كل طلب",
    },
    InputTemplate: {
      Title: "ইনপুট টেমপ্লেট",
      SubTitle: "নতুনতম বার্তা এই টেমপ্লেটে পূরণ হবে",
    },

    Update: {
      Version: (x: string) => `Version: ${x}`,
      IsLatest: "Latest version",
      CheckUpdate: "Check Update",
      IsChecking: "Checking update...",
      FoundUpdate: (x: string) => `Found new version: ${x}`,
      GoToUpdate: "Update",
    },
    SendKey: "প্রেরণ চাবি",
    Theme: "থিম",
    TightBorder: "সঙ্গতি সীমা",
    SendPreviewBubble: {
      Title: "প্রিভিউ বুলবুল প্রেরণ করুন",
      SubTitle: "বুলবুলে মার্কডাউন প্রিভিউ করুন",
    },
    Mask: {
      Splash: {
        Title: "মাস্ক স্প্ল্যাশ স্ক্রিন",
        SubTitle:
          "নতুন চ্যাট শুরু করার আগে মাস্ক স্প্ল্যাশ স্ক্রিন প্রদর্শন করুন",
      },
      Builtin: {
        Title: "মূলত মাস্ক গোপন করুন",
        SubTitle: "মাস্ক তালিকা থেকে মূলত মাস্কগুলি লুকান",
      },
    },
    Prompt: {
      Disable: {
        Title: "অটো-সম্পূর্ণতা নিষ্ক্রিয় করুন",
        SubTitle: "অটো-সম্পূর্ণতা চালু করতে / ইনপুট করুন",
      },
      List: "প্রম্পট তালিকা",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} built-in, ${custom} user-defined`,
      Edit: "সম্পাদন করুন",
      Modal: {
        Title: "প্রম্পট তালিকা",
        Add: "একটি যোগ করুন",
        Search: "সন্ধান প্রম্পট",
      },
      EditModal: {
        Title: "সম্পাদন করুন প্রম্পট",
      },
    },
    HistoryCount: {
      Title: "সংযুক্ত বার্তা সংখ্যা",
      SubTitle: "প্রতি অনুরোধে প্রেরণ করা গেলে প্রেরণ করা হবে",
    },
    CompressThreshold: {
      Title: "ইতিহাস সঙ্কুচিত করার সীমা",
      SubTitle:
        "নকুল বার্তা দৈর্ঘ্য সীমা অতিক্রান্ত হলে ঐ বার্তাটি সঙ্কুচিত হবে",
    },

    Usage: {
      Title: "একাউন্ট ব্যালেন্স",
      SubTitle(used: any, total: any) {
        return `এই মাসে ব্যবহৃত $${used}, সাবস্ক্রিপশন $${total}`;
      },
      IsChecking: "চেক করা হচ্ছে...",
      Check: "চেক",
      NoAccess: "ব্যালেন্স চেক করতে অ্যাপি কী ইনপুট করুন",
    },

    Model: "মডেল",
    Temperature: {
      Title: "তাপমাত্রা",
      SubTitle: "আরতি মান বেশি করলে বেশি এলোমেলো আউটপুট হবে",
    },
    TopP: {
      Title: "শীর্ষ পি",
      SubTitle: "তাপমাত্রা সঙ্গে এই মান পরিবর্তন করবেন না",
    },
    MaxTokens: {
      Title: "সর্বাধিক টোকেন",
      SubTitle: "ইনপুট টোকেন এবং উৎপাদিত টোকেনের সর্বাধিক দৈর্ঘ্য",
    },
    PresencePenalty: {
      Title: "উপস্থিতির জরিমানা",
      SubTitle: "আরতি মান বেশি করলে নতুন বিষয়গুলি সম্ভাব্যতা বাড়াতে পারে",
    },
    FrequencyPenalty: {
      Title: "ফ্রিকুয়েন্সি জরিমানা",
      SubTitle:
        "আরতি মান বাড়ালে একই লাইন পুনরায় ব্যাবহার করার সম্ভাবনা হ্রাস পায়",
    },
  },
  Store: {
    DefaultTopic: "নতুন সংলাপ",
    BotHello: "হ্যালো! আজকে আপনাকে কিভাবে সাহায্য করতে পারি?",
    Error: "কিছু নিয়ে ভুল হয়েছে, পরে আবার চেষ্টা করুন।",
    Prompt: {
      History: (content: string) =>
        "এটি চ্যাট ইতিহাসের সংক্ষিপ্ত সংকলনের মতো: " + content,
      Topic:
        "আমাদের সংলাপটির চার থেকে পাঁচ শব্দের একটি শিরোনাম তৈরি করুন যা আমাদের আলাপের সংক্ষিপ্তসার হিসাবে যোগ হবে না, যেমন অভিবৃত্তি, বিন্যাস, উদ্ধৃতি, পূর্বচালক চিহ্ন, পূর্বরোবক্তির যেকোনো চিহ্ন বা অতিরিক্ত পাঠ। মেয়াদশেষ উদ্ধৃতি চেষ্টা করুন।",
      Summarize:
        "২০০ শব্দের লম্বা হয়ে মুহূর্তে আলোচনা সংক্ষেপের রপ্তানি করুন, যেটি ভবিষ্যতের প্রম্পট হিসাবে ব্যবহার করবেন।",
    },
  },
  Copy: {
    Success: "ক্লিপবোর্ডে কপি করা হয়েছে",
    Failed: "কপি ব্যর্থ, অনুমতি প্রদান করার জন্য অনুমতি প্রদান করুন",
  },
  Context: {
    Toast: (x: any) => `With ${x} contextual prompts`,
    Edit: "বর্তমান চ্যাট সেটিংস",
    Add: "একটি প্রম্পট যোগ করুন",
    Clear: "সঙ্গতি পরিস্কার করুন",
    Revert: "পূর্ববর্তী অবস্থানে ফিরে যান",
  },
  Plugin: {
    Name: "প্লাগইন",
  },
  FineTuned: {
    Sysmessage: "আপনি একটি সহকারী যা",
  },
  Mask: {
    Name: "মাস্ক",
    Page: {
      Title: "প্রম্পট টেমপ্লেট",
      SubTitle: (count: number) => `${count} টি প্রম্পট টেমপ্লেট`,
      Search: "টেমপ্লেট অনুসন্ধান করুন",
      Create: "তৈরি করুন",
    },
    Item: {
      Info: (count: number) => `${count} প্রম্পট`,
      Chat: "চ্যাট",
      View: "দেখুন",
      Edit: "সম্পাদন করুন",
      Delete: "মুছে ফেলুন",
      DeleteConfirm: "মুছে ফেলতে নিশ্চিত করুন?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `প্রম্পট টেমপ্লেট সম্পাদন করুন ${readonly ? "(readonly)" : ""}`,
      Download: "ডাউনলোড করুন",
      Clone: "ক্লোন করুন",
    },
    Config: {
      Avatar: "বট অবতার",
      Name: "বটের নাম",
      Sync: {
        Title: "গ্লোবাল কনফিগ ব্যবহার করুন",
        SubTitle: "এই চ্যাটে গ্লোবাল কনফিগ ব্যবহার করুন",
        Confirm:
          "গ্লোবাল কনফিগ দ্বারা কাস্টম কনফিগ ওভাররাইড করতে নিশ্চিত করতে?",
      },
      HideContext: {
        Title: "সংশ্লিষ্টতা প্রম্পটগুলি লুকান",
        SubTitle: "চ্যাটে সংশ্লিষ্টতা প্রম্পটগুলি দেখাবেন না",
      },
      Share: {
        Title: "এই মাস্কটি শেয়ার করুন",
        SubTitle: "এই মাস্কের একটি লিঙ্ক তৈরি করুন",
        Action: "লিঙ্ক কপি করুন",
      },
    },
  },
  NewChat: {
    Return: "ফিরে যান",
    Skip: "শুরু করুন",
    Title: "মাস্ক নির্বাচন করুন",
    SubTitle: "মাস্কের পিছনে আত্মার সঙ্গে চ্যাট করুন",
    More: "আরো খুঁজুন",
    NotShow: "এখনও দেখাবেন না",
    ConfirmNoShow:
      "নিষ্ক্রিয় করতে নিশ্চিত করুন? পরে আপনি এটি সেটিংসে সক্ষম করতে পারবেন।",
  },

  UI: {
    Confirm: "নিশ্চিত করুন",
    Cancel: "বাতিল করুন",
    Close: "বন্ধ করুন",
    Create: "তৈরি করুন",
    Edit: "সম্পাদন করুন",
  },
  Exporter: {
    Model: "মডেল",
    Messages: "বার্তা",
    Topic: "টপিক",
    Time: "সময়",
  },
};

export default bn;
