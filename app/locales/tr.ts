import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";

const tr: PartialLocaleType = {
  WIP: "Çalışma devam ediyor...",
  Error: {
    Unauthorized:
      "Yetkisiz erişim, lütfen erişim kodunu ayarlar [sayfasından](/#/auth) giriniz.",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} mesaj`,
  },
  Chat: {
    SubTitle: (count: number) => `ChatGPT tarafından ${count} mesaj`,
    Actions: {
      ChatList: "Sohbet Listesine Git",
      CompressedHistory: "Sıkıştırılmış Geçmiş Bellek Komutu",
      Export: "Tüm Mesajları Markdown Olarak Dışa Aktar",
      Copy: "Kopyala",
      Stop: "Durdur",
      Retry: "Tekrar Dene",
      Delete: "Delete",
    },
    Rename: "Sohbeti Yeniden Adlandır",
    Typing: "Yazıyor…",
    Input: (submitKey: string) => {
      var inputHints = `Göndermek için ${submitKey}`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", kaydırmak için Shift + Enter";
      }
      return inputHints + ", komutları aramak için / (eğik çizgi)";
    },
    Send: "Gönder",
    Config: {
      Reset: "Reset to Default",
      SaveAs: "Save as Mask",
    },
  },
  Export: {
    Title: "Tüm Mesajlar",
    Copy: "Tümünü Kopyala",
    Download: "İndir",
    MessageFromYou: "Sizin Mesajınız",
    MessageFromChatGPT: "ChatGPT'nin Mesajı",
  },
  Memory: {
    Title: "Bellek Komutları",
    EmptyContent: "Henüz değil.",
    Send: "Belleği Gönder",
    Copy: "Belleği Kopyala",
    Reset: "Oturumu Sıfırla",
    ResetConfirm:
      "Sıfırlama, geçerli görüşme geçmişini ve geçmiş belleği siler. Sıfırlamak istediğinizden emin misiniz?",
  },
  Home: {
    NewChat: "Yeni Sohbet",
    DeleteChat: "Seçili sohbeti silmeyi onaylıyor musunuz?",
    DeleteToast: "Sohbet Silindi",
    Revert: "Geri Al",
  },
  Settings: {
    Title: "Ayarlar",
    SubTitle: "Tüm Ayarlar",

    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "Tüm Diller",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Yazı Boyutu",
      SubTitle: "Sohbet içeriğinin yazı boyutunu ayarlayın",
    },
    FontFamily: {
      Title: "Sohbet Yazı Tipi",
      SubTitle:
        "Sohbet içeriğinin yazı tipi, boş bırakıldığında küresel varsayılan yazı tipi uygulanır",
      Placeholder: "Yazı Tipi Adı",
    },
    InjectSystemPrompts: {
      Title: "Sistem İpucu Ekleyin",
      SubTitle:
        "Her istek için ileti listesinin başına simüle edilmiş bir ChatGPT sistem ipucu ekleyin",
    },
    Update: {
      Version: (x: string) => `Sürüm: ${x}`,
      IsLatest: "En son sürüm",
      CheckUpdate: "Güncellemeyi Kontrol Et",
      IsChecking: "Güncelleme kontrol ediliyor...",
      FoundUpdate: (x: string) => `Yeni sürüm bulundu: ${x}`,
      GoToUpdate: "Güncelle",
    },
    SendKey: "Gönder Tuşu",
    Theme: "Tema",
    TightBorder: "Tam Ekran",
    SendPreviewBubble: {
      Title: "Mesaj Önizleme Balonu",
      SubTitle: "Preview markdown in bubble",
    },
    Mask: {
      Splash: {
        Title: "Mask Splash Screen",
        SubTitle: "Show a mask splash screen before starting new chat",
      },
    },
    Prompt: {
      Disable: {
        Title: "Otomatik tamamlamayı devre dışı bırak",
        SubTitle: "Otomatik tamamlamayı kullanmak için / (eğik çizgi) girin",
      },
      List: "Komut Listesi",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} yerleşik, ${custom} kullanıcı tanımlı`,
      Edit: "Düzenle",
      Modal: {
        Title: "Prompt List",
        Add: "Add One",
        Search: "Search Prompts",
      },
      EditModal: {
        Title: "Edit Prompt",
      },
    },
    HistoryCount: {
      Title: "Ekli Mesaj Sayısı",
      SubTitle: "İstek başına ekli gönderilen mesaj sayısı",
    },
    CompressThreshold: {
      Title: "Geçmiş Sıkıştırma Eşiği",
      SubTitle:
        "Sıkıştırılmamış mesajların uzunluğu bu değeri aşarsa sıkıştırılır",
    },

    Usage: {
      Title: "Hesap Bakiyesi",
      SubTitle(used: any, total: any) {
        return `Bu ay kullanılan $${used}, abonelik $${total}`;
      },
      IsChecking: "Kontrol ediliyor...",
      Check: "Tekrar Kontrol Et",
      NoAccess: "Bakiyeyi kontrol etmek için API anahtarını girin",
    },

    Model: "Model",
    Temperature: {
      Title: "Gerçeklik",
      SubTitle:
        "Daha büyük bir değer girildiğinde gerçeklik oranı düşer ve daha rastgele çıktılar üretir",
    },
    MaxTokens: {
      Title: "Maksimum Belirteç",
      SubTitle:
        "Girdi belirteçlerinin ve oluşturulan belirteçlerin maksimum uzunluğu",
    },
    PresencePenalty: {
      Title: "Varlık Cezası",
      SubTitle:
        "Daha büyük bir değer, yeni konular hakkında konuşma olasılığını artırır",
    },
    FrequencyPenalty: {
      Title: "Frekans Cezası",
      SubTitle:
        "Aynı satırı tekrar etme olasılığını azaltan daha büyük bir değer",
    },
  },
  Store: {
    DefaultTopic: "Yeni Konuşma",
    BotHello: "Merhaba! Size bugün nasıl yardımcı olabilirim?",
    Error: "Bir şeyler yanlış gitti. Lütfen daha sonra tekrar deneyiniz.",
    Prompt: {
      History: (content: string) =>
        "Bu, yapay zeka ile kullanıcı arasındaki sohbet geçmişinin bir özetidir: " +
        content,
      Topic:
        "Lütfen herhangi bir giriş, noktalama işareti, tırnak işareti, nokta, sembol veya ek metin olmadan konuşmamızı özetleyen dört ila beş kelimelik bir başlık oluşturun. Çevreleyen tırnak işaretlerini kaldırın.",
      Summarize:
        "Gelecekteki bağlam için bir bilgi istemi olarak kullanmak üzere tartışmamızı en fazla 200 kelimeyle özetleyin.",
    },
  },
  Copy: {
    Success: "Panoya kopyalandı",
    Failed: "Kopyalama başarısız oldu, lütfen panoya erişim izni verin",
  },
  Context: {
    Toast: (x: any) => `${x} bağlamsal bellek komutu`,
    Edit: "Bağlamsal ve Bellek Komutları",
    Add: "Yeni Ekle",
  },
  Plugin: {
    Name: "Plugin",
  },
  FineTuned: {
    Sysmessage: "Sen bir asistansın",
  },
  Mask: {
    Name: "Mask",
    Page: {
      Title: "Prompt Template",
      SubTitle: (count: number) => `${count} prompt templates`,
      Search: "Search Templates",
      Create: "Create",
    },
    Item: {
      Info: (count: number) => `${count} prompts`,
      Chat: "Chat",
      View: "View",
      Edit: "Edit",
      Delete: "Delete",
      DeleteConfirm: "Confirm to delete?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Edit Prompt Template ${readonly ? "(readonly)" : ""}`,
      Download: "Download",
      Clone: "Clone",
    },
    Config: {
      Avatar: "Bot Avatar",
      Name: "Bot Name",
    },
  },
  NewChat: {
    Return: "Return",
    Skip: "Skip",
    Title: "Pick a Mask",
    SubTitle: "Chat with the Soul behind the Mask",
    More: "Find More",
    NotShow: "Not Show Again",
    ConfirmNoShow: "Confirm to disable？You can enable it in settings later.",
  },

  UI: {
    Confirm: "Confirm",
    Cancel: "Cancel",
    Close: "Close",
    Create: "Create",
    Edit: "Edit",
  },
  Exporter: {
    Model: "Model",
    Messages: "Mesajlar",
    Topic: "Konu",
    Time: "Zaman",
  },
};

export default tr;
