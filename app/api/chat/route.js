export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Hostel Management System"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        max_tokens: 120,          
        temperature: 0.3,           
        messages: [
          {
            role: "system",
            content: `
You are an assistant explaining a Hostel Management System project.
Give short, clear, direct answers.
Maximum 3-4 sentences.
No long explanations.
Be concise and professional.
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    return Response.json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    return Response.json({ error: "AI Error" }, { status: 500 });
  }
}