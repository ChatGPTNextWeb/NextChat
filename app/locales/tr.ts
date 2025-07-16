import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";
import { getClientConfig } from "../config/client";
import { SAAS_CHAT_UTM_URL } from "@/app/constant";
const isApp = !!getClientConfig()?.isApp;

const tr: PartialLocaleType = {
  WIP: "Çalışma devam ediyor...",
  Error: {
    Unauthorized: isApp
      ? `😆 Sohbet bazı sorunlarla karşılaştı, endişelenmeyin:
    \\ 1️⃣ Eğer sıfır yapılandırma ile başlamak istiyorsanız, [buraya tıklayarak hemen sohbete başlayın 🚀](${SAAS_CHAT_UTM_URL})
    \\ 2️⃣ Kendi OpenAI kaynaklarınızı kullanmak istiyorsanız, [buraya tıklayarak](/#/settings) ayarları değiştirin ⚙️`
      : `😆 Sohbet bazı sorunlarla karşılaştı, endişelenmeyin:
    \ 1️⃣ Eğer sıfır yapılandırma ile başlamak istiyorsanız, [buraya tıklayarak hemen sohbete başlayın 🚀](${SAAS_CHAT_UTM_URL})
    \ 2️⃣ Eğer özel dağıtım sürümü kullanıyorsanız, [buraya tıklayarak](/#/auth) erişim anahtarını girin 🔑
    \ 3️⃣ Kendi OpenAI kaynaklarınızı kullanmak istiyorsanız, [buraya tıklayarak](/#/settings) ayarları değiştirin ⚙️
 `,
  },
  Auth: {
    Title: "Şifre Gerekli",
    Tips: "Yönetici şifre doğrulamasını etkinleştirdi, lütfen aşağıya erişim kodunu girin",
    SubTips: "Veya OpenAI veya Google API anahtarınızı girin",
    Input: "Erişim kodunu buraya girin",
    Confirm: "Onayla",
    Later: "Sonra",
    Return: "Geri",
    SaasTips: "Ayarlar çok karmaşık, hemen kullanmak istiyorum",
    TopTips:
      "🥳 NextChat AI lansman teklifi, OpenAI o1, GPT-4o, Claude-3.5 ve en son büyük modelleri şimdi açın",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} konuşma`,
  },
  Chat: {
    SubTitle: (count: number) => `Toplam ${count} konuşma`,
    EditMessage: {
      Title: "Mesaj Kayıtlarını Düzenle",
      Topic: {
        Title: "Sohbet Konusu",
        SubTitle: "Geçerli sohbet konusunu değiştir",
      },
    },
    Actions: {
      ChatList: "Mesaj listesine bak",
      CompressedHistory: "Sıkıştırılmış geçmişi gör",
      Export: "Sohbet kayıtlarını dışa aktar",
      Copy: "Kopyala",
      Stop: "Durdur",
      Retry: "Yeniden dene",
      Pin: "Sabitlenmiş",
      PinToastContent: "1 konuşma varsayılan ifadeye sabitlendi",
      PinToastAction: "Görünüm",
      Delete: "Sil",
      Edit: "Düzenle",
      RefreshTitle: "Başlığı Yenile",
      RefreshToast: "Başlık yenileme isteği gönderildi",
    },
    Commands: {
      new: "Yeni sohbet",
      newm: "Maske ile yeni sohbet oluştur",
      next: "Sonraki sohbet",
      prev: "Önceki sohbet",
      clear: "Konteksti temizle",
      del: "Sohbeti sil",
    },
    InputActions: {
      Stop: "Yanıtı durdur",
      ToBottom: "En alta git",
      Theme: {
        auto: "Otomatik tema",
        light: "Açık mod",
        dark: "Koyu mod",
      },
      Prompt: "Kısayol komutu",
      Masks: "Tüm maskeler",
      Clear: "Sohbeti temizle",
      Settings: "Sohbet ayarları",
      UploadImage: "Resim yükle",
    },
    Rename: "Sohbeti yeniden adlandır",
    Typing: "Yazıyor…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} gönder`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += " Shift + Enter satır sonu için";
      }
      return inputHints + " / tamamlama için, : komutlar için";
    },
    Send: "Gönder",
    Config: {
      Reset: "Hafızayı temizle",
      SaveAs: "Maske olarak kaydet",
    },
    IsContext: "Varsayılan ifade",
  },
  Export: {
    Title: "Sohbet kayıtlarını paylaş",
    Copy: "Hepsini kopyala",
    Download: "Dosyayı indir",
    Share: "ShareGPT'ye paylaş",
    MessageFromYou: "Kullanıcı",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "Dışa aktarma formatı",
      SubTitle: "Markdown metni veya PNG resmi olarak dışa aktarabilirsiniz",
    },
    IncludeContext: {
      Title: "Maske bağlamını dahil et",
      SubTitle: "Mesajlarda maske bağlamını göstermek ister misiniz",
    },
    Steps: {
      Select: "Seç",
      Preview: "Önizleme",
    },
    Image: {
      Toast: "Ekran görüntüsü oluşturuluyor",
      Modal: "Resmi uzun basın veya sağ tıklayın ve kaydedin",
    },
  },
  Select: {
    Search: "Mesajları ara",
    All: "Hepsini seç",
    Latest: "Son birkaç mesaj",
    Clear: "Seçimi temizle",
  },
  Memory: {
    Title: "Geçmiş Özeti",
    EmptyContent: "Sohbet içeriği çok kısa, özetleme gerek yok",
    Send: "Sohbet kayıtlarını otomatik olarak sıkıştır ve bağlam olarak gönder",
    Copy: "Özeti kopyala",
    Reset: "[kullanılmadı]",
    ResetConfirm: "Geçmiş özetini temizlemek istediğinize emin misiniz?",
  },
  Home: {
    NewChat: "Yeni sohbet",
    DeleteChat: "Seçilen sohbeti silmek istediğinize emin misiniz?",
    DeleteToast: "Sohbet silindi",
    Revert: "Geri al",
  },
  Settings: {
    Title: "Ayarlar",
    SubTitle: "Tüm ayar seçenekleri",

    Danger: {
      Reset: {
        Title: "Tüm ayarları sıfırla",
        SubTitle: "Tüm ayarları varsayılan değerlere sıfırla",
        Action: "Hemen sıfırla",
        Confirm: "Tüm ayarları sıfırlamak istediğinizden emin misiniz?",
      },
      Clear: {
        Title: "Tüm verileri temizle",
        SubTitle: "Tüm sohbet ve ayar verilerini temizle",
        Action: "Hemen temizle",
        Confirm:
          "Tüm sohbet ve ayar verilerini temizlemek istediğinizden emin misiniz?",
      },
    },
    Lang: {
      Name: "Language", // Dikkat: yeni bir çeviri eklemek isterseniz, bu değeri çevirmeyin, `Language` olarak bırakın
      All: "Tüm diller",
    },
    Avatar: "Profil Resmi",
    FontSize: {
      Title: "Yazı Boyutu",
      SubTitle: "Sohbet içeriğinin yazı boyutu",
    },
    FontFamily: {
      Title: "Sohbet Yazı Tipi",
      SubTitle:
        "Sohbet içeriğinin yazı tipi, boş bırakıldığında küresel varsayılan yazı tipi uygulanır",
      Placeholder: "Yazı Tipi Adı",
    },
    InjectSystemPrompts: {
      Title: "Sistem Seviyesi İpucu Enjeksiyonu",
      SubTitle: "Her isteğin başına ChatGPT benzeri bir sistem ipucu ekle",
    },
    InputTemplate: {
      Title: "Kullanıcı Girdisi Ön İşleme",
      SubTitle: "Kullanıcının en son mesajı bu şablona doldurulur",
    },

    Update: {
      Version: (x: string) => `Mevcut sürüm: ${x}`,
      IsLatest: "En son sürüm",
      CheckUpdate: "Güncellemeleri kontrol et",
      IsChecking: "Güncellemeler kontrol ediliyor...",
      FoundUpdate: (x: string) => `Yeni sürüm bulundu: ${x}`,
      GoToUpdate: "Güncellemeye git",
    },
    SendKey: "Gönderme Tuşu",
    Theme: "Tema",
    TightBorder: "Sınır Yok Modu",
    SendPreviewBubble: {
      Title: "Önizleme Balonu",
      SubTitle: "Markdown içeriğini önizleme balonunda görüntüle",
    },
    AutoGenerateTitle: {
      Title: "Başlığı Otomatik Oluştur",
      SubTitle: "Sohbet içeriğine göre uygun başlık oluştur",
    },
    Sync: {
      CloudState: "Bulut Verisi",
      NotSyncYet: "Henüz senkronize edilmedi",
      Success: "Senkronizasyon başarılı",
      Fail: "Senkronizasyon başarısız",

      Config: {
        Modal: {
          Title: "Bulut Senkronizasyonu Yapılandır",
          Check: "Kullanılabilirliği kontrol et",
        },
        SyncType: {
          Title: "Senkronizasyon Türü",
          SubTitle: "Tercih ettiğiniz senkronizasyon sunucusunu seçin",
        },
        Proxy: {
          Title: "Proxy'yi Etkinleştir",
          SubTitle:
            "Tarayıcıda senkronize ederken proxy'yi etkinleştirin, aksi takdirde çapraz kaynak kısıtlamalarıyla karşılaşabilirsiniz",
        },
        ProxyUrl: {
          Title: "Proxy Adresi",
          SubTitle: "Sadece bu projeye ait çapraz kaynak proxy için",
        },

        WebDav: {
          Endpoint: "WebDAV Adresi",
          UserName: "Kullanıcı Adı",
          Password: "Şifre",
        },

        UpStash: {
          Endpoint: "UpStash Redis REST Url",
          UserName: "Yedekleme Adı",
          Password: "UpStash Redis REST Token",
        },
      },

      LocalState: "Yerel Veri",
      Overview: (overview: any) => {
        return `${overview.chat} konuşma, ${overview.message} mesaj, ${overview.prompt} ipucu, ${overview.mask} maske`;
      },
      ImportFailed: "İçeri aktarma başarısız",
    },
    Mask: {
      Splash: {
        Title: "Maske Başlangıç Sayfası",
        SubTitle:
          "Yeni sohbet başlatıldığında maske başlangıç sayfasını göster",
      },
      Builtin: {
        Title: "Yerleşik Maskeleri Gizle",
        SubTitle: "Tüm maskeler listesindeki yerleşik maskeleri gizle",
      },
    },
    Prompt: {
      Disable: {
        Title: "İpucu Tamamlamayı Devre Dışı Bırak",
        SubTitle:
          "Giriş kutusunun başına / yazarak otomatik tamamlamayı tetikle",
      },
      List: "Özelleştirilmiş İpucu Listesi",
      ListCount: (builtin: number, custom: number) =>
        `Yerleşik ${builtin} tane, kullanıcı tanımlı ${custom} tane`,
      Edit: "Düzenle",
      Modal: {
        Title: "İpucu Listesi",
        Add: "Yeni Ekle",
        Search: "İpucu Ara",
      },
      EditModal: {
        Title: "İpucu Düzenle",
      },
    },
    HistoryCount: {
      Title: "Ekli Geçmiş Mesaj Sayısı",
      SubTitle: "Her istekte taşınan geçmiş mesaj sayısı",
    },
    CompressThreshold: {
      Title: "Geçmiş Mesaj Uzunluğu Sıkıştırma Eşiği",
      SubTitle:
        "Sıkıştırılmamış geçmiş mesaj bu değeri aştığında sıkıştırma yapılır",
    },

    Usage: {
      Title: "Bakiye Sorgulama",
      SubTitle(used: any, total: any) {
        return `Bu ay kullanılan $${used}, toplam abonelik ücreti $${total}`;
      },
      IsChecking: "Kontrol ediliyor…",
      Check: "Yeniden kontrol et",
      NoAccess:
        "Bakiye görüntülemek için API Anahtarı veya erişim şifresi girin",
    },

    Access: {
      SaasStart: {
        Title: "NextChat AI kullanın",
        Label: "(En maliyet etkin çözüm)",
        SubTitle:
          "NextChat tarafından resmi olarak yönetilmektedir, yapılandırma olmadan hemen kullanıma hazırdır, OpenAI o1, GPT-4o, Claude-3.5 gibi en son büyük modelleri destekler",
        ChatNow: "Şimdi sohbet et",
      },

      AccessCode: {
        Title: "Erişim Şifresi",
        SubTitle: "Yönetici şifreli erişimi etkinleştirdi",
        Placeholder: "Erişim şifrenizi girin",
      },
      CustomEndpoint: {
        Title: "Özelleştirilmiş API",
        SubTitle:
          "Özelleştirilmiş Azure veya OpenAI hizmeti kullanmak ister misiniz?",
      },
      Provider: {
        Title: "Model Sağlayıcısı",
        SubTitle: "Farklı sağlayıcılara geçiş yapın",
      },
      OpenAI: {
        ApiKey: {
          Title: "API Anahtarı",
          SubTitle:
            "Özelleştirilmiş OpenAI Anahtarı kullanarak şifreli erişim kısıtlamalarını atlayın",
          Placeholder: "OpenAI API Anahtarı",
        },

        Endpoint: {
          Title: "API Adresi",
          SubTitle: "Varsayılan adres dışında, http(s):// içermelidir",
        },
      },
      Azure: {
        ApiKey: {
          Title: "API Anahtarı",
          SubTitle:
            "Özelleştirilmiş Azure Anahtarı kullanarak şifreli erişim kısıtlamalarını atlayın",
          Placeholder: "Azure API Anahtarı",
        },

        Endpoint: {
          Title: "API Adresi",
          SubTitle: "Örnek:",
        },

        ApiVerion: {
          Title: "API Versiyonu (azure api version)",
          SubTitle: "Belirli bir versiyonu seçin",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "API Anahtarı",
          SubTitle:
            "Özelleştirilmiş Anthropic Anahtarı kullanarak şifreli erişim kısıtlamalarını atlayın",
          Placeholder: "Anthropic API Anahtarı",
        },

        Endpoint: {
          Title: "API Adresi",
          SubTitle: "Örnek:",
        },

        ApiVerion: {
          Title: "API Versiyonu (claude api version)",
          SubTitle: "Belirli bir API versiyonunu seçin",
        },
      },
      Google: {
        ApiKey: {
          Title: "API Anahtarı",
          SubTitle: "Google AI'den API Anahtarınızı alın",
          Placeholder: "Google AI Studio API Anahtarınızı girin",
        },

        Endpoint: {
          Title: "Uç Nokta Adresi",
          SubTitle: "Örnek:",
        },

        ApiVersion: {
          Title: "API Versiyonu (sadece gemini-pro)",
          SubTitle: "Belirli bir API versiyonunu seçin",
        },
        GoogleSafetySettings: {
          Title: "Google Güvenlik Filtreleme Seviyesi",
          SubTitle: "İçerik filtreleme seviyesini ayarlayın",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "API Anahtarı",
          SubTitle: "Özelleştirilmiş Baidu API Anahtarı kullanın",
          Placeholder: "Baidu API Anahtarı",
        },
        SecretKey: {
          Title: "Secret Anahtarı",
          SubTitle: "Özelleştirilmiş Baidu Secret Anahtarı kullanın",
          Placeholder: "Baidu Secret Anahtarı",
        },
        Endpoint: {
          Title: "API Adresi",
          SubTitle: "Özelleştirilmiş yapılandırma için .env'ye gidin",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "API Anahtarı",
          SubTitle: "Özelleştirilmiş ByteDance API Anahtarı kullanın",
          Placeholder: "ByteDance API Anahtarı",
        },
        Endpoint: {
          Title: "API Adresi",
          SubTitle: "Örnek:",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "API Anahtarı",
          SubTitle: "Özelleştirilmiş Alibaba Cloud API Anahtarı kullanın",
          Placeholder: "Alibaba Cloud API Anahtarı",
        },
        Endpoint: {
          Title: "API Adresi",
          SubTitle: "Örnek:",
        },
      },
      AI302: {
        ApiKey: {
          Title: "API Anahtarı",
          SubTitle: "Özelleştirilmiş 302.AI API Anahtarı kullanın",
          Placeholder: "302.AI API Anahtarı",
        },
        Endpoint: {
          Title: "API Adresi",
          SubTitle: "Örnek:",
        },
      },
      CustomModel: {
        Title: "Özelleştirilmiş Model Adı",
        SubTitle:
          "Özelleştirilmiş model seçenekleri ekleyin, İngilizce virgül ile ayırın",
      },
    },

    Model: "Model (model)",
    CompressModel: {
      Title: "Sıkıştırma Modeli",
      SubTitle: "Geçmişi sıkıştırmak için kullanılan model",
    },
    Temperature: {
      Title: "Rastgelelik (temperature)",
      SubTitle: "Değer arttıkça yanıt daha rastgele olur",
    },
    TopP: {
      Title: "Nükleer Örnekleme (top_p)",
      SubTitle:
        "Rastgeleliğe benzer, ancak rastgelelik ile birlikte değiştirmeyin",
    },
    MaxTokens: {
      Title: "Tek Yanıt Limiti (max_tokens)",
      SubTitle: "Tek etkileşimde kullanılan maksimum Token sayısı",
    },
    PresencePenalty: {
      Title: "Konu Tazeliği (presence_penalty)",
      SubTitle: "Değer arttıkça, yeni konulara geçiş olasılığı artar",
    },
    FrequencyPenalty: {
      Title: "Frekans Cezası (frequency_penalty)",
      SubTitle:
        "Değer arttıkça, tekrar eden kelimelerin azalması olasılığı artar",
    },
  },
  Store: {
    DefaultTopic: "Yeni Sohbet",
    BotHello: "Size nasıl yardımcı olabilirim?",
    Error: "Bir hata oluştu, lütfen daha sonra tekrar deneyin",
    Prompt: {
      History: (content: string) => "Bu, geçmiş sohbetin özeti: " + content,
      Topic:
        "Bu cümlenin dört ila beş kelimelik kısa başlığını doğrudan verin, açıklama yapmayın, noktalama işareti, duygu kelimesi veya fazla metin eklemeyin, kalın yapmayın. Başlık yoksa, doğrudan 'Sohbet' yanıtını verin.",
      Summarize:
        "Sohbet içeriğini kısaca özetleyin, bu özet sonraki bağlam ipucu olarak kullanılacaktır, 200 kelime içinde tutun",
    },
  },
  Copy: {
    Success: "Panoya yazıldı",
    Failed: "Kopyalama başarısız, lütfen panoya erişim izni verin",
  },
  Download: {
    Success: "İçerik dizininize indirildi.",
    Failed: "İndirme başarısız.",
  },
  Context: {
    Toast: (x: any) => `${x} tane önceden tanımlı ipucu içeriyor`,
    Edit: "Mevcut sohbet ayarları",
    Add: "Yeni bir sohbet ekle",
    Clear: "Bağlam temizlendi",
    Revert: "Bağlamı geri getir",
  },
  Plugin: {
    Name: "Eklenti",
  },
  FineTuned: {
    Sysmessage: "Sen bir asistansın",
  },
  SearchChat: {
    Name: "Ara",
    Page: {
      Title: "Sohbet geçmişini ara",
      Search: "Arama anahtar kelimelerini girin",
      NoResult: "Sonuç bulunamadı",
      NoData: "Veri yok",
      Loading: "Yükleniyor",

      SubTitle: (count: number) => `${count} sonuç bulundu`,
    },
    Item: {
      View: "Görüntüle",
    },
  },
  Mask: {
    Name: "Maske",
    Page: {
      Title: "Önceden Tanımlı Karakter Maskeleri",
      SubTitle: (count: number) =>
        `${count} tane önceden tanımlı karakter tanımı`,
      Search: "Karakter maskesi ara",
      Create: "Yeni oluştur",
    },
    Item: {
      Info: (count: number) => `${count} tane önceden tanımlı sohbet içeriyor`,
      Chat: "Sohbet",
      View: "Görüntüle",
      Edit: "Düzenle",
      Delete: "Sil",
      DeleteConfirm: "Silmek istediğinizden emin misiniz?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Önceden Tanımlı Maskeyi Düzenle ${readonly ? " (Salt Okunur)" : ""}`,
      Download: "Önceden Tanımlı Maskeyi İndir",
      Clone: "Önceden Tanımlı Maskeyi Kopyala",
    },
    Config: {
      Avatar: "Karakter Profil Resmi",
      Name: "Karakter Adı",
      Sync: {
        Title: "Küresel Ayarları Kullan",
        SubTitle: "Mevcut sohbet küresel model ayarlarını mı kullanacak?",
        Confirm:
          "Mevcut sohbetin özelleştirilmiş ayarları otomatik olarak üzerine yazılacaktır, küresel ayarları etkinleştirmek istediğinizden emin misiniz?",
      },
      HideContext: {
        Title: "Önceden Tanımlı Sohbetleri Gizle",
        SubTitle:
          "Gizlendiğinde, önceden tanımlı sohbetler sohbet ekranında görünmeyecek",
      },
      Share: {
        Title: "Bu Maskeyi Paylaş",
        SubTitle: "Bu maskenin doğrudan bağlantısını oluştur",
        Action: "Bağlantıyı Kopyala",
      },
    },
  },
  NewChat: {
    Return: "Geri dön",
    Skip: "Doğrudan başla",
    NotShow: "Bir daha gösterme",
    ConfirmNoShow:
      "Devre dışı bırakmak istediğinizden emin misiniz? Devre dışı bıraktıktan sonra ayarlardan tekrar etkinleştirebilirsiniz.",
    Title: "Bir Maske Seçin",
    SubTitle:
      "Şimdi başlayın ve maskenin arkasındaki zihinle etkileşimde bulunun",
    More: "Tümünü Gör",
  },

  URLCommand: {
    Code: "Bağlantıda erişim kodu bulundu, otomatik olarak doldurulsun mu?",
    Settings:
      "Bağlantıda önceden tanımlı ayarlar bulundu, otomatik olarak doldurulsun mu?",
  },

  UI: {
    Confirm: "Onayla",
    Cancel: "İptal et",
    Close: "Kapat",
    Create: "Yeni oluştur",
    Edit: "Düzenle",
    Export: "Dışa Aktar",
    Import: "İçe Aktar",
    Sync: "Senkronize et",
    Config: "Yapılandır",
  },
  Exporter: {
    Description: {
      Title: "Sadece bağlam temizlendikten sonraki mesajlar gösterilecektir",
    },
    Model: "Model",
    Messages: "Mesajlar",
    Topic: "Konu",
    Time: "Zaman",
  },
};

export default tr;
