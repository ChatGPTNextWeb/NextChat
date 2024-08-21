import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";
import { getClientConfig } from "../config/client";

const isApp = !!getClientConfig()?.isApp;

const id: PartialLocaleType = {
  WIP: "Coming Soon...",
  Error: {
    Unauthorized: isApp
      ? "API Key tidak valid terdeteksi, silakan periksa apakah API Key telah dikonfigurasi dengan benar di halaman [Pengaturan](/#/settings)."
      : "Kata sandi akses tidak benar atau kosong, silakan masukkan kata sandi akses yang benar di halaman [Masuk](/#/auth), atau masukkan OpenAI API Key Anda di halaman [Pengaturan](/#/settings).",
  },
  Auth: {
    Title: "Kebutuhan Kata Sandi",
    Tips: "Administrator telah mengaktifkan verifikasi kata sandi, silakan masukkan kode akses di bawah ini",
    SubTips: "Atau masukkan kunci API OpenAI atau Google Anda",
    Input: "Masukkan kode akses di sini",
    Confirm: "Konfirmasi",
    Later: "Nanti",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} percakapan`,
  },
  Chat: {
    SubTitle: (count: number) => `Total ${count} percakapan`,
    EditMessage: {
      Title: "Edit Riwayat Pesan",
      Topic: {
        Title: "Topik Obrolan",
        SubTitle: "Ubah topik obrolan saat ini",
      },
    },
    Actions: {
      ChatList: "Lihat daftar pesan",
      CompressedHistory: "Lihat riwayat Prompt yang dikompresi",
      Export: "Ekspor riwayat obrolan",
      Copy: "Salin",
      Stop: "Berhenti",
      Retry: "Coba lagi",
      Pin: "Sematkan",
      PinToastContent: "1 percakapan telah disematkan ke prompt default",
      PinToastAction: "Lihat",
      Delete: "Hapus",
      Edit: "Edit",
    },
    Commands: {
      new: "Obrolan Baru",
      newm: "Buat Obrolan Baru dari Masker",
      next: "Obrolan Berikutnya",
      prev: "Obrolan Sebelumnya",
      clear: "Hapus Konteks",
      del: "Hapus Obrolan",
    },
    InputActions: {
      Stop: "Hentikan Respons",
      ToBottom: "Gulir ke bawah",
      Theme: {
        auto: "Tema Otomatis",
        light: "Mode Terang",
        dark: "Mode Gelap",
      },
      Prompt: "Perintah Cepat",
      Masks: "Semua Masker",
      Clear: "Hapus Obrolan",
      Settings: "Pengaturan Obrolan",
      UploadImage: "Unggah Gambar",
    },
    Rename: "Ganti Nama Obrolan",
    Typing: "Sedang Mengetik…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} kirim`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "，Shift + Enter untuk baris baru";
      }
      return inputHints + "，/ untuk melengkapi, : untuk memicu perintah";
    },
    Send: "Kirim",
    Config: {
      Reset: "Hapus Memori",
      SaveAs: "Simpan sebagai Masker",
    },
    IsContext: "Prompt Default",
  },
  Export: {
    Title: "Bagikan Riwayat Obrolan",
    Copy: "Salin Semua",
    Download: "Unduh File",
    Share: "Bagikan ke ShareGPT",
    MessageFromYou: "Pengguna",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "Format Ekspor",
      SubTitle: "Dapat mengekspor teks Markdown atau gambar PNG",
    },
    IncludeContext: {
      Title: "Sertakan Konteks Masker",
      SubTitle: "Apakah akan menampilkan konteks masker dalam pesan",
    },
    Steps: {
      Select: "Pilih",
      Preview: "Prabaca",
    },
    Image: {
      Toast: "Sedang Membuat Screenshot",
      Modal: "Tekan lama atau klik kanan untuk menyimpan gambar",
    },
  },
  Select: {
    Search: "Cari Pesan",
    All: "Pilih Semua",
    Latest: "Beberapa Terbaru",
    Clear: "Hapus Pilihan",
  },
  Memory: {
    Title: "Ringkasan Sejarah",
    EmptyContent: "Isi percakapan terlalu pendek, tidak perlu dirangkum",
    Send: "Otomatis kompres riwayat obrolan dan kirim sebagai konteks",
    Copy: "Salin Ringkasan",
    Reset: "[unused]",
    ResetConfirm: "Konfirmasi untuk menghapus ringkasan sejarah?",
  },
  Home: {
    NewChat: "Obrolan Baru",
    DeleteChat: "Konfirmasi untuk menghapus percakapan yang dipilih?",
    DeleteToast: "Percakapan telah dihapus",
    Revert: "Batalkan",
  },
  Settings: {
    Title: "Pengaturan",
    SubTitle: "Semua opsi pengaturan",

    Danger: {
      Reset: {
        Title: "Atur Ulang Semua Pengaturan",
        SubTitle: "Atur ulang semua opsi pengaturan ke nilai default",
        Action: "Atur Ulang Sekarang",
        Confirm: "Konfirmasi untuk mengatur ulang semua pengaturan?",
      },
      Clear: {
        Title: "Hapus Semua Data",
        SubTitle: "Hapus semua data obrolan dan pengaturan",
        Action: "Hapus Sekarang",
        Confirm:
          "Konfirmasi untuk menghapus semua data obrolan dan pengaturan?",
      },
    },
    Lang: {
      Name: "Language", // PERHATIAN: jika Anda ingin menambahkan terjemahan baru, harap jangan terjemahkan nilai ini, biarkan sebagai `Language`
      All: "Semua Bahasa",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Ukuran Font",
      SubTitle: "Ukuran font untuk konten obrolan",
    },
    FontFamily: {
      Title: "Font Obrolan",
      SubTitle:
        "Font dari konten obrolan, biarkan kosong untuk menerapkan font default global",
      Placeholder: "Nama Font",
    },
    InjectSystemPrompts: {
      Title: "Suntikkan Pesan Sistem",
      SubTitle:
        "Memaksa menambahkan pesan sistem simulasi ChatGPT di awal daftar pesan setiap permintaan",
    },
    InputTemplate: {
      Title: "Pra-pemrosesan Input Pengguna",
      SubTitle: "Pesan terbaru pengguna akan diisi ke template ini",
    },

    Update: {
      Version: (x: string) => `Versi Saat Ini: ${x}`,
      IsLatest: "Sudah versi terbaru",
      CheckUpdate: "Periksa Pembaruan",
      IsChecking: "Sedang memeriksa pembaruan...",
      FoundUpdate: (x: string) => `Versi Baru Ditemukan: ${x}`,
      GoToUpdate: "Pergi ke Pembaruan",
    },
    SendKey: "Kunci Kirim",
    Theme: "Tema",
    TightBorder: "Mode Tanpa Border",
    SendPreviewBubble: {
      Title: "Preview Bubble",
      SubTitle: "Pratinjau konten Markdown di bubble pratinjau",
    },
    AutoGenerateTitle: {
      Title: "Otomatis Membuat Judul",
      SubTitle: "Membuat judul yang sesuai berdasarkan konten obrolan",
    },
    Sync: {
      CloudState: "Data Cloud",
      NotSyncYet: "Belum disinkronkan",
      Success: "Sinkronisasi Berhasil",
      Fail: "Sinkronisasi Gagal",

      Config: {
        Modal: {
          Title: "Konfigurasi Sinkronisasi Cloud",
          Check: "Periksa Ketersediaan",
        },
        SyncType: {
          Title: "Jenis Sinkronisasi",
          SubTitle: "Pilih server sinkronisasi favorit",
        },
        Proxy: {
          Title: "Aktifkan Proxy",
          SubTitle:
            "Saat menyinkronkan di browser, proxy harus diaktifkan untuk menghindari pembatasan lintas domain",
        },
        ProxyUrl: {
          Title: "Alamat Proxy",
          SubTitle: "Hanya berlaku untuk proxy lintas domain bawaan proyek ini",
        },

        WebDav: {
          Endpoint: "Alamat WebDAV",
          UserName: "Nama Pengguna",
          Password: "Kata Sandi",
        },

        UpStash: {
          Endpoint: "Url REST Redis UpStash",
          UserName: "Nama Cadangan",
          Password: "Token REST Redis UpStash",
        },
      },

      LocalState: "Data Lokal",
      Overview: (overview: any) => {
        return `${overview.chat} percakapan, ${overview.message} pesan, ${overview.prompt} prompt, ${overview.mask} masker`;
      },
      ImportFailed: "Impor Gagal",
    },
    Mask: {
      Splash: {
        Title: "Halaman Awal Masker",
        SubTitle: "Tampilkan halaman awal masker saat memulai obrolan baru",
      },
      Builtin: {
        Title: "Sembunyikan Masker Bawaan",
        SubTitle: "Sembunyikan masker bawaan dari semua daftar masker",
      },
    },
    Prompt: {
      Disable: {
        Title: "Nonaktifkan Pelengkapan Prompt Otomatis",
        SubTitle:
          "Ketik / di awal kotak input untuk memicu pelengkapan otomatis",
      },
      List: "Daftar Prompt Kustom",
      ListCount: (builtin: number, custom: number) =>
        `Bawaan ${builtin} item, pengguna ${custom} item`,
      Edit: "Edit",
      Modal: {
        Title: "Daftar Prompt",
        Add: "Baru",
        Search: "Cari Prompt",
      },
      EditModal: {
        Title: "Edit Prompt",
      },
    },
    HistoryCount: {
      Title: "Jumlah Pesan Sejarah",
      SubTitle: "Jumlah pesan sejarah yang dibawa setiap permintaan",
    },
    CompressThreshold: {
      Title: "Ambang Batas Kompresi Pesan Sejarah",
      SubTitle:
        "Ketika pesan sejarah yang tidak terkompresi melebihi nilai ini, akan dikompresi",
    },

    Usage: {
      Title: "Cek Saldo",
      SubTitle(used: any, total: any) {
        return `Digunakan bulan ini $${used}, total langganan $${total}`;
      },
      IsChecking: "Sedang memeriksa…",
      Check: "Periksa Lagi",
      NoAccess: "Masukkan API Key atau kata sandi akses untuk melihat saldo",
    },

    Access: {
      AccessCode: {
        Title: "Kata Sandi Akses",
        SubTitle: "Administrator telah mengaktifkan akses terenkripsi",
        Placeholder: "Masukkan kata sandi akses",
      },
      CustomEndpoint: {
        Title: "Antarmuka Kustom",
        SubTitle: "Apakah akan menggunakan layanan Azure atau OpenAI kustom",
      },
      Provider: {
        Title: "Penyedia Layanan Model",
        SubTitle: "Ganti penyedia layanan yang berbeda",
      },
      OpenAI: {
        ApiKey: {
          Title: "API Key",
          SubTitle:
            "Gunakan OpenAI Key kustom untuk menghindari batasan akses kata sandi",
          Placeholder: "OpenAI API Key",
        },

        Endpoint: {
          Title: "Alamat Antarmuka",
          SubTitle: "Selain alamat default, harus menyertakan http(s)://",
        },
      },
      Azure: {
        ApiKey: {
          Title: "Kunci Antarmuka",
          SubTitle:
            "Gunakan Azure Key kustom untuk menghindari batasan akses kata sandi",
          Placeholder: "Azure API Key",
        },

        Endpoint: {
          Title: "Alamat Antarmuka",
          SubTitle: "Contoh:",
        },

        ApiVerion: {
          Title: "Versi Antarmuka (azure api version)",
          SubTitle: "Pilih versi parsial tertentu",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "Kunci Antarmuka",
          SubTitle:
            "Gunakan Anthropic Key kustom untuk menghindari batasan akses kata sandi",
          Placeholder: "Anthropic API Key",
        },

        Endpoint: {
          Title: "Alamat Antarmuka",
          SubTitle: "Contoh:",
        },

        ApiVerion: {
          Title: "Versi Antarmuka (claude api version)",
          SubTitle: "Pilih versi API tertentu",
        },
      },
      Google: {
        ApiKey: {
          Title: "Kunci API",
          SubTitle: "Dapatkan kunci API Anda dari Google AI",
          Placeholder: "Masukkan kunci API Studio Google AI Anda",
        },

        Endpoint: {
          Title: "Alamat Akhir",
          SubTitle: "Contoh:",
        },

        ApiVersion: {
          Title: "Versi API (hanya untuk gemini-pro)",
          SubTitle: "Pilih versi API tertentu",
        },
        GoogleSafetySettings: {
          Title: "Tingkat Filter Keamanan Google",
          SubTitle: "Atur tingkat filter konten",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Gunakan Baidu API Key kustom",
          Placeholder: "Baidu API Key",
        },
        SecretKey: {
          Title: "Secret Key",
          SubTitle: "Gunakan Baidu Secret Key kustom",
          Placeholder: "Baidu Secret Key",
        },
        Endpoint: {
          Title: "Alamat Antarmuka",
          SubTitle: "Tidak mendukung kustom, pergi ke .env untuk konfigurasi",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "Kunci Antarmuka",
          SubTitle: "Gunakan ByteDance API Key kustom",
          Placeholder: "ByteDance API Key",
        },
        Endpoint: {
          Title: "Alamat Antarmuka",
          SubTitle: "Contoh:",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "Kunci Antarmuka",
          SubTitle: "Gunakan Alibaba Cloud API Key kustom",
          Placeholder: "Alibaba Cloud API Key",
        },
        Endpoint: {
          Title: "Alamat Antarmuka",
          SubTitle: "Contoh:",
        },
      },
      CustomModel: {
        Title: "Nama Model Kustom",
        SubTitle: "Tambahkan opsi model kustom, pisahkan dengan koma",
      },
    },

    Model: "Model",
    Temperature: {
      Title: "Randomness (temperature)",
      SubTitle: "Semakin tinggi nilainya, semakin acak responsnya",
    },
    TopP: {
      Title: "Sampling Inti (top_p)",
      SubTitle:
        "Mirip dengan randomness, tetapi jangan ubah bersama randomness",
    },
    MaxTokens: {
      Title: "Batas Token Per Respons",
      SubTitle: "Jumlah token maksimum yang digunakan per interaksi",
    },
    PresencePenalty: {
      Title: "Kedekatan Topik (presence_penalty)",
      SubTitle:
        "Semakin tinggi nilainya, semakin besar kemungkinan memperluas ke topik baru",
    },
    FrequencyPenalty: {
      Title: "Hukuman Frekuensi (frequency_penalty)",
      SubTitle:
        "Semakin tinggi nilainya, semakin besar kemungkinan mengurangi kata-kata yang berulang",
    },
  },
  Store: {
    DefaultTopic: "Obrolan Baru",
    BotHello: "Ada yang bisa saya bantu?",
    Error: "Terjadi kesalahan, coba lagi nanti",
    Prompt: {
      History: (content: string) =>
        "Ini adalah ringkasan obrolan sebelumnya sebagai latar belakang: " +
        content,
      Topic:
        "Gunakan empat hingga lima kata untuk langsung memberikan ringkasan topik kalimat ini, tanpa penjelasan, tanpa tanda baca, tanpa kata pengisi, tanpa teks tambahan, tanpa menebalkan. Jika tidak ada topik, langsung jawab 'Obrolan Santai'",
      Summarize:
        "Berikan ringkasan singkat tentang konten obrolan, untuk digunakan sebagai prompt konteks selanjutnya, dalam 200 kata atau kurang",
    },
  },
  Copy: {
    Success: "Telah disalin ke clipboard",
    Failed: "Gagal menyalin, mohon berikan izin clipboard",
  },
  Download: {
    Success: "Konten telah diunduh ke direktori Anda.",
    Failed: "Unduhan gagal.",
  },
  Context: {
    Toast: (x: any) => `Berisi ${x} prompt preset`,
    Edit: "Pengaturan Obrolan Saat Ini",
    Add: "Tambah Obrolan",
    Clear: "Konteks telah dihapus",
    Revert: "Kembalikan Konteks",
  },
  Plugin: {
    Name: "Plugin",
  },
  FineTuned: {
    Sysmessage: "Anda adalah seorang asisten",
  },
  SearchChat: {
    Name: "Cari",
    Page: {
      Title: "Cari riwayat obrolan",
      Search: "Masukkan kata kunci pencarian",
      NoResult: "Tidak ada hasil ditemukan",
      NoData: "Tidak ada data",
      Loading: "Memuat",

      SubTitle: (count: number) => `Ditemukan ${count} hasil`,
    },
    Item: {
      View: "Lihat",
    },
  },
  Mask: {
    Name: "Masker",
    Page: {
      Title: "Preset Karakter Masker",
      SubTitle: (count: number) => `${count} definisi karakter preset`,
      Search: "Cari Masker Karakter",
      Create: "Buat Baru",
    },
    Item: {
      Info: (count: number) => `Berisi ${count} obrolan preset`,
      Chat: "Obrolan",
      View: "Lihat",
      Edit: "Edit",
      Delete: "Hapus",
      DeleteConfirm: "Konfirmasi penghapusan?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Edit Masker Preset ${readonly ? "(Hanya Baca)" : ""}`,
      Download: "Unduh Preset",
      Clone: "Klon Preset",
    },
    Config: {
      Avatar: "Avatar Karakter",
      Name: "Nama Karakter",
      Sync: {
        Title: "Gunakan Pengaturan Global",
        SubTitle:
          "Apakah obrolan saat ini akan menggunakan pengaturan model global?",
        Confirm:
          "Pengaturan kustom obrolan saat ini akan ditimpa secara otomatis, konfirmasi untuk mengaktifkan pengaturan global?",
      },
      HideContext: {
        Title: "Sembunyikan Obrolan Preset",
        SubTitle:
          "Setelah disembunyikan, obrolan preset tidak akan muncul di antarmuka obrolan",
      },
      Share: {
        Title: "Bagikan Masker Ini",
        SubTitle: "Hasilkan tautan langsung ke masker ini",
        Action: "Salin Tautan",
      },
    },
  },
  NewChat: {
    Return: "Kembali",
    Skip: "Mulai Sekarang",
    NotShow: "Jangan Tampilkan Lagi",
    ConfirmNoShow:
      "Konfirmasi untuk menonaktifkan? Setelah dinonaktifkan, Anda dapat mengaktifkannya kembali kapan saja di pengaturan.",
    Title: "Pilih Masker",
    SubTitle: "Mulai sekarang, berinteraksi dengan pemikiran di balik masker",
    More: "Lihat Semua",
  },

  URLCommand: {
    Code: "Terdeteksi bahwa tautan sudah mengandung kode akses, apakah akan diisi secara otomatis?",
    Settings:
      "Terdeteksi bahwa tautan mengandung pengaturan preset, apakah akan diisi secara otomatis?",
  },

  UI: {
    Confirm: "Konfirmasi",
    Cancel: "Batal",
    Close: "Tutup",
    Create: "Buat Baru",
    Edit: "Edit",
    Export: "Ekspor",
    Import: "Impor",
    Sync: "Sinkronkan",
    Config: "Konfigurasi",
  },
  Exporter: {
    Description: {
      Title: "Hanya pesan setelah menghapus konteks yang akan ditampilkan",
    },
    Model: "Model",
    Messages: "Pesan",
    Topic: "Topik",
    Time: "Waktu",
  },
};

export default id;
