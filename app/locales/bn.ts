import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";
import { getClientConfig } from "../config/client";

const isApp = !!getClientConfig()?.isApp;

const bn: PartialLocaleType = {
  WIP: "শীঘ্রই আসছে...",
  Error: {
    Unauthorized: isApp
      ? "অবৈধ API কী সনাক্ত করা হয়েছে, অনুগ্রহ করে [সেটিংস](/#/settings) পৃষ্ঠায় যান এবং নিশ্চিত করুন যে API কী সঠিকভাবে কনফিগার করা হয়েছে।"
      : "অ্যাক্সেস পাসওয়ার্ড সঠিক নয় বা খালি, অনুগ্রহ করে [লগইন](/#/auth) পৃষ্ঠায় যান এবং সঠিক অ্যাক্সেস পাসওয়ার্ড প্রবেশ করান, অথবা [সেটিংস](/#/settings) পৃষ্ঠায় আপনার OpenAI API কী প্রবেশ করান।",
  },
  Auth: {
    Title: "পাসওয়ার্ড প্রয়োজন",
    Tips: "অ্যাডমিন পাসওয়ার্ড প্রমাণীকরণ চালু করেছেন, নিচে অ্যাক্সেস কোড প্রবেশ করুন",
    SubTips: "অথবা আপনার OpenAI অথবা Google API কী প্রবেশ করান",
    Input: "এখানে অ্যাক্সেস কোড লিখুন",
    Confirm: "নিশ্চিত করুন",
    Later: "পরে বলুন",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} টি চ্যাট`,
  },
  Chat: {
    SubTitle: (count: number) => `মোট ${count} টি চ্যাট`,
    EditMessage: {
      Title: "বার্তাগুলি সম্পাদনা করুন",
      Topic: {
        Title: "চ্যাটের বিষয়",
        SubTitle: "বর্তমান চ্যাটের বিষয় পরিবর্তন করুন",
      },
    },
    Actions: {
      ChatList: "বার্তা তালিকা দেখুন",
      CompressedHistory: "সংকুচিত ইতিহাস দেখুন",
      Export: "চ্যাট ইতিহাস রপ্তানী করুন",
      Copy: "অনুলিপি করুন",
      Stop: "থামান",
      Retry: "পুনরায় চেষ্টা করুন",
      Pin: "পিন করুন",
      PinToastContent: "1 টি চ্যাট পূর্বনির্ধারিত প্রম্পটে পিন করা হয়েছে",
      PinToastAction: "দেখুন",
      Delete: "মুছে ফেলুন",
      Edit: "সম্পাদনা করুন",
    },
    Commands: {
      new: "নতুন চ্যাট",
      newm: "মাস্ক থেকে নতুন চ্যাট",
      next: "পরবর্তী চ্যাট",
      prev: "পূর্ববর্তী চ্যাট",
      clear: "প্রসঙ্গ পরিষ্কার করুন",
      del: "চ্যাট মুছে ফেলুন",
    },
    InputActions: {
      Stop: "প্রতিক্রিয়া থামান",
      ToBottom: "সর্বশেষে স্ক্রোল করুন",
      Theme: {
        auto: "স্বয়ংক্রিয় থিম",
        light: "আলোর মোড",
        dark: "অন্ধকার মোড",
      },
      Prompt: "সংক্ষিপ্ত নির্দেশনা",
      Masks: "সমস্ত মাস্ক",
      Clear: "চ্যাট পরিষ্কার করুন",
      Settings: "চ্যাট সেটিংস",
      UploadImage: "চিত্র আপলোড করুন",
    },
    Rename: "চ্যাট নাম পরিবর্তন করুন",
    Typing: "লিখছে…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} পাঠান`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "，Shift + Enter নতুন লাইন";
      }
      return inputHints + "，/ পূর্ণতা সক্রিয় করুন，: কমান্ড সক্রিয় করুন";
    },
    Send: "পাঠান",
    Config: {
      Reset: "মেমরি মুছে ফেলুন",
      SaveAs: "মাস্ক হিসাবে সংরক্ষণ করুন",
    },
    IsContext: "পূর্বনির্ধারিত প্রম্পট",
  },
  Export: {
    Title: "চ্যাট ইতিহাস শেয়ার করুন",
    Copy: "সবকিছু কপি করুন",
    Download: "ফাইল ডাউনলোড করুন",
    Share: "ShareGPT তে শেয়ার করুন",
    MessageFromYou: "ব্যবহারকারী",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "রপ্তানির ফর্ম্যাট",
      SubTitle: "Markdown টেক্সট বা PNG চিত্র রপ্তানি করা যাবে",
    },
    IncludeContext: {
      Title: "মাস্ক প্রসঙ্গ অন্তর্ভুক্ত করুন",
      SubTitle: "বার্তায় মাস্ক প্রসঙ্গ প্রদর্শন করা হবে কি না",
    },
    Steps: {
      Select: "নির্বাচন করুন",
      Preview: "পূর্বরূপ দেখুন",
    },
    Image: {
      Toast: "স্ক্রীনশট তৈরি করা হচ্ছে",
      Modal: "ছবি সংরক্ষণ করতে দীর্ঘ প্রেস করুন অথবা রাইট ক্লিক করুন",
    },
  },
  Select: {
    Search: "বার্তা অনুসন্ধান করুন",
    All: "সবকিছু নির্বাচন করুন",
    Latest: "সর্বশেষ কিছু",
    Clear: "নির্বাচন পরিষ্কার করুন",
  },
  Memory: {
    Title: "ইতিহাস সারাংশ",
    EmptyContent: "চ্যাটের বিষয়বস্তু খুব সংক্ষিপ্ত, সারাংশ প্রয়োজন নেই",
    Send: "অটোমেটিক চ্যাট ইতিহাস সংকুচিত করুন এবং প্রসঙ্গ হিসেবে পাঠান",
    Copy: "সারাংশ কপি করুন",
    Reset: "[unused]",
    ResetConfirm: "ইতিহাস সারাংশ মুছে ফেলার নিশ্চিত করুন?",
  },
  Home: {
    NewChat: "নতুন চ্যাট",
    DeleteChat: "নির্বাচিত চ্যাট মুছে ফেলার নিশ্চিত করুন?",
    DeleteToast: "চ্যাট মুছে ফেলা হয়েছে",
    Revert: "পূর্বাবস্থায় ফেরান",
  },
  Settings: {
    Title: "সেটিংস",
    SubTitle: "সমস্ত সেটিংস অপশন",

    Danger: {
      Reset: {
        Title: "সমস্ত সেটিংস পুনরায় সেট করুন",
        SubTitle: "সমস্ত সেটিংস বিকল্পগুলিকে ডিফল্ট মানে পুনরায় সেট করুন",
        Action: "এখনই পুনরায় সেট করুন",
        Confirm: "সমস্ত সেটিংস পুনরায় সেট করার নিশ্চিত করুন?",
      },
      Clear: {
        Title: "সমস্ত তথ্য মুছে ফেলুন",
        SubTitle: "সমস্ত চ্যাট এবং সেটিংস ডেটা মুছে ফেলুন",
        Action: "এখনই মুছে ফেলুন",
        Confirm: "সমস্ত চ্যাট এবং সেটিংস ডেটা মুছে ফেলানোর নিশ্চিত করুন?",
      },
    },
    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "সমস্ত ভাষা",
    },
    Avatar: "অভিনেতা",
    FontSize: {
      Title: "ফন্ট সাইজ",
      SubTitle: "চ্যাট কনটেন্টের ফন্ট সাইজ",
    },
    FontFamily: {
      Title: "চ্যাট ফন্ট",
      SubTitle:
        "চ্যাট সামগ্রীর ফন্ট, বিশ্বব্যাপী ডিফল্ট ফন্ট প্রয়োগ করতে খালি রাখুন",
      Placeholder: "ফন্টের নাম",
    },
    InjectSystemPrompts: {
      Title: "সিস্টেম-লেভেল প্রম্পট যোগ করুন",
      SubTitle:
        "প্রত্যেক বার্তায় একটি সিস্টেম প্রম্পট যোগ করুন যা ChatGPT এর অনুকরণ করবে",
    },
    InputTemplate: {
      Title: "ব্যবহারকারীর ইনপুট প্রিপ্রসেসিং",
      SubTitle: "ব্যবহারকারীর সর্বশেষ বার্তা এই টেমপ্লেটে পূরণ করা হবে",
    },

    Update: {
      Version: (x: string) => `বর্তমান সংস্করণ: ${x}`,
      IsLatest: "এটি সর্বশেষ সংস্করণ",
      CheckUpdate: "আপডেট পরীক্ষা করুন",
      IsChecking: "আপডেট পরীক্ষা করা হচ্ছে...",
      FoundUpdate: (x: string) => `নতুন সংস্করণ পাওয়া গিয়েছে: ${x}`,
      GoToUpdate: "আপডেট করতে যান",
    },
    SendKey: "পাঠানোর কী",
    Theme: "থিম",
    TightBorder: "বর্ডার-বিহীন মোড",
    SendPreviewBubble: {
      Title: "প্রিভিউ বুদবুদ",
      SubTitle: "প্রিভিউ বুদবুদে Markdown কনটেন্ট প্রিভিউ করুন",
    },
    AutoGenerateTitle: {
      Title: "স্বয়ংক্রিয় শিরোনাম জেনারেশন",
      SubTitle: "চ্যাট কনটেন্টের ভিত্তিতে উপযুক্ত শিরোনাম তৈরি করুন",
    },
    Sync: {
      CloudState: "ক্লাউড ডেটা",
      NotSyncYet: "এখনো সিঙ্ক করা হয়নি",
      Success: "সিঙ্ক সফল",
      Fail: "সিঙ্ক ব্যর্থ",

      Config: {
        Modal: {
          Title: "ক্লাউড সিঙ্ক কনফিগার করুন",
          Check: "পরীক্ষা করুন",
        },
        SyncType: {
          Title: "সিঙ্ক টাইপ",
          SubTitle: "পছন্দসই সিঙ্ক সার্ভার নির্বাচন করুন",
        },
        Proxy: {
          Title: "প্রক্সি সক্রিয় করুন",
          SubTitle:
            "ব্রাউজারে সিঙ্ক করার সময়, ক্রস-অরিজিন সীমাবদ্ধতা এড়াতে প্রক্সি সক্রিয় করতে হবে",
        },
        ProxyUrl: {
          Title: "প্রক্সি ঠিকানা",
          SubTitle:
            "এটি শুধুমাত্র প্রকল্পের সাথে সরবরাহিত ক্রস-অরিজিন প্রক্সির জন্য প্রযোজ্য",
        },

        WebDav: {
          Endpoint: "WebDAV ঠিকানা",
          UserName: "ব্যবহারকারীর নাম",
          Password: "পাসওয়ার্ড",
        },

        UpStash: {
          Endpoint: "UpStash Redis REST URL",
          UserName: "ব্যাকআপ নাম",
          Password: "UpStash Redis REST টোকেন",
        },
      },

      LocalState: "স্থানীয় ডেটা",
      Overview: (overview: any) => {
        return `${overview.chat} বার চ্যাট, ${overview.message} বার্তা, ${overview.prompt} প্রম্পট, ${overview.mask} মাস্ক`;
      },
      ImportFailed: "আমদানি ব্যর্থ",
    },
    Mask: {
      Splash: {
        Title: "মাস্ক লঞ্চ পেজ",
        SubTitle: "নতুন চ্যাট শুরু করার সময় মাস্ক লঞ্চ পেজ প্রদর্শন করুন",
      },
      Builtin: {
        Title: "ইনবিল্ট মাস্ক লুকান",
        SubTitle: "সমস্ত মাস্ক তালিকায় ইনবিল্ট মাস্ক লুকান",
      },
    },
    Prompt: {
      Disable: {
        Title: "প্রম্পট অটো-কমপ্লিশন নিষ্ক্রিয় করুন",
        SubTitle: "ইনপুট বক্সের শুরুতে / টাইপ করলে অটো-কমপ্লিশন সক্রিয় হবে",
      },
      List: "স্বনির্ধারিত প্রম্পট তালিকা",
      ListCount: (builtin: number, custom: number) =>
        `ইনবিল্ট ${builtin} টি, ব্যবহারকারী সংজ্ঞায়িত ${custom} টি`,
      Edit: "সম্পাদনা করুন",
      Modal: {
        Title: "প্রম্পট তালিকা",
        Add: "নতুন করুন",
        Search: "প্রম্পট অনুসন্ধান করুন",
      },
      EditModal: {
        Title: "প্রম্পট সম্পাদনা করুন",
      },
    },
    HistoryCount: {
      Title: "সংযুক্ত ইতিহাস বার্তার সংখ্যা",
      SubTitle: "প্রতিটি অনুরোধে সংযুক্ত ইতিহাস বার্তার সংখ্যা",
    },
    CompressThreshold: {
      Title: "ইতিহাস বার্তা দৈর্ঘ্য সংকুচিত থ্রেশহোল্ড",
      SubTitle:
        "যখন সংকুচিত ইতিহাস বার্তা এই মান ছাড়িয়ে যায়, তখন সংকুচিত করা হবে",
    },

    Usage: {
      Title: "ব্যালেন্স চেক",
      SubTitle(used: any, total: any) {
        return `এই মাসে ব্যবহৃত $${used}, সাবস্ক্রিপশন মোট $${total}`;
      },
      IsChecking: "পরীক্ষা করা হচ্ছে…",
      Check: "পুনরায় পরীক্ষা করুন",
      NoAccess: "ব্যালেন্স দেখতে API কী অথবা অ্যাক্সেস পাসওয়ার্ড প্রবেশ করুন",
    },

    Access: {
      AccessCode: {
        Title: "অ্যাক্সেস পাসওয়ার্ড",
        SubTitle: "অ্যাডমিন এনক্রিপ্টেড অ্যাক্সেস সক্রিয় করেছেন",
        Placeholder: "অ্যাক্সেস পাসওয়ার্ড প্রবেশ করুন",
      },
      CustomEndpoint: {
        Title: "স্বনির্ধারিত ইন্টারফেস",
        SubTitle: "স্বনির্ধারিত Azure বা OpenAI সার্ভিস ব্যবহার করবেন কি?",
      },
      Provider: {
        Title: "মডেল পরিষেবা প্রদানকারী",
        SubTitle: "বিভিন্ন পরিষেবা প্রদানকারীতে স্যুইচ করুন",
      },
      OpenAI: {
        ApiKey: {
          Title: "API কী",
          SubTitle:
            "পাসওয়ার্ড অ্যাক্সেস সীমাবদ্ধতা এড়াতে স্বনির্ধারিত OpenAI কী ব্যবহার করুন",
          Placeholder: "OpenAI API কী",
        },

        Endpoint: {
          Title: "ইন্টারফেস ঠিকানা",
          SubTitle: "ডিফল্ট ঠিকানা বাদে, http(s):// অন্তর্ভুক্ত করতে হবে",
        },
      },
      Azure: {
        ApiKey: {
          Title: "ইন্টারফেস কী",
          SubTitle:
            "পাসওয়ার্ড অ্যাক্সেস সীমাবদ্ধতা এড়াতে স্বনির্ধারিত Azure কী ব্যবহার করুন",
          Placeholder: "Azure API কী",
        },

        Endpoint: {
          Title: "ইন্টারফেস ঠিকানা",
          SubTitle: "উদাহরণ:",
        },

        ApiVerion: {
          Title: "ইন্টারফেস সংস্করণ (azure api version)",
          SubTitle: "নির্দিষ্ট সংস্করণ নির্বাচন করুন",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "ইন্টারফেস কী",
          SubTitle:
            "পাসওয়ার্ড অ্যাক্সেস সীমাবদ্ধতা এড়াতে স্বনির্ধারিত Anthropic কী ব্যবহার করুন",
          Placeholder: "Anthropic API কী",
        },

        Endpoint: {
          Title: "ইন্টারফেস ঠিকানা",
          SubTitle: "উদাহরণ:",
        },

        ApiVerion: {
          Title: "ইন্টারফেস সংস্করণ (claude api version)",
          SubTitle: "নির্দিষ্ট API সংস্করণ প্রবেশ করুন",
        },
      },
      Google: {
        ApiKey: {
          Title: "API কী",
          SubTitle: "Google AI থেকে আপনার API কী পান",
          Placeholder: "আপনার Google AI Studio API কী প্রবেশ করুন",
        },

        Endpoint: {
          Title: "টার্মিনাল ঠিকানা",
          SubTitle: "উদাহরণ:",
        },

        ApiVersion: {
          Title: "API সংস্করণ (শুধুমাত্র gemini-pro)",
          SubTitle: "একটি নির্দিষ্ট API সংস্করণ নির্বাচন করুন",
        },
        GoogleSafetySettings: {
          Title: "Google সেফটি ফিল্টার স্তর",
          SubTitle: "বিষয়বস্তু ফিল্টার স্তর সেট করুন",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "API কী",
          SubTitle: "স্বনির্ধারিত Baidu API কী ব্যবহার করুন",
          Placeholder: "Baidu API কী",
        },
        SecretKey: {
          Title: "সিক্রেট কী",
          SubTitle: "স্বনির্ধারিত Baidu সিক্রেট কী ব্যবহার করুন",
          Placeholder: "Baidu সিক্রেট কী",
        },
        Endpoint: {
          Title: "ইন্টারফেস ঠিকানা",
          SubTitle: "স্বনির্ধারিত সমর্থিত নয়, .env কনফিগারেশনে চলে যান",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "ইন্টারফেস কী",
          SubTitle: "স্বনির্ধারিত ByteDance API কী ব্যবহার করুন",
          Placeholder: "ByteDance API কী",
        },
        Endpoint: {
          Title: "ইন্টারফেস ঠিকানা",
          SubTitle: "উদাহরণ:",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "ইন্টারফেস কী",
          SubTitle: "স্বনির্ধারিত আলিবাবা ক্লাউড API কী ব্যবহার করুন",
          Placeholder: "Alibaba Cloud API কী",
        },
        Endpoint: {
          Title: "ইন্টারফেস ঠিকানা",
          SubTitle: "উদাহরণ:",
        },
      },
      CustomModel: {
        Title: "স্বনির্ধারিত মডেল নাম",
        SubTitle:
          "স্বনির্ধারিত মডেল বিকল্পগুলি যুক্ত করুন, ইংরেজি কমা দ্বারা আলাদা করুন",
      },
    },

    Model: "মডেল (model)",
    Temperature: {
      Title: "যাদুকরিতা (temperature)",
      SubTitle: "মান বাড়ালে উত্তর বেশি এলোমেলো হবে",
    },
    TopP: {
      Title: "নিউক্লিয়ার স্যাম্পলিং (top_p)",
      SubTitle: "যাদুকরিতা মত, কিন্তু একসাথে পরিবর্তন করবেন না",
    },
    MaxTokens: {
      Title: "একটি উত্তর সীমা (max_tokens)",
      SubTitle: "প্রতি ইন্টারঅ্যাকশনে সর্বাধিক টোকেন সংখ্যা",
    },
    PresencePenalty: {
      Title: "বিষয়বস্তু তাজা (presence_penalty)",
      SubTitle: "মান বাড়ালে নতুন বিষয়ে প্রসারিত হওয়ার সম্ভাবনা বেশি",
    },
    FrequencyPenalty: {
      Title: "ফ্রিকোয়েন্সি পেনাল্টি (frequency_penalty)",
      SubTitle: "মান বাড়ালে পুনরাবৃত্তি শব্দ কমানোর সম্ভাবনা বেশি",
    },
  },
  Store: {
    DefaultTopic: "নতুন চ্যাট",
    BotHello: "আপনার জন্য কিছু করতে পারি?",
    Error: "একটি ত্রুটি ঘটেছে, পরে আবার চেষ্টা করুন",
    Prompt: {
      History: (content: string) =>
        "এটি পূর্বের চ্যাটের সারাংশ হিসেবে ব্যবহৃত হবে: " + content,
      Topic:
        "চার থেকে পাঁচটি শব্দ ব্যবহার করে এই বাক্যের সংক্ষিপ্ত থিম দিন, ব্যাখ্যা, বিরাম চিহ্ন, ভাষা, অতিরিক্ত টেক্সট বা বোল্ড না ব্যবহার করুন। যদি কোনো থিম না থাকে তবে সরাসরি 'বেকার' বলুন",
      Summarize:
        "আলোচনার বিষয়বস্তু সংক্ষিপ্তভাবে সারাংশ করুন, পরবর্তী কনটেক্সট প্রম্পট হিসেবে ব্যবহারের জন্য, ২০০ শব্দের মধ্যে সীমাবদ্ধ রাখুন",
    },
  },
  Copy: {
    Success: "ক্লিপবোর্ডে লেখা হয়েছে",
    Failed: "কপি ব্যর্থ হয়েছে, দয়া করে ক্লিপবোর্ড অনুমতি প্রদান করুন",
  },
  Download: {
    Success: "বিষয়বস্তু আপনার ডিরেক্টরিতে ডাউনলোড করা হয়েছে।",
    Failed: "ডাউনলোড ব্যর্থ হয়েছে।",
  },
  Context: {
    Toast: (x: any) => `${x}টি পূর্বনির্ধারিত প্রম্পট অন্তর্ভুক্ত`,
    Edit: "বর্তমান চ্যাট সেটিংস",
    Add: "একটি নতুন চ্যাট যোগ করুন",
    Clear: "কনটেক্সট পরিষ্কার করা হয়েছে",
    Revert: "কনটেক্সট পুনরুদ্ধার করুন",
  },
  Plugin: {
    Name: "প্লাগইন",
  },
  FineTuned: {
    Sysmessage: "আপনি একজন সহকারী",
  },
  SearchChat: {
    Name: "অনুসন্ধান",
    Page: {
      Title: "চ্যাট রেকর্ড অনুসন্ধান করুন",
      Search: "অনুসন্ধান কীওয়ার্ড লিখুন",
      NoResult: "কোন ফলাফল পাওয়া যায়নি",
      NoData: "কোন তথ্য নেই",
      Loading: "লোড হচ্ছে",

      SubTitle: (count: number) => `${count} টি ফলাফল পাওয়া গেছে`,
    },
    Item: {
      View: "দেখুন",
    },
  },
  Mask: {
    Name: "মাস্ক",
    Page: {
      Title: "পূর্বনির্ধারিত চরিত্র মাস্ক",
      SubTitle: (count: number) => `${count}টি পূর্বনির্ধারিত চরিত্র সংজ্ঞা`,
      Search: "চরিত্র মাস্ক অনুসন্ধান করুন",
      Create: "নতুন তৈরি করুন",
    },
    Item: {
      Info: (count: number) => `ভিতরে ${count}টি পূর্বনির্ধারিত চ্যাট রয়েছে`,
      Chat: "চ্যাট",
      View: "দেখুন",
      Edit: "সম্পাদনা করুন",
      Delete: "মুছে ফেলুন",
      DeleteConfirm: "মুছে ফেলার জন্য নিশ্চিত করুন?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `পূর্বনির্ধারিত মাস্ক সম্পাদনা ${readonly ? "（পঠনযোগ্য）" : ""}`,
      Download: "পূর্বনির্ধারিত ডাউনলোড করুন",
      Clone: "পূর্বনির্ধারিত ক্লোন করুন",
    },
    Config: {
      Avatar: "চরিত্রের চিত্র",
      Name: "চরিত্রের নাম",
      Sync: {
        Title: "গ্লোবাল সেটিংস ব্যবহার করুন",
        SubTitle: "বর্তমান চ্যাট গ্লোবাল মডেল সেটিংস ব্যবহার করছে কি না",
        Confirm:
          "বর্তমান চ্যাটের কাস্টম সেটিংস স্বয়ংক্রিয়ভাবে ওভাররাইট হবে, গ্লোবাল সেটিংস সক্রিয় করতে নিশ্চিত?",
      },
      HideContext: {
        Title: "পূর্বনির্ধারিত চ্যাট লুকান",
        SubTitle:
          "লুকানোর পরে পূর্বনির্ধারিত চ্যাট চ্যাট ইন্টারফেসে প্রদর্শিত হবে না",
      },
      Share: {
        Title: "এই মাস্ক শেয়ার করুন",
        SubTitle: "এই মাস্কের সরাসরি লিঙ্ক তৈরি করুন",
        Action: "লিঙ্ক কপি করুন",
      },
    },
  },
  NewChat: {
    Return: "ফিরে যান",
    Skip: "ডাইরেক্ট শুরু করুন",
    NotShow: "আবার প্রদর্শন করবেন না",
    ConfirmNoShow:
      "নিশ্চিত যে নিষ্ক্রিয় করবেন? নিষ্ক্রিয় করার পরে সেটিংসে পুনরায় সক্রিয় করা যাবে।",
    Title: "একটি মাস্ক নির্বাচন করুন",
    SubTitle: "এখন শুরু করুন, মাস্কের পিছনের চিন্তা প্রতিক্রিয়া করুন",
    More: "সব দেখুন",
  },

  URLCommand: {
    Code: "লিঙ্কে অ্যাক্সেস কোড ইতিমধ্যে অন্তর্ভুক্ত রয়েছে, অটো পূরণ করতে চান?",
    Settings:
      "লিঙ্কে প্রাক-নির্ধারিত সেটিংস অন্তর্ভুক্ত রয়েছে, অটো পূরণ করতে চান?",
  },

  UI: {
    Confirm: "নিশ্চিত করুন",
    Cancel: "বাতিল করুন",
    Close: "বন্ধ করুন",
    Create: "নতুন তৈরি করুন",
    Edit: "সম্পাদনা করুন",
    Export: "রপ্তানি করুন",
    Import: "আমদানি করুন",
    Sync: "সিঙ্ক",
    Config: "কনফিগারেশন",
  },
  Exporter: {
    Description: {
      Title: "শুধুমাত্র কনটেক্সট পরিষ্কার করার পরে বার্তাগুলি প্রদর্শিত হবে",
    },
    Model: "মডেল",
    Messages: "বার্তা",
    Topic: "থিম",
    Time: "সময়",
  },
};

export default bn;
