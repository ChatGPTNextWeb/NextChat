import { BuiltinMask } from "./typing";
import { CHEBI_MESSAGE, CHEBI_VISION } from "../chebichatConstant";
// import {}
export const VI_MASKS: BuiltinMask[] = [
  {
    avatar: "1f5bc-fe0f",
    name: "Học tiếng trung hỏi đáp AI",
    context: [
      {
        id: "text-to-pic-0",
        role: "system",
        content: CHEBI_MESSAGE,
        date: "",
      },
      {
        id: "text-to-pic-1",
        role: "user",
        content: "mẫu câu chào hỏi tiếng trung?",
        date: "",
      },
      // {
      //   id: "text-to-pic-2",
      //   role: "assistant",
      //   content:
      //     "Dưới đây là một số mẫu câu chào hỏi bằng tiếng Trung (bao gồm chữ Hán và phiên âm Pinyin) mà bạn có thể sử dụng:\n\n1. **Xìnghé** (xin chào):\n   - 您好 (nín hǎo)\n\n2. **Chào buổi sáng**:\n   - 早上好 (zǎo shàng hǎo)\n\n3. **Chào buổi chiều**:\n   - 下午好 (xià wǔ hǎo)\n\n4. **Chào buổi tối**:\n   - 晚上好 (wǎn shàng hǎo)\n\n5. **Tạm biệt**:\n   - 再见 (zài jiàn)\n\n6. **Bạn khỏe không?** (Bạn đang khỏe chứ?):\n   - 你好吗？(nǐ hǎo ma?)\n\n7. **Tôi khỏe, cảm ơn!**:\n   - 我很好，谢谢！(wǒ hěn hǎo, xièxiè!)\n\n8. **Rất vui được gặp bạn**:\n   - 很高兴见到你 (hěn gāoxìng jiàndào nǐ)\n\nHy vọng những câu chào hỏi này sẽ giúp ích cho bạn khi học tiếng Trung!",
      //   date: "",
      // },
    ],
    modelConfig: {
      model: "qwen-turbo",
      temperature: 0.5,
      top_p: 1,
      max_tokens: 4000,
      presence_penalty: 0,
      frequency_penalty: 0,
      sendMemory: true,
      historyMessageCount: 4,
      compressMessageLengthThreshold: 1000,
      compressModel: "qwen-plus",
      compressProviderName: "Alibaba",
      enableInjectSystemPrompts: true,
      template: "{{input}}",
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    },
    lang: "vi",
    builtin: true,
    createdAt: 1688899480510,
  },

  {
    avatar: "1f5bc-fe0f",
    name: "Học tiếng trung qua hình ảnh",
    context: [
      {
        id: "text-to-pic-0",
        role: "system",
        content: CHEBI_VISION,
        date: "",
      },
      {
        id: "text-to-pic-1",
        role: "user",
        content: [
          {
            type: "text",
            text: "giải thích ý nghĩa qua hình ảnh bằng tiếng trung có pinyin",
          },
          // {
          //   type: "image_url",
          //   image_url: {
          //     url: IMAGES.exampleImage,
          //   },
          // },
        ],
        date: "",
      },
      // {
      //   id: "text-to-pic-2",
      //   role: "assistant",
      //   content:
      //     "Tôi giúp bạn phân tích và giải thích ý nghĩa của bức ảnh về Đền Thiên Cung (Temple of Heaven) bằng tiếng Trung có pinyin.\n\nBức ảnh này cho thấy Đền Thiên Cung ở Bắc Kinh, Trung Quốc. Đây là một di sản văn hóa thế giới được UNESCO công nhận. Dưới đây là một số điểm chính về bức ảnh:\n\n1. **Tên địa điểm**: Đền Thiên Cung (天宮殿 - Tiān Gōng Diàn)\n   - Tiếng Việt: Đền Thiên Cung\n   - Pinyin: Tiān Gōng Diàn\n\n2. **Ý nghĩa**: Đền Thiên Cung là một kiến trúc quan trọng trong lịch sử Trung Quốc, đặc biệt là thời kỳ triều đại nhà Minh và nhà Thanh. Nó được xây dựng để tế lễ thần Thiên (tiếng Trung: 天 - Tiān), biểu tượng cho trời đất và sự nghiệp của vua chúa.\n\n3. **Kiến trúc**: \n   - **Đỉnh mái**: Đỉnh mái của đền có dạng hình lục giác,象征着天地的和谐统一 (biểu thị sự hòa hợp giữa trời đất).\n   - **Màu sắc**: Màu đỏ thường được sử dụng trong kiến trúc cổ Trung Quốc, tượng trưng cho quyền lực và may mắn.\n   - **Cầu thang**: Các bậc cầu thang dẫn lên đền tượng trưng cho việc tiến trình từ hạ giới lên thiên giới.\n\n4. **Vị trí**: Đền Thiên Cung nằm ở phía nam thành phố Bắc Kinh, gần quảng trường Thiên An Môn. Đây là một địa điểm du lịch nổi tiếng và cũng là nơi diễn ra nhiều nghi lễ quan trọng trong lịch sử.\n\n5. **Giá trị văn hóa**: Đền Thiên Cung không chỉ là một công trình kiến trúc tuyệt đẹp mà còn là một biểu tượng của văn hóa và lịch sử Trung Quốc. Nó phản ánh tư duy tâm linh và triết lý về mối quan hệ giữa con người và thiên nhiên của người Trung Quốc.\n\nHy vọng những thông tin trên sẽ hữu ích cho bạn! Nếu bạn cần thêm thông tin chi tiết hoặc có câu hỏi khác, hãy cho tôi biết nhé.",
      //   date: "",
      // },
    ],
    modelConfig: {
      model: "qwen-vl-plus",
      temperature: 0.5,
      top_p: 1,
      max_tokens: 4000,
      presence_penalty: 0,
      frequency_penalty: 0,
      sendMemory: true,
      historyMessageCount: 4,
      compressMessageLengthThreshold: 1000,
      compressModel: "qwen-plus",
      compressProviderName: "Alibaba",
      enableInjectSystemPrompts: true,
      template: "{{input}}",
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    },
    lang: "vi",
    builtin: true,
    createdAt: 1688899480510,
  },
];
