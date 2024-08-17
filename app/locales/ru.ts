import { SubmitKey } from "../store/config";
import { PartialLocaleType } from "../locales/index";
import { getClientConfig } from "../config/client";

const isApp = !!getClientConfig()?.isApp;

const ru: PartialLocaleType = {
  WIP: "Скоро...",
  Error: {
    Unauthorized: isApp
      ? "Обнаружен недействительный API-ключ. Пожалуйста, перейдите на страницу [Настройки](/#/settings), чтобы проверить правильность конфигурации API-ключа."
      : "Неверный или пустой пароль доступа. Пожалуйста, перейдите на страницу [Вход](/#/auth), чтобы ввести правильный пароль доступа, или на страницу [Настройки](/#/settings), чтобы ввести ваш собственный API-ключ OpenAI.",
  },
  Auth: {
    Title: "Требуется пароль",
    Tips: "Администратор включил проверку пароля. Пожалуйста, введите код доступа ниже",
    SubTips: "Или введите ваш API-ключ OpenAI или Google",
    Input: "Введите код доступа здесь",
    Confirm: "Подтвердить",
    Later: "Позже",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} бесед`,
  },
  Chat: {
    SubTitle: (count: number) => `Всего ${count} бесед`,
    EditMessage: {
      Title: "Редактировать сообщение",
      Topic: {
        Title: "Тема чата",
        SubTitle: "Изменить текущую тему чата",
      },
    },
    Actions: {
      ChatList: "Просмотреть список сообщений",
      CompressedHistory: "Просмотреть сжатую историю подсказок",
      Export: "Экспортировать чат",
      Copy: "Копировать",
      Stop: "Остановить",
      Retry: "Повторить",
      Pin: "Закрепить",
      PinToastContent: "1 беседа закреплена в предустановленных подсказках",
      PinToastAction: "Просмотреть",
      Delete: "Удалить",
      Edit: "Редактировать",
    },
    Commands: {
      new: "Новый чат",
      newm: "Создать чат из маски",
      next: "Следующий чат",
      prev: "Предыдущий чат",
      clear: "Очистить контекст",
      del: "Удалить чат",
    },
    InputActions: {
      Stop: "Остановить ответ",
      ToBottom: "Перейти к последнему",
      Theme: {
        auto: "Автоматическая тема",
        light: "Светлая тема",
        dark: "Темная тема",
      },
      Prompt: "Быстрая команда",
      Masks: "Все маски",
      Clear: "Очистить чат",
      Settings: "Настройки чата",
      UploadImage: "Загрузить изображение",
    },
    Rename: "Переименовать чат",
    Typing: "Печатает…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} Отправить`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "，Shift + Enter для новой строки";
      }
      return inputHints + "，/ для автозаполнения，: для команд";
    },
    Send: "Отправить",
    Config: {
      Reset: "Очистить память",
      SaveAs: "Сохранить как маску",
    },
    IsContext: "Предустановленные подсказки",
  },
  Export: {
    Title: "Поделиться историей чата",
    Copy: "Копировать все",
    Download: "Скачать файл",
    Share: "Поделиться в ShareGPT",
    MessageFromYou: "Пользователь",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "Формат экспорта",
      SubTitle: "Можно экспортировать как Markdown текст или PNG изображение",
    },
    IncludeContext: {
      Title: "Включить контекст маски",
      SubTitle: "Показывать ли контекст маски в сообщениях",
    },
    Steps: {
      Select: "Выбрать",
      Preview: "Предпросмотр",
    },
    Image: {
      Toast: "Создание скриншота",
      Modal: "Длительное нажатие или правый клик для сохранения изображения",
    },
  },
  Select: {
    Search: "Поиск сообщений",
    All: "Выбрать все",
    Latest: "Последние сообщения",
    Clear: "Очистить выбор",
  },
  Memory: {
    Title: "Историческое резюме",
    EmptyContent: "Содержимое чата слишком короткое, чтобы суммировать",
    Send: "Автоматически сжать историю чата и отправить как контекст",
    Copy: "Копировать резюме",
    Reset: "[не используется]",
    ResetConfirm: "Подтвердить очистку исторического резюме?",
  },
  Home: {
    NewChat: "Новый чат",
    DeleteChat: "Подтвердить удаление выбранного чата?",
    DeleteToast: "Беседа удалена",
    Revert: "Отменить",
  },
  Settings: {
    Title: "Настройки",
    SubTitle: "Все параметры настроек",

    Danger: {
      Reset: {
        Title: "Сброс всех настроек",
        SubTitle: "Сброс всех параметров до значений по умолчанию",
        Action: "Сбросить сейчас",
        Confirm: "Подтвердить сброс всех настроек?",
      },
      Clear: {
        Title: "Очистить все данные",
        SubTitle: "Очистить все чаты и данные настроек",
        Action: "Очистить сейчас",
        Confirm: "Подтвердить очистку всех чатов и данных настроек?",
      },
    },
    Lang: {
      Name: "Language", // ATTENTION: если вы хотите добавить новый перевод, не переводите это значение, оставьте его как `Language`
      All: "Все языки",
    },
    Avatar: "Аватар",
    FontSize: {
      Title: "Размер шрифта",
      SubTitle: "Размер шрифта в чате",
    },
    FontFamily: {
      Title: "Шрифт чата",
      SubTitle:
        "Шрифт содержимого чата, оставьте пустым для применения глобального шрифта по умолчанию",
      Placeholder: "Название шрифта",
    },
    InjectSystemPrompts: {
      Title: "Вставить системные подсказки",
      SubTitle:
        "Принудительно добавлять системную подсказку, имитирующую ChatGPT, в начале каждого запроса",
    },
    InputTemplate: {
      Title: "Предварительная обработка пользовательского ввода",
      SubTitle:
        "Последнее сообщение пользователя будет подставлено в этот шаблон",
    },

    Update: {
      Version: (x: string) => `Текущая версия: ${x}`,
      IsLatest: "Установлена последняя версия",
      CheckUpdate: "Проверить обновления",
      IsChecking: "Проверка обновлений...",
      FoundUpdate: (x: string) => `Найдено новое обновление: ${x}`,
      GoToUpdate: "Перейти к обновлению",
    },
    SendKey: "Кнопка отправки",
    Theme: "Тема",
    TightBorder: "Режим без границ",
    SendPreviewBubble: {
      Title: "Предварительный просмотр пузырьков",
      SubTitle:
        "Просмотр содержимого Markdown в пузырьках предварительного просмотра",
    },
    AutoGenerateTitle: {
      Title: "Автоматическое создание заголовка",
      SubTitle: "Создание подходящего заголовка на основе содержания беседы",
    },
    Sync: {
      CloudState: "Облачные данные",
      NotSyncYet: "Синхронизация еще не проводилась",
      Success: "Синхронизация успешна",
      Fail: "Не удалось синхронизировать",

      Config: {
        Modal: {
          Title: "Настройки облачной синхронизации",
          Check: "Проверить доступность",
        },
        SyncType: {
          Title: "Тип синхронизации",
          SubTitle: "Выберите предпочитаемый сервер синхронизации",
        },
        Proxy: {
          Title: "Включить прокси",
          SubTitle:
            "При синхронизации в браузере необходимо включить прокси для предотвращения ограничений кросс-домена",
        },
        ProxyUrl: {
          Title: "Адрес прокси",
          SubTitle: "Только для встроенного прокси в проекте",
        },

        WebDav: {
          Endpoint: "WebDAV адрес",
          UserName: "Имя пользователя",
          Password: "Пароль",
        },

        UpStash: {
          Endpoint: "UpStash Redis REST Url",
          UserName: "Имя резервной копии",
          Password: "UpStash Redis REST Token",
        },
      },

      LocalState: "Локальные данные",
      Overview: (overview: any) => {
        return `${overview.chat} бесед, ${overview.message} сообщений, ${overview.prompt} подсказок, ${overview.mask} масок`;
      },
      ImportFailed: "Не удалось импортировать",
    },
    Mask: {
      Splash: {
        Title: "Стартовая страница масок",
        SubTitle:
          "При создании нового чата отображать стартовую страницу масок",
      },
      Builtin: {
        Title: "Скрыть встроенные маски",
        SubTitle: "Скрыть встроенные маски во всех списках масок",
      },
    },
    Prompt: {
      Disable: {
        Title: "Отключить автозаполнение подсказок",
        SubTitle: "Введите / в начале строки для активации автозаполнения",
      },
      List: "Список пользовательских подсказок",
      ListCount: (builtin: number, custom: number) =>
        `Встроенные ${builtin}, пользовательские ${custom}`,
      Edit: "Редактировать",
      Modal: {
        Title: "Список подсказок",
        Add: "Создать",
        Search: "Поиск подсказок",
      },
      EditModal: {
        Title: "Редактировать подсказки",
      },
    },
    HistoryCount: {
      Title: "Количество истории сообщений",
      SubTitle: "Количество историй сообщений, отправляемых с каждым запросом",
    },
    CompressThreshold: {
      Title: "Порог сжатия длины истории сообщений",
      SubTitle:
        "Когда не сжатая история сообщений превышает это значение, происходит сжатие",
    },

    Usage: {
      Title: "Проверка баланса",
      SubTitle(used: any, total: any) {
        return `Использовано в этом месяце $${used}, всего по подписке $${total}`;
      },
      IsChecking: "Проверка…",
      Check: "Проверить снова",
      NoAccess: "Введите API-ключ или пароль доступа для просмотра баланса",
    },

    Access: {
      AccessCode: {
        Title: "Пароль доступа",
        SubTitle: "Администратор включил защиту паролем",
        Placeholder: "Введите пароль доступа",
      },
      CustomEndpoint: {
        Title: "Пользовательский интерфейс",
        SubTitle: "Использовать ли пользовательский Azure или OpenAI сервис",
      },
      Provider: {
        Title: "Провайдер модели",
        SubTitle: "Переключиться на другого провайдера",
      },
      OpenAI: {
        ApiKey: {
          Title: "API-ключ",
          SubTitle:
            "Использовать пользовательский OpenAI-ключ для обхода ограничений пароля",
          Placeholder: "OpenAI API-ключ",
        },

        Endpoint: {
          Title: "Адрес интерфейса",
          SubTitle: "Кроме адреса по умолчанию, должен содержать http(s)://",
        },
      },
      Azure: {
        ApiKey: {
          Title: "Ключ интерфейса",
          SubTitle:
            "Использовать пользовательский Azure-ключ для обхода ограничений пароля",
          Placeholder: "Azure API-ключ",
        },

        Endpoint: {
          Title: "Адрес интерфейса",
          SubTitle: "Пример:",
        },

        ApiVerion: {
          Title: "Версия интерфейса (azure api version)",
          SubTitle: "Выберите конкретную версию",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "Ключ интерфейса",
          SubTitle:
            "Использовать пользовательский Anthropic-ключ для обхода ограничений пароля",
          Placeholder: "Anthropic API-ключ",
        },

        Endpoint: {
          Title: "Адрес интерфейса",
          SubTitle: "Пример:",
        },

        ApiVerion: {
          Title: "Версия интерфейса (claude api version)",
          SubTitle: "Выберите конкретную версию API",
        },
      },
      Google: {
        ApiKey: {
          Title: "API-ключ",
          SubTitle: "Получите ваш API-ключ Google AI",
          Placeholder: "Введите ваш API-ключ Google AI Studio",
        },

        Endpoint: {
          Title: "Адрес интерфейса",
          SubTitle: "Пример:",
        },

        ApiVersion: {
          Title: "Версия API (только для gemini-pro)",
          SubTitle: "Выберите конкретную версию API",
        },
        GoogleSafetySettings: {
          Title: "Уровень фильтрации Google",
          SubTitle: "Настроить уровень фильтрации контента",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "API-ключ",
          SubTitle: "Использовать пользовательский Baidu API-ключ",
          Placeholder: "Baidu API-ключ",
        },
        SecretKey: {
          Title: "Секретный ключ",
          SubTitle: "Использовать пользовательский Baidu Secret Key",
          Placeholder: "Baidu Secret Key",
        },
        Endpoint: {
          Title: "Адрес интерфейса",
          SubTitle:
            "Не поддерживает пользовательскую настройку, перейдите в .env",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "Ключ интерфейса",
          SubTitle: "Использовать пользовательский ByteDance API-ключ",
          Placeholder: "ByteDance API-ключ",
        },
        Endpoint: {
          Title: "Адрес интерфейса",
          SubTitle: "Пример:",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "Ключ интерфейса",
          SubTitle: "Использовать пользовательский Alibaba Cloud API-ключ",
          Placeholder: "Alibaba Cloud API-ключ",
        },
        Endpoint: {
          Title: "Адрес интерфейса",
          SubTitle: "Пример:",
        },
      },
      CustomModel: {
        Title: "Название пользовательской модели",
        SubTitle:
          "Добавьте варианты пользовательских моделей, разделяя запятыми",
      },
    },

    Model: "Модель",
    Temperature: {
      Title: "Случайность (temperature)",
      SubTitle: "Чем больше значение, тем более случайные ответы",
    },
    TopP: {
      Title: "Ядро выборки (top_p)",
      SubTitle: "Похожие на случайность, но не изменяйте вместе с случайностью",
    },
    MaxTokens: {
      Title: "Ограничение на количество токенов за один раз (max_tokens)",
      SubTitle: "Максимальное количество токенов на одно взаимодействие",
    },
    PresencePenalty: {
      Title: "Наказание за новизну тем (presence_penalty)",
      SubTitle:
        "Чем больше значение, тем выше вероятность расширения на новые темы",
    },
    FrequencyPenalty: {
      Title: "Наказание за частоту (frequency_penalty)",
      SubTitle:
        "Чем больше значение, тем выше вероятность уменьшения повторяющихся слов",
    },
  },
  Store: {
    DefaultTopic: "Новый чат",
    BotHello: "Чем могу помочь?",
    Error: "Произошла ошибка, попробуйте позже",
    Prompt: {
      History: (content: string) =>
        "Это резюме истории чата как предыстория: " + content,
      Topic:
        "Укажите краткую тему этого сообщения в четырех-пяти словах, без объяснений, знаков препинания, междометий, лишнего текста или выделения. Если темы нет, просто напишите 'Болтовня'",
      Summarize:
        "Кратко подведите итоги содержимого беседы для использования в качестве последующего контекстного запроса, не более 200 слов",
    },
  },
  Copy: {
    Success: "Скопировано в буфер обмена",
    Failed: "Не удалось скопировать, предоставьте доступ к буферу обмена",
  },
  Download: {
    Success: "Содержимое успешно загружено в вашу директорию.",
    Failed: "Не удалось загрузить.",
  },
  Context: {
    Toast: (x: any) => `Содержит ${x} предустановленных подсказок`,
    Edit: "Текущие настройки чата",
    Add: "Добавить новый чат",
    Clear: "Контекст очищен",
    Revert: "Восстановить контекст",
  },
  Plugin: {
    Name: "Плагины",
  },
  FineTuned: {
    Sysmessage: "Вы - помощник",
  },
  Mask: {
    Name: "Маска",
    Page: {
      Title: "Предустановленные роли",
      SubTitle: (count: number) => `${count} предустановленных ролей`,
      Search: "Поиск ролей",
      Create: "Создать",
    },
    Item: {
      Info: (count: number) => `Содержит ${count} предустановленных диалогов`,
      Chat: "Диалог",
      View: "Просмотреть",
      Edit: "Редактировать",
      Delete: "Удалить",
      DeleteConfirm: "Подтвердить удаление?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Редактирование предустановленной маски ${
          readonly ? "（только для чтения）" : ""
        }`,
      Download: "Скачать предустановку",
      Clone: "Клонировать предустановку",
    },
    Config: {
      Avatar: "Аватар роли",
      Name: "Название роли",
      Sync: {
        Title: "Использовать глобальные настройки",
        SubTitle:
          "Будет ли текущий чат использовать глобальные настройки модели",
        Confirm:
          "Пользовательские настройки текущего чата будут автоматически заменены, подтвердите активацию глобальных настроек?",
      },
      HideContext: {
        Title: "Скрыть предустановленные диалоги",
        SubTitle:
          "После скрытия предустановленные диалоги не будут отображаться в чате",
      },
      Share: {
        Title: "Поделиться этой маской",
        SubTitle: "Создать прямую ссылку на эту маску",
        Action: "Скопировать ссылку",
      },
    },
  },
  NewChat: {
    Return: "Вернуться",
    Skip: "Начать сразу",
    NotShow: "Больше не показывать",
    ConfirmNoShow:
      "Подтвердить отключение? После отключения вы всегда сможете включить его снова в настройках.",
    Title: "Выберите маску",
    SubTitle: "Начните сейчас, столкнитесь с мыслями за маской",
    More: "Показать все",
  },

  URLCommand: {
    Code: "Обнаружен код доступа в ссылке, автоматически заполнить?",
    Settings:
      "Обнаружены предустановленные настройки в ссылке, автоматически заполнить?",
  },

  UI: {
    Confirm: "Подтвердить",
    Cancel: "Отмена",
    Close: "Закрыть",
    Create: "Создать",
    Edit: "Редактировать",
    Export: "Экспортировать",
    Import: "Импортировать",
    Sync: "Синхронизировать",
    Config: "Настройки",
  },
  Exporter: {
    Description: {
      Title: "Только сообщения после очистки контекста будут отображаться",
    },
    Model: "Модель",
    Messages: "Сообщения",
    Topic: "Тема",
    Time: "Время",
  },
};

export default ru;
