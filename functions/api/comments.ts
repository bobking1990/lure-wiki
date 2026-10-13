// functions/api/comments.ts

// 在边缘节点内存中临时初始化一个评论数组
const globalComments: Array<{ text: string; timestamp: string }> = [
    { text: "新手刚入坑，请问打水面系波趴一般在什么时间段比较好？", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { text: "回楼上：清晨和傍晚掠食鱼活性高，波趴炸水效果无敌！", timestamp: new Date().toISOString() }
  ];
  
  export const onRequest: PagesFunction = async (context) => {
    const { request } = context;
    const url = new URL(request.url);
  
    // 统一响应头（支持 JSON 编码）
    const headers = { 
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*" 
    };
  
    // 处理 GET 请求：返回评论列表
    if (request.method === "GET") {
      return new Response(JSON.stringify(globalComments), { headers });
    }
  
    // 处理 POST 请求：提交新评论
    if (request.method === "POST") {
      try {
        const body: any = await request.json();
        if (!body.text || body.text.trim() === "") {
          return new Response(JSON.stringify({ error: "内容不能为空" }), { status: 400, headers });
        }
  
        // 将新评论推入内存数组头部
        globalComments.unshift({
          text: body.text.substring(0, 200), // 截断防止恶意长文本
          timestamp: new Date().toISOString()
        });
  
        return new Response(JSON.stringify({ success: true }), { headers });
      } catch (err) {
        return new Response(JSON.stringify({ error: "无效的请求体" }), { status: 400, headers });
      }
    }
  
    // 拒绝其他 HTTP 方法
    return new Response("Method Not Allowed", { status: 405 });
  };