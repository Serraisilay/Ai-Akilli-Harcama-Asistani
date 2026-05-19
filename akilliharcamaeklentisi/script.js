const GROQ_API_KEY = "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";

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('analizEtButon').addEventListener('click', analizEt);
  document.getElementById('chatGonder').addEventListener('click', sohbetGonder);

  document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sohbetGonder();
    }
  });
});

async function analizEt() {
  const tutar = document.getElementById('fiyatInput').value;
  if (!tutar) {
    alert("Lütfen sepet tutarı gir.");
    return;
  }

  
  const riskKutusu = document.getElementById('riskKutusu');
  const riskBarFill = document.getElementById('riskBarFill');
  const riskText = document.getElementById('riskText');

  riskKutusu.style.display = "block";

  if (Number(tutar) < 2000) {
    riskBarFill.style.width = "40%";
    riskBarFill.style.background = "#22c55e";
    riskText.innerText = "🟢 Düşük Risk";
  } else if (Number(tutar) < 5000) {
    riskBarFill.style.width = "70%";
    riskBarFill.style.background = "#facc15";
    riskText.innerText = "🟡 Orta Risk";
  } else {
    riskBarFill.style.width = "100%";
    riskBarFill.style.background = "#ef4444";
    riskText.innerText = "🔴 Yüksek Risk";
  }

 
  document.getElementById('chatInput').value = `${tutar} TL harcamayı düşünüyorum, mantıklı mı?`;
  sohbetGonder();
}

async function sohbetGonder() {
  const input = document.getElementById('chatInput');
  const mesaj = input.value.trim();
  const sonuc = document.getElementById('sonuc');

  if (!mesaj) return;

  sonuc.innerHTML += `<div class="chat-user">${mesaj}</div>`;
  input.value = "";
  input.focus();

  sonuc.innerHTML += `<div class="chat-ai" id="bekliyor">AI düşünüyor...</div>`;
  sonuc.scrollTop = sonuc.scrollHeight;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Sen sadece Türkçe konuşan finans asistanısın. Kullanıcıyla sohbet eder gibi doğal, kısa ve tamamen Türkçe cevap ver. İngilizce kelime kullanma."
          },
          {
            role: "user",
            content: mesaj
          }
        ],
        temperature: 0.6,
        max_tokens: 220
      })
    });

    const data = await response.json();
    const cevap = data.choices?.[0]?.message?.content || "Şu anda cevap alınamadı.";

    document.getElementById("bekliyor").remove();
    sonuc.innerHTML += `<div class="chat-ai">${cevap}</div>`;

  } catch (e) {
    document.getElementById("bekliyor").remove();
    sonuc.innerHTML += `<div class="chat-ai">Bağlantı hatası oluştu.</div>`;
  }

  sonuc.scrollTop = sonuc.scrollHeight;
}