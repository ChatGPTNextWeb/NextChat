import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";
import { getClientConfig } from "../config/client";
import { SAAS_CHAT_UTM_URL } from "@/app/constant";
const isApp = !!getClientConfig()?.isApp;

const cs: PartialLocaleType = {
  WIP: "V přípravě...",
  Error: {
    Unauthorized: isApp
      ? `😆 Rozhovor narazil na nějaké problémy, nebojte se:
    \\ 1️⃣ Pokud chcete začít bez konfigurace, [klikněte sem pro okamžitý začátek chatu 🚀](${SAAS_CHAT_UTM_URL})
    \\ 2️⃣ Pokud chcete využít své vlastní zdroje OpenAI, klikněte [sem](/#/settings) a upravte nastavení ⚙️`
      : `😆 Rozhovor narazil na nějaké problémy, nebojte se:
    \ 1️⃣ Pokud chcete začít bez konfigurace, [klikněte sem pro okamžitý začátek chatu 🚀](${SAAS_CHAT_UTM_URL})
    \ 2️⃣ Pokud používáte verzi soukromého nasazení, klikněte [sem](/#/auth) a zadejte přístupový klíč 🔑
    \ 3️⃣ Pokud chcete využít své vlastní zdroje OpenAI, klikněte [sem](/#/settings) a upravte nastavení ⚙️
 `,
  },
  Auth: {
    Title: "Potřebné heslo",
    Tips: "Administrátor povolil ověření heslem, prosím zadejte přístupový kód níže",
    SubTips: "nebo zadejte svůj OpenAI nebo Google API klíč",
    Input: "Zadejte přístupový kód zde",
    Confirm: "Potvrdit",
    Later: "Později",
    Return: "Návrat",
    SaasTips: "Konfigurace je příliš složitá, chci okamžitě začít používat",
    TopTips:
      "🥳 Uvítací nabídka NextChat AI, okamžitě odemkněte OpenAI o1, GPT-4o, Claude-3.5 a nejnovější velké modely",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} konverzací`,
  },
  Chat: {
    SubTitle: (count: number) => `Celkem ${count} konverzací`,
    EditMessage: {
      Title: "Upravit zprávy",
      Topic: {
        Title: "Téma konverzace",
        SubTitle: "Změnit aktuální téma konverzace",
      },
    },
    Actions: {
      ChatList: "Zobrazit seznam zpráv",
      CompressedHistory: "Zobrazit komprimovanou historii Prompt",
      Export: "Exportovat konverzace",
      Copy: "Kopírovat",
      Stop: "Zastavit",
      Retry: "Zkusit znovu",
      Pin: "Připnout",
      PinToastContent: "1 konverzace byla připnuta k přednastaveným promptům",
      PinToastAction: "Zobrazit",
      Delete: "Smazat",
      Edit: "Upravit",
      RefreshTitle: "Obnovit název",
      RefreshToast: "Požadavek na obnovení názvu byl odeslán",
    },
    Commands: {
      new: "Nová konverzace",
      newm: "Nová konverzace z masky",
      next: "Další konverzace",
      prev: "Předchozí konverzace",
      clear: "Vymazat kontext",
      del: "Smazat konverzaci",
    },
    InputActions: {
      Stop: "Zastavit odpověď",
      ToBottom: "Přejít na nejnovější",
      Theme: {
        auto: "Automatické téma",
        light: "Světelný režim",
        dark: "Tmavý režim",
      },
      Prompt: "Rychlé příkazy",
      Masks: "Všechny masky",
      Clear: "Vymazat konverzaci",
      Settings: "Nastavení konverzace",
      UploadImage: "Nahrát obrázek",      
      PasteQuestion: "Questions",
      PasteResponse: "Answers",
    },
    Rename: "Přejmenovat konverzaci",
    Typing: "Píše se…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} odeslat`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "，Shift + Enter pro nový řádek";
      }
      return inputHints + "，/ pro doplnění, : pro příkaz";
    },
    Send: "Odeslat",
    Config: {
      Reset: "Vymazat paměť",
      SaveAs: "Uložit jako masku",
    },
    IsContext: "Přednastavené prompty",
  },
  Export: {
    Title: "Sdílet konverzace",
    Copy: "Kopírovat vše",
    Download: "Stáhnout soubor",
    Share: "Sdílet na ShareGPT",
    MessageFromYou: "Uživatel",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "Formát exportu",
      SubTitle: "Lze exportovat jako Markdown text nebo PNG obrázek",
    },
    IncludeContext: {
      Title: "Zahrnout kontext masky",
      SubTitle: "Zobrazit kontext masky ve zprávách",
    },
    Steps: {
      Select: "Vybrat",
      Preview: "Náhled",
    },
    Image: {
      Toast: "Generování screenshotu",
      Modal: "Dlouhým stiskem nebo pravým tlačítkem myši uložte obrázek",
    },
  },
  Select: {
    Search: "Hledat zprávy",
    All: "Vybrat vše",
    Latest: "Několik posledních",
    Clear: "Zrušit výběr",
  },
  Memory: {
    Title: "Historie shrnutí",
    EmptyContent: "Obsah konverzace je příliš krátký, není třeba shrnovat",
    Send: "Automaticky komprimovat konverzace a odeslat jako kontext",
    Copy: "Kopírovat shrnutí",
    Reset: "[nepoužívá se]",
    ResetConfirm: "Opravdu chcete vymazat historii shrnutí?",
  },
  Home: {
    NewChat: "Nová konverzace",
    DeleteChat: "Opravdu chcete smazat vybranou konverzaci?",
    DeleteToast: "Konverzace byla smazána",
    Revert: "Vrátit",
  },
  Settings: {
    Title: "Nastavení",
    SubTitle: "Všechny možnosti nastavení",

    Danger: {
      Reset: {
        Title: "Obnovit všechna nastavení",
        SubTitle: "Obnovit všechny nastavení na výchozí hodnoty",
        Action: "Okamžitě obnovit",
        Confirm: "Opravdu chcete obnovit všechna nastavení?",
      },
      Clear: {
        Title: "Smazat všechna data",
        SubTitle: "Smazat všechny chaty a nastavení",
        Action: "Okamžitě smazat",
        Confirm: "Opravdu chcete smazat všechny chaty a nastavení?",
      },
    },
    Lang: {
      Name: "Language", // POZOR: pokud chcete přidat nový překlad, prosím, nechte tuto hodnotu jako `Language`
      All: "Všechny jazyky",
    },
    Avatar: "Profilový obrázek",
    FontSize: {
      Title: "Velikost písma",
      SubTitle: "Velikost písma pro obsah chatu",
    },
    FontFamily: {
      Title: "Chatové Písmo",
      SubTitle:
        "Písmo obsahu chatu, ponechejte prázdné pro použití globálního výchozího písma",
      Placeholder: "Název Písma",
    },
    InjectSystemPrompts: {
      Title: "Vložit systémové výzvy",
      SubTitle:
        "Automaticky přidat systémovou výzvu simulující ChatGPT na začátek seznamu zpráv pro každý požadavek",
    },
    InputTemplate: {
      Title: "Předzpracování uživatelského vstupu",
      SubTitle: "Nejnovější zpráva uživatele bude vyplněna do této šablony",
    },

    Update: {
      Version: (x: string) => `Aktuální verze: ${x}`,
      IsLatest: "Jste na nejnovější verzi",
      CheckUpdate: "Zkontrolovat aktualizace",
      IsChecking: "Kontrola aktualizací...",
      FoundUpdate: (x: string) => `Nalezena nová verze: ${x}`,
      GoToUpdate: "Přejít na aktualizaci",
    },
    SendKey: "Klávesa pro odeslání",
    Theme: "Téma",
    TightBorder: "Režim bez okrajů",
    SendPreviewBubble: {
      Title: "Náhledová bublina",
      SubTitle: "Náhled Markdown obsahu v náhledové bublině",
    },
    AutoGenerateTitle: {
      Title: "Automatické generování názvu",
      SubTitle: "Generovat vhodný název na základě obsahu konverzace",
    },
    Sync: {
      CloudState: "Data na cloudu",
      NotSyncYet: "Ještě nebylo synchronizováno",
      Success: "Synchronizace úspěšná",
      Fail: "Synchronizace selhala",

      Config: {
        Modal: {
          Title: "Nastavení cloudové synchronizace",
          Check: "Zkontrolovat dostupnost",
        },
        SyncType: {
          Title: "Typ synchronizace",
          SubTitle: "Vyberte oblíbený synchronizační server",
        },
        Proxy: {
          Title: "Povolit proxy",
          SubTitle:
            "Při synchronizaci v prohlížeči musí být proxy povolena, aby se předešlo problémům s CORS",
        },
        ProxyUrl: {
          Title: "Adresa proxy",
          SubTitle: "Pouze pro interní proxy",
        },

        WebDav: {
          Endpoint: "WebDAV adresa",
          UserName: "Uživatelské jméno",
          Password: "Heslo",
        },

        UpStash: {
          Endpoint: "UpStash Redis REST URL",
          UserName: "Název zálohy",
          Password: "UpStash Redis REST Token",
        },
      },

      LocalState: "Lokální data",
      Overview: (overview: any) => {
        return `${overview.chat} konverzací, ${overview.message} zpráv, ${overview.prompt} promptů, ${overview.mask} masek`;
      },
      ImportFailed: "Import selhal",
    },
    Mask: {
      Splash: {
        Title: "Úvodní stránka masky",
        SubTitle: "Při zahájení nové konverzace zobrazit úvodní stránku masky",
      },
      Builtin: {
        Title: "Skrýt vestavěné masky",
        SubTitle: "Skrýt vestavěné masky v seznamu všech masek",
      },
    },
    Prompt: {
      Disable: {
        Title: "Zakázat automatické doplňování promptů",
        SubTitle:
          "Automatické doplňování se aktivuje zadáním / na začátku textového pole",
      },
      List: "Seznam vlastních promptů",
      ListCount: (builtin: number, custom: number) =>
        `Vestavěné ${builtin} položek, uživatelsky definované ${custom} položek`,
      Edit: "Upravit",
      Modal: {
        Title: "Seznam promptů",
        Add: "Nový",
        Search: "Hledat prompty",
      },
      EditModal: {
        Title: "Upravit prompt",
      },
    },
    HistoryCount: {
      Title: "Počet historických zpráv",
      SubTitle: "Počet historických zpráv zahrnutých v každém požadavku",
    },
    CompressThreshold: {
      Title: "Prahová hodnota komprese historických zpráv",
      SubTitle:
        "Když nekomprimované historické zprávy překročí tuto hodnotu, dojde ke kompresi",
    },

    Usage: {
      Title: "Kontrola zůstatku",
      SubTitle(used: any, total: any) {
        return `Tento měsíc použito $${used}, celkový předplatný objem $${total}`;
      },
      IsChecking: "Probíhá kontrola…",
      Check: "Znovu zkontrolovat",
      NoAccess: "Zadejte API Key nebo přístupové heslo pro zobrazení zůstatku",
    },

    Access: {
      SaasStart: {
        Title: "Použití NextChat AI",
        Label: "(Nejlepší nákladově efektivní řešení)",
        SubTitle:
          "Oficiálně udržováno NextChat, připraveno k použití bez konfigurace, podporuje nejnovější velké modely jako OpenAI o1, GPT-4o, Claude-3.5",
        ChatNow: "Začněte chatovat nyní",
      },

      AccessCode: {
        Title: "Přístupový kód",
        SubTitle: "Administrátor aktivoval šifrovaný přístup",
        Placeholder: "Zadejte přístupový kód",
      },
      CustomEndpoint: {
        Title: "Vlastní rozhraní",
        SubTitle: "Použít vlastní Azure nebo OpenAI službu",
      },
      Provider: {
        Title: "Poskytovatel modelu",
        SubTitle: "Přepnout mezi různými poskytovateli",
      },
      OpenAI: {
        ApiKey: {
          Title: "API Key",
          SubTitle:
            "Použijte vlastní OpenAI Key k obejití přístupového omezení",
          Placeholder: "OpenAI API Key",
        },

        Endpoint: {
          Title: "Adresa rozhraní",
          SubTitle: "Kromě výchozí adresy musí obsahovat http(s)://",
        },
      },
      Azure: {
        ApiKey: {
          Title: "Rozhraní klíč",
          SubTitle: "Použijte vlastní Azure Key k obejití přístupového omezení",
          Placeholder: "Azure API Key",
        },

        Endpoint: {
          Title: "Adresa rozhraní",
          SubTitle: "Příklad:",
        },

        ApiVerion: {
          Title: "Verze rozhraní (azure api version)",
          SubTitle: "Vyberte konkrétní verzi",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "Rozhraní klíč",
          SubTitle:
            "Použijte vlastní Anthropic Key k obejití přístupového omezení",
          Placeholder: "Anthropic API Key",
        },

        Endpoint: {
          Title: "Adresa rozhraní",
          SubTitle: "Příklad:",
        },

        ApiVerion: {
          Title: "Verze rozhraní (claude api version)",
          SubTitle: "Vyberte konkrétní verzi API",
        },
      },
      Google: {
        ApiKey: {
          Title: "API klíč",
          SubTitle: "Získejte svůj API klíč od Google AI",
          Placeholder: "Zadejte svůj Google AI Studio API klíč",
        },

        Endpoint: {
          Title: "Konečná adresa",
          SubTitle: "Příklad:",
        },

        ApiVersion: {
          Title: "Verze API (pouze pro gemini-pro)",
          SubTitle: "Vyberte konkrétní verzi API",
        },
        GoogleSafetySettings: {
          Title: "Úroveň bezpečnostního filtrování Google",
          SubTitle: "Nastavit úroveň filtrování obsahu",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Použijte vlastní Baidu API Key",
          Placeholder: "Baidu API Key",
        },
        SecretKey: {
          Title: "Secret Key",
          SubTitle: "Použijte vlastní Baidu Secret Key",
          Placeholder: "Baidu Secret Key",
        },
        Endpoint: {
          Title: "Adresa rozhraní",
          SubTitle:
            "Nepodporuje vlastní nastavení, přejděte na .env konfiguraci",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "Rozhraní klíč",
          SubTitle: "Použijte vlastní ByteDance API Key",
          Placeholder: "ByteDance API Key",
        },
        Endpoint: {
          Title: "Adresa rozhraní",
          SubTitle: "Příklad:",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "Rozhraní klíč",
          SubTitle: "Použijte vlastní Alibaba Cloud API Key",
          Placeholder: "Alibaba Cloud API Key",
        },
        Endpoint: {
          Title: "Adresa rozhraní",
          SubTitle: "Příklad:",
        },
      },
      CustomModel: {
        Title: "Vlastní názvy modelů",
        SubTitle: "Přidejte možnosti vlastních modelů, oddělené čárkami",
      },
    },

    Model: "Model (model)",
    CompressModel: {
      Title: "Kompresní model",
      SubTitle: "Model používaný pro kompresi historie",
    },
    Temperature: {
      Title: "Náhodnost (temperature)",
      SubTitle: "Čím vyšší hodnota, tím náhodnější odpovědi",
    },
    TopP: {
      Title: "Jádrové vzorkování (top_p)",
      SubTitle: "Podobné náhodnosti, ale neměňte spolu s náhodností",
    },
    MaxTokens: {
      Title: "Omezení odpovědi (max_tokens)",
      SubTitle: "Maximální počet Tokenů použitých v jednom interakci",
    },
    PresencePenalty: {
      Title: "Čerstvost témat (presence_penalty)",
      SubTitle:
        "Čím vyšší hodnota, tím větší pravděpodobnost rozšíření na nová témata",
    },
    FrequencyPenalty: {
      Title: "Penalizace frekvence (frequency_penalty)",
      SubTitle:
        "Čím vyšší hodnota, tím větší pravděpodobnost snížení opakování slov",
    },
  },
  Store: {
    DefaultTopic: "Nový chat",
    BotHello: "Jak vám mohu pomoci?",
    Error: "Došlo k chybě, zkuste to prosím znovu později.",
    Prompt: {
      History: (content: string) =>
        "Toto je shrnutí historie chatu jako kontext: " + content,
      Topic:
        "Použijte čtyři až pět slov pro stručné téma této věty, bez vysvětlení, interpunkce, citoslovcí, nadbytečného textu, bez tučného písma. Pokud téma neexistuje, vraťte pouze 'neformální chat'.",
      Summarize:
        "Stručně shrňte obsah konverzace jako kontextový prompt pro budoucí použití, do 200 slov",
    },
  },
  Copy: {
    Success: "Zkopírováno do schránky",
    Failed: "Kopírování selhalo, prosím, povolte přístup ke schránce",
  },
  Download: {
    Success: "Obsah byl stažen do vašeho adresáře.",
    Failed: "Stahování selhalo.",
  },
  Context: {
    Toast: (x: any) => `Obsahuje ${x} přednastavených promptů`,
    Edit: "Nastavení aktuální konverzace",
    Add: "Přidat novou konverzaci",
    Clear: "Kontext byl vymazán",
    Revert: "Obnovit kontext",
  },
  Plugin: {
    Name: "Plugin",
  },
  FineTuned: {
    Sysmessage: "Jste asistent",
  },
  SearchChat: {
    Name: "Hledat",
    Page: {
      Title: "Hledat v historii chatu",
      Search: "Zadejte hledané klíčové slovo",
      NoResult: "Nebyly nalezeny žádné výsledky",
      NoData: "Žádná data",
      Loading: "Načítání",

      SubTitle: (count: number) => `Nalezeno ${count} výsledků`,
    },
    Item: {
      View: "Zobrazit",
    },
  },
  Mask: {
    Name: "Maska",
    Page: {
      Title: "Přednastavené role masky",
      SubTitle: (count: number) => `${count} definovaných rolí`,
      Search: "Hledat role masky",
      Create: "Nový",
    },
    Item: {
      Info: (count: number) => `Obsahuje ${count} přednastavených konverzací`,
      Chat: "Chat",
      View: "Zobrazit",
      Edit: "Upravit",
      Delete: "Smazat",
      DeleteConfirm: "Opravdu chcete smazat?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Upravit přednastavenou masku ${readonly ? " (jen pro čtení)" : ""}`,
      Download: "Stáhnout přednastavení",
      Clone: "Klonovat přednastavení",
    },
    Config: {
      Avatar: "Profilový obrázek",
      Name: "Název role",
      Sync: {
        Title: "Použít globální nastavení",
        SubTitle: "Použít globální modelová nastavení pro aktuální konverzaci",
        Confirm:
          "Vaše vlastní nastavení konverzace bude automaticky přepsáno, opravdu chcete použít globální nastavení?",
      },
      HideContext: {
        Title: "Skrýt přednastavené konverzace",
        SubTitle:
          "Po skrytí se přednastavené konverzace nebudou zobrazovat v chatovém rozhraní",
      },
      Share: {
        Title: "Sdílet tuto masku",
        SubTitle: "Generovat přímý odkaz na tuto masku",
        Action: "Kopírovat odkaz",
      },
    },
  },
  NewChat: {
    Return: "Zpět",
    Skip: "Začít hned",
    NotShow: "Zobrazit už nikdy",
    ConfirmNoShow:
      "Opravdu chcete zakázat? Zakázání můžete kdykoli znovu povolit v nastavení.",
    Title: "Vyberte masku",
    SubTitle: "Začněte nyní a konfrontujte se s myslí za maskou",
    More: "Zobrazit vše",
  },

  URLCommand: {
    Code: "Byl detekován přístupový kód v odkazu, chcete jej automaticky vyplnit?",
    Settings:
      "Byla detekována přednastavená nastavení v odkazu, chcete je automaticky vyplnit?",
  },

  UI: {
    Confirm: "Potvrdit",
    Cancel: "Zrušit",
    Close: "Zavřít",
    Create: "Nový",
    Edit: "Upravit",
    Export: "Exportovat",
    Import: "Importovat",
    Sync: "Synchronizovat",
    Config: "Konfigurovat",
  },
  Exporter: {
    Description: {
      Title: "Pouze zprávy po vymazání kontextu budou zobrazeny",
    },
    Model: "Model",
    Messages: "Zprávy",
    Topic: "Téma",
    Time: "Čas",
  },
};

export default cs;
