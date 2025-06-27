import EmojiPicker, {
  Emoji,
  EmojiStyle,
  Theme as EmojiTheme,
} from "emoji-picker-react";

import { ModelType } from "../store";

// import BotIconDefault from "../icons/llm-icons/chebichat.svg";

// thay bang chebichat

export function getEmojiUrl(unified: string, style: EmojiStyle) {
  // Phương thức trả về đường dẫn URL của emoji dựa trên mã hóa unified và kiểu style
  // CDN mới được sử dụng để phục vụ hình ảnh emoji
  return `https://fastly.jsdelivr.net/npm/emoji-datasource-apple/img/${style}/64/${unified}.png`;
}

export function AvatarPicker(props: {
  onEmojiClick: (emojiId: string) => void;
}) {
  return (
    <EmojiPicker
      width={"100%"}
      lazyLoadEmojis
      theme={EmojiTheme.AUTO}
      getEmojiUrl={getEmojiUrl}
      onEmojiClick={(e) => {
        // Gọi hàm onEmojiClick khi người dùng click vào emoji
        // Truyền giá trị unified của emoji đã chọn
        props.onEmojiClick(e.unified);
      }}
    />
  );
}

// Function to render chebichat PNG avatar
function chebichatAvatar() {
  return (
    <div className="user-avatar">
      <img
        src="/chebichat.png"
        alt="chebichat avatar"
        width={48}
        height={48}
        style={{ borderRadius: "50%" }}
      />
    </div>
  );
}

//xu ly avatar cho Chebichat
// nếu không có avatar thì trả về avatar mặc định của Chebichat
// nếu có avatar thì trả về avatar tương ứng với tên avatar
export function Avatar(props: { model?: ModelType; avatar?: string }) {
  // console.log("Avatar props", props);

  if (props.avatar === "chebi-user") {
    //sau thay the bang avatar tu Chebichat Platform (Avatar Google,...)

    // Nếu avatar là "chebi-user", trả về avatar mặc định của Chebichat
    return null;
  }

  return chebichatAvatar();

  // let LlmIcon = BotIconDefault;

  //phan biệt các loại model và gán icon tương ứng
  // if (props.model) {
  //   const modelName = props.model.toLowerCase();

  //   // Xác định icon phù hợp dựa trên tên model
  //   if (
  //     modelName.startsWith("gpt") ||
  //     modelName.startsWith("chatgpt") ||
  //     modelName.startsWith("dall-e") ||
  //     modelName.startsWith("dalle") ||
  //     modelName.startsWith("o1") ||
  //     modelName.startsWith("o3")
  //   ) {
  //     LlmIcon = BotIconOpenAI;
  //   } else if (modelName.startsWith("gemini")) {
  //     LlmIcon = BotIconGemini;
  //   } else if (modelName.startsWith("gemma")) {
  //     LlmIcon = BotIconGemma;
  //   } else if (modelName.startsWith("claude")) {
  //     LlmIcon = BotIconClaude;
  //   } else if (modelName.includes("llama")) {
  //     LlmIcon = BotIconMeta;
  //   } else if (
  //     modelName.startsWith("mixtral") ||
  //     modelName.startsWith("codestral")
  //   ) {
  //     LlmIcon = BotIconMistral;
  //   } else if (modelName.includes("deepseek")) {
  //     LlmIcon = BotIconDeepseek;
  //   } else if (modelName.startsWith("moonshot")) {
  //     LlmIcon = BotIconMoonshot;
  //   } else if (modelName.startsWith("qwen")) {
  //     LlmIcon = BotIconQwen;
  //   } else if (modelName.startsWith("ernie")) {
  //     LlmIcon = BotIconWenxin;
  //   } else if (modelName.startsWith("grok")) {
  //     LlmIcon = BotIconGrok;
  //   } else if (modelName.startsWith("hunyuan")) {
  //     LlmIcon = BotIconHunyuan;
  //   } else if (modelName.startsWith("doubao") || modelName.startsWith("ep-")) {
  //     LlmIcon = BotIconDoubao;
  //   } else if (
  //     modelName.includes("glm") ||
  //     modelName.startsWith("cogview-") ||
  //     modelName.startsWith("cogvideox-")
  //   ) {
  //     LlmIcon = BotIconChatglm;
  //   }

  //   return chebichatAvatar();
  // }

  // return (
  //   console.log("Avatar", props.avatar),
  //   <div className="user-avatar">
  //     {props.avatar && <EmojiAvatar avatar={props.avatar} size={48} />}
  //   </div>
  // );
}

export function EmojiAvatar(props: { avatar: string; size?: number }) {
  return (
    // Hiển thị emoji dựa trên giá trị avatar được truyền vào
    <Emoji
      unified={props.avatar}
      size={props.size ?? 18}
      getEmojiUrl={getEmojiUrl}
    />
  );
}
