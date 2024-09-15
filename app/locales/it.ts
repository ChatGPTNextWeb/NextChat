import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";
import { getClientConfig } from "../config/client";

const isApp = !!getClientConfig()?.isApp;

const it: PartialLocaleType = {
  WIP: "Work in progress...",
  Error: {
    Unauthorized: isApp
      ? "API Key non valido rilevato. Vai alla pagina [Impostazioni](/#/settings) per controllare se l'API Key è configurata correttamente."
      : "La password di accesso è errata o mancante. Vai alla pagina [Login](/#/auth) per inserire la password corretta o inserisci la tua API Key OpenAI nella pagina [Impostazioni](/#/settings).",
  },
  Auth: {
    Title: "Password richiesta",
    Tips: "L'amministratore ha abilitato la verifica della password. Inserisci il codice di accesso qui sotto",
    SubTips: "O inserisci la tua chiave API OpenAI o Google",
    Input: "Inserisci il codice di accesso qui",
    Confirm: "Conferma",
    Later: "Più tardi",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} conversazioni`,
  },
  Chat: {
    SubTitle: (count: number) => `Totale ${count} conversazioni`,
    EditMessage: {
      Title: "Modifica cronologia messaggi",
      Topic: {
        Title: "Argomento della chat",
        SubTitle: "Modifica l'argomento della chat corrente",
      },
    },
    Actions: {
      ChatList: "Visualizza l'elenco dei messaggi",
      CompressedHistory: "Visualizza la cronologia Prompt compressa",
      Export: "Esporta la cronologia chat",
      Copy: "Copia",
      Stop: "Interrompi",
      Retry: "Riprova",
      Pin: "Fissa",
      PinToastContent: "1 conversazione fissata ai suggerimenti predefiniti",
      PinToastAction: "Visualizza",
      Delete: "Elimina",
      Edit: "Modifica",
      RefreshTitle: "Aggiorna titolo",
      RefreshToast: "Richiesta di aggiornamento del titolo inviata",
    },
    Commands: {
      new: "Nuova chat",
      newm: "Nuova chat da maschera",
      next: "Chat successiva",
      prev: "Chat precedente",
      clear: "Pulisci contesto",
      del: "Elimina chat",
    },
    InputActions: {
      Stop: "Interrompi risposta",
      ToBottom: "Scorri fino al più recente",
      Theme: {
        auto: "Tema automatico",
        light: "Tema chiaro",
        dark: "Tema scuro",
      },
      Prompt: "Comandi rapidi",
      Masks: "Tutte le maschere",
      Clear: "Pulisci chat",
      Settings: "Impostazioni conversazione",
      UploadImage: "Carica immagine",
    },
    Rename: "Rinomina conversazione",
    Typing: "Digitazione in corso…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} per inviare`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "，Shift + Enter per andare a capo";
      }
      return (
        inputHints +
        "，/ per attivare il completamento automatico, : per attivare il comando"
      );
    },
    Send: "Invia",
    Config: {
      Reset: "Pulisci memoria",
      SaveAs: "Salva come maschera",
    },
    IsContext: "Suggerimenti predefiniti",
  },
  Export: {
    Title: "Condividi cronologia chat",
    Copy: "Copia tutto",
    Download: "Scarica file",
    Share: "Condividi su ShareGPT",
    MessageFromYou: "Utente",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "Formato di esportazione",
      SubTitle: "Puoi esportare come testo Markdown o immagine PNG",
    },
    IncludeContext: {
      Title: "Includi contesto maschera",
      SubTitle: "Mostrare il contesto della maschera nei messaggi",
    },
    Steps: {
      Select: "Seleziona",
      Preview: "Anteprima",
    },
    Image: {
      Toast: "Generazione dello screenshot in corso",
      Modal:
        "Tieni premuto o fai clic con il tasto destro per salvare l'immagine",
    },
  },
  Select: {
    Search: "Cerca messaggi",
    All: "Seleziona tutto",
    Latest: "Ultimi messaggi",
    Clear: "Pulisci selezione",
  },
  Memory: {
    Title: "Riassunto storico",
    EmptyContent:
      "Il contenuto della conversazione è troppo breve, nessun riassunto necessario",
    Send: "Comprimi automaticamente la cronologia chat e inviala come contesto",
    Copy: "Copia riassunto",
    Reset: "[unused]",
    ResetConfirm: "Confermi la cancellazione del riassunto storico?",
  },
  Home: {
    NewChat: "Nuova chat",
    DeleteChat: "Confermi l'eliminazione della conversazione selezionata?",
    DeleteToast: "Conversazione eliminata",
    Revert: "Annulla",
  },
  Settings: {
    Title: "Impostazioni",
    SubTitle: "Tutte le opzioni di impostazione",

    Danger: {
      Reset: {
        Title: "Ripristina tutte le impostazioni",
        SubTitle: "Ripristina tutte le opzioni ai valori predefiniti",
        Action: "Ripristina subito",
        Confirm: "Confermi il ripristino di tutte le impostazioni?",
      },
      Clear: {
        Title: "Elimina tutti i dati",
        SubTitle: "Elimina tutte le chat e i dati delle impostazioni",
        Action: "Elimina subito",
        Confirm:
          "Confermi l'eliminazione di tutte le chat e dei dati delle impostazioni?",
      },
    },
    Lang: {
      Name: "Language", // ATTENZIONE: se vuoi aggiungere una nuova traduzione, non tradurre questo valore, lascialo come `Language`
      All: "Tutte le lingue",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Dimensione del carattere",
      SubTitle: "Dimensione del carattere per il contenuto della chat",
    },
    FontFamily: {
      Title: "Font della Chat",
      SubTitle:
        "Carattere del contenuto della chat, lascia vuoto per applicare il carattere predefinito globale",
      Placeholder: "Nome del Font",
    },
    InjectSystemPrompts: {
      Title: "Inserisci suggerimenti di sistema",
      SubTitle:
        "Aggiungi forzatamente un suggerimento di sistema simulato di ChatGPT all'inizio della lista dei messaggi per ogni richiesta",
    },
    InputTemplate: {
      Title: "Preprocessing dell'input utente",
      SubTitle:
        "L'ultimo messaggio dell'utente verrà inserito in questo modello",
    },

    Update: {
      Version: (x: string) => `Versione attuale: ${x}`,
      IsLatest: "È l'ultima versione",
      CheckUpdate: "Controlla aggiornamenti",
      IsChecking: "Verifica aggiornamenti in corso...",
      FoundUpdate: (x: string) => `Nuova versione trovata: ${x}`,
      GoToUpdate: "Vai all'aggiornamento",
    },
    SendKey: "Tasto di invio",
    Theme: "Tema",
    TightBorder: "Modalità senza bordi",
    SendPreviewBubble: {
      Title: "Bolla di anteprima",
      SubTitle: "Anteprima del contenuto Markdown nella bolla di anteprima",
    },
    AutoGenerateTitle: {
      Title: "Generazione automatica del titolo",
      SubTitle:
        "Genera un titolo appropriato in base al contenuto della conversazione",
    },
    Sync: {
      CloudState: "Dati cloud",
      NotSyncYet: "Non è ancora avvenuta alcuna sincronizzazione",
      Success: "Sincronizzazione riuscita",
      Fail: "Sincronizzazione fallita",

      Config: {
        Modal: {
          Title: "Configura sincronizzazione cloud",
          Check: "Controlla disponibilità",
        },
        SyncType: {
          Title: "Tipo di sincronizzazione",
          SubTitle: "Scegli il server di sincronizzazione preferito",
        },
        Proxy: {
          Title: "Abilita proxy",
          SubTitle:
            "Durante la sincronizzazione nel browser, è necessario abilitare il proxy per evitare restrizioni CORS",
        },
        ProxyUrl: {
          Title: "Indirizzo proxy",
          SubTitle: "Solo per il proxy CORS fornito con questo progetto",
        },

        WebDav: {
          Endpoint: "Indirizzo WebDAV",
          UserName: "Nome utente",
          Password: "Password",
        },

        UpStash: {
          Endpoint: "URL REST di UpStash Redis",
          UserName: "Nome di backup",
          Password: "Token REST di UpStash Redis",
        },
      },

      LocalState: "Dati locali",
      Overview: (overview: any) => {
        return `${overview.chat} chat, ${overview.message} messaggi, ${overview.prompt} suggerimenti, ${overview.mask} maschere`;
      },
      ImportFailed: "Importazione fallita",
    },
    Mask: {
      Splash: {
        Title: "Pagina di avvio delle maschere",
        SubTitle:
          "Mostra la pagina di avvio delle maschere quando si avvia una nuova chat",
      },
      Builtin: {
        Title: "Nascondi maschere predefinite",
        SubTitle:
          "Nascondi le maschere predefinite in tutte le liste delle maschere",
      },
    },
    Prompt: {
      Disable: {
        Title: "Disabilita completamento automatico dei suggerimenti",
        SubTitle:
          "Inserisci / all'inizio della casella di input per attivare il completamento automatico",
      },
      List: "Elenco dei suggerimenti personalizzati",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} predefiniti, ${custom} definiti dall'utente`,
      Edit: "Modifica",
      Modal: {
        Title: "Elenco dei suggerimenti",
        Add: "Nuovo",
        Search: "Cerca suggerimenti",
      },
      EditModal: {
        Title: "Modifica suggerimenti",
      },
    },
    HistoryCount: {
      Title: "Numero di messaggi storici inclusi",
      SubTitle: "Numero di messaggi storici inclusi in ogni richiesta",
    },
    CompressThreshold: {
      Title: "Soglia di compressione dei messaggi storici",
      SubTitle:
        "Quando i messaggi storici non compressi superano questo valore, verranno compressi",
    },

    Usage: {
      Title: "Verifica saldo",
      SubTitle(used: any, total: any) {
        return `Utilizzato questo mese $${used}, totale abbonamento $${total}`;
      },
      IsChecking: "Verifica in corso…",
      Check: "Verifica di nuovo",
      NoAccess:
        "Inserisci API Key o password di accesso per visualizzare il saldo",
    },

    Access: {
      AccessCode: {
        Title: "Password di accesso",
        SubTitle: "L'amministratore ha abilitato l'accesso criptato",
        Placeholder: "Inserisci la password di accesso",
      },
      CustomEndpoint: {
        Title: "Interfaccia personalizzata",
        SubTitle: "Utilizzare servizi Azure o OpenAI personalizzati",
      },
      Provider: {
        Title: "Fornitore del modello",
        SubTitle: "Cambia fornitore di servizi",
      },
      OpenAI: {
        ApiKey: {
          Title: "API Key",
          SubTitle:
            "Utilizza una chiave OpenAI personalizzata per bypassare le limitazioni di accesso",
          Placeholder: "API Key OpenAI",
        },

        Endpoint: {
          Title: "Indirizzo dell'interfaccia",
          SubTitle: "Deve includere http(s):// oltre all'indirizzo predefinito",
        },
      },
      Azure: {
        ApiKey: {
          Title: "Chiave dell'interfaccia",
          SubTitle:
            "Utilizza una chiave Azure personalizzata per bypassare le limitazioni di accesso",
          Placeholder: "Chiave API Azure",
        },

        Endpoint: {
          Title: "Indirizzo dell'interfaccia",
          SubTitle: "Esempio:",
        },

        ApiVerion: {
          Title: "Versione dell'interfaccia (versione api azure)",
          SubTitle: "Scegli una versione specifica",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "Chiave dell'interfaccia",
          SubTitle:
            "Utilizza una chiave Anthropic personalizzata per bypassare le limitazioni di accesso",
          Placeholder: "API Key Anthropic",
        },

        Endpoint: {
          Title: "Indirizzo dell'interfaccia",
          SubTitle: "Esempio:",
        },

        ApiVerion: {
          Title: "Versione dell'interfaccia (versione api claude)",
          SubTitle: "Scegli una versione API specifica",
        },
      },
      Google: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Ottieni la tua chiave API da Google AI",
          Placeholder: "Inserisci la tua chiave API Google AI Studio",
        },

        Endpoint: {
          Title: "Indirizzo dell'interfaccia",
          SubTitle: "Esempio:",
        },

        ApiVersion: {
          Title: "Versione API (solo per gemini-pro)",
          SubTitle: "Scegli una versione API specifica",
        },
        GoogleSafetySettings: {
          Title: "Livello di filtraggio sicurezza Google",
          SubTitle: "Imposta il livello di filtraggio dei contenuti",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Utilizza una chiave API Baidu personalizzata",
          Placeholder: "API Key Baidu",
        },
        SecretKey: {
          Title: "Secret Key",
          SubTitle: "Utilizza una chiave segreta Baidu personalizzata",
          Placeholder: "Secret Key Baidu",
        },
        Endpoint: {
          Title: "Indirizzo dell'interfaccia",
          SubTitle:
            "Non supporta configurazioni personalizzate, andare su .env",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "Chiave dell'interfaccia",
          SubTitle: "Utilizza una chiave API ByteDance personalizzata",
          Placeholder: "API Key ByteDance",
        },
        Endpoint: {
          Title: "Indirizzo dell'interfaccia",
          SubTitle: "Esempio:",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "Chiave dell'interfaccia",
          SubTitle: "Utilizza una chiave API Alibaba Cloud personalizzata",
          Placeholder: "API Key Alibaba Cloud",
        },
        Endpoint: {
          Title: "Indirizzo dell'interfaccia",
          SubTitle: "Esempio:",
        },
      },
      CustomModel: {
        Title: "Nome del modello personalizzato",
        SubTitle:
          "Aggiungi opzioni di modelli personalizzati, separati da virgole",
      },
    },

    Model: "Modello (model)",
    CompressModel: {
      Title: "Modello di compressione",
      SubTitle: "Modello utilizzato per comprimere la cronologia",
    },
    Temperature: {
      Title: "Casualità (temperature)",
      SubTitle: "Valore più alto, risposte più casuali",
    },
    TopP: {
      Title: "Campionamento nucleare (top_p)",
      SubTitle:
        "Simile alla casualità, ma non cambiarlo insieme alla casualità",
    },
    MaxTokens: {
      Title: "Limite di token per risposta (max_tokens)",
      SubTitle: "Numero massimo di token per ogni interazione",
    },
    PresencePenalty: {
      Title: "Novità del tema (presence_penalty)",
      SubTitle:
        "Valore più alto, maggiore possibilità di espandere a nuovi argomenti",
    },
    FrequencyPenalty: {
      Title: "Penalità di frequenza (frequency_penalty)",
      SubTitle:
        "Valore più alto, maggiore possibilità di ridurre le ripetizioni",
    },
  },
  Store: {
    DefaultTopic: "Nuova chat",
    BotHello: "Come posso aiutarti?",
    Error: "Si è verificato un errore, riprova più tardi",
    Prompt: {
      History: (content: string) =>
        "Questo è un riassunto della chat storica come contesto: " + content,
      Topic:
        "Riporta il tema di questa frase in modo conciso con quattro o cinque parole, senza spiegazioni, punteggiatura, interiezioni, testo superfluo e senza grassetto. Se non c'è un tema, rispondi direttamente con 'chit-chat'",
      Summarize:
        "Riassumi brevemente il contenuto della conversazione come prompt di contesto per il seguito, mantenendolo entro 200 parole",
    },
  },
  Copy: {
    Success: "Copiato negli appunti",
    Failed: "Copia fallita, concedi i permessi per gli appunti",
  },
  Download: {
    Success: "Contenuto scaricato nella tua directory.",
    Failed: "Download fallito.",
  },
  Context: {
    Toast: (x: any) => `Include ${x} suggerimenti predefiniti`,
    Edit: "Impostazioni della conversazione attuale",
    Add: "Aggiungi una conversazione",
    Clear: "Contesto cancellato",
    Revert: "Ripristina contesto",
  },
  Plugin: {
    Name: "Plugin",
  },
  FineTuned: {
    Sysmessage: "Sei un assistente",
  },
  SearchChat: {
    Name: "Cerca",
    Page: {
      Title: "Cerca nei messaggi",
      Search: "Inserisci parole chiave per la ricerca",
      NoResult: "Nessun risultato trovato",
      NoData: "Nessun dato",
      Loading: "Caricamento in corso",

      SubTitle: (count: number) => `Trovati ${count} risultati`,
    },
    Item: {
      View: "Visualizza",
    },
  },
  Mask: {
    Name: "Maschera",
    Page: {
      Title: "Maschere dei ruoli predefiniti",
      SubTitle: (count: number) => `${count} definizioni di ruoli predefiniti`,
      Search: "Cerca maschere di ruolo",
      Create: "Crea nuovo",
    },
    Item: {
      Info: (count: number) => `Include ${count} conversazioni predefinite`,
      Chat: "Conversazione",
      View: "Visualizza",
      Edit: "Modifica",
      Delete: "Elimina",
      DeleteConfirm: "Confermi eliminazione?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Modifica maschera predefinita ${readonly ? "(sola lettura)" : ""}`,
      Download: "Scarica predefinito",
      Clone: "Clona predefinito",
    },
    Config: {
      Avatar: "Avatar del ruolo",
      Name: "Nome del ruolo",
      Sync: {
        Title: "Utilizza impostazioni globali",
        SubTitle:
          "La conversazione attuale utilizzerà le impostazioni globali del modello",
        Confirm:
          "Le impostazioni personalizzate della conversazione attuale verranno sovrascritte automaticamente, confermi l'attivazione delle impostazioni globali?",
      },
      HideContext: {
        Title: "Nascondi conversazioni predefinite",
        SubTitle:
          "Le conversazioni predefinite non appariranno nella finestra della chat dopo averle nascoste",
      },
      Share: {
        Title: "Condividi questa maschera",
        SubTitle: "Genera un link diretto a questa maschera",
        Action: "Copia link",
      },
    },
  },
  NewChat: {
    Return: "Torna",
    Skip: "Inizia subito",
    NotShow: "Non mostrare più",
    ConfirmNoShow:
      "Confermi di disabilitare? Dopo la disabilitazione, puoi riattivare in qualsiasi momento dalle impostazioni.",
    Title: "Scegli una maschera",
    SubTitle: "Inizia ora e interagisci con il pensiero dietro la maschera",
    More: "Vedi tutto",
  },

  URLCommand: {
    Code: "Codice di accesso rilevato nel link, riempirlo automaticamente?",
    Settings:
      "Impostazioni predefinite rilevate nel link, riempirle automaticamente?",
  },

  UI: {
    Confirm: "Conferma",
    Cancel: "Annulla",
    Close: "Chiudi",
    Create: "Crea",
    Edit: "Modifica",
    Export: "Esporta",
    Import: "Importa",
    Sync: "Sincronizza",
    Config: "Configura",
  },
  Exporter: {
    Description: {
      Title:
        "Solo i messaggi dopo la cancellazione del contesto verranno visualizzati",
    },
    Model: "Modello",
    Messages: "Messaggi",
    Topic: "Tema",
    Time: "Tempo",
  },
};

export default it;
