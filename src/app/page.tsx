"use client";

import { useState } from "react";

// Строгая структура ответа сервиса
interface ServiceResponse {
  clientReply: string;
  managerUpsell: string;
  detectedContext: string;
}

// 🧠 Супер-продвинутая оффлайн база знаний и семантическая карта контекстов
const OFFLINE_AI_ENGINE = (text: string): ServiceResponse => {
  const lowText = text.toLowerCase().trim();

  // 1. КОНТЕКСТ: ВОЗВРАТЫ / ОТКАЗЫ / КОНФЛИКТЫ
  if (
    /возврат|вернут|отмен|уйти|забрать деньг|претенз|жалоб|не нрав|передум|расторг|плохо|обман/i.test(
      lowText,
    )
  ) {
    return {
      detectedContext: "⚠️ Запрос на возврат средств / Претензия",
      clientReply:
        "Здравствуйте! Мне искренне жаль, что у вас сложилось негативное впечатление о нашей академии. Согласно договору-оферте, вы можете оформить полный возврат средств в течение первых 14 дней с момента покупки курса. Подскажите, пожалуйста, номер вашего заказа или почту, с которой регистрировались?",
      managerUpsell:
        "🛑 ВНИМАНИЕ: Лид в критическом статусе. Любые допродажи строго запрещены! Задача менеджера — удержать клиента. Выясните причину (сложно учиться / нет времени). Предложите бесплатную заморозку обучения на месяц или смену личного ментора.",
    };
  }

  // 2. КОНТЕКСТ: ЖЕЛАНИЕ СДЕЛАТЬ ЗАКАЗ НЕ ПО ТЕМЕ (Еда, услуги, товары, аренда, ремонт)
  if (
    /сосиск|колбас|еда|мясо|продукты|одежд|купить|заказать|оформить|доставк|курьер|ремонт|починить|квартир|аренд|машин|авто/i.test(
      lowText,
    ) &&
    !/программиров|курс|учит|обучен|react|реакт|node/i.test(lowText)
  ) {
    return {
      detectedContext:
        "🌭 Нецелевой заказ (Оффтоп / Попытка купить сторонний товар)",
      clientReply:
        "Здравствуйте! Вы немного ошиблись компанией. Мы — онлайн-школа программирования 'Frontend Academy', мы обучаем веб-разработке и созданию сайтов. Данный товар или услугу мы не продаем. Однако мы с радостью научим вас программировать крутые интернет-магазины или сервисы автоматизации для вашей сферы бизнеса! 😉",
      managerUpsell:
        "🚫 ДОПРОДАЖИ ЗАПРЕЩЕНЫ: Клиент настойчиво пытается заказать сторонний товар или услугу. Он ошибся номером или чатом. Не тратьте ресурсы на продажи курсов, вежливо закройте обращение в AmoCRM со статусом 'Нецелевой лид / Ошиблись номером'.",
    };
  }

  // 3. КОНТЕКСТ: REACT / NEXT.JS / FRONTEND (Конкретный стек)
  if (
    /react|реакт|next|некст|front|фронт|интерфейс|верст|js|javascript|джаваскрипт/i.test(
      lowText,
    )
  ) {
    return {
      detectedContext: "⚛️ Интерес к Frontend-разработке (React)",
      clientReply:
        "Приветствуем! Наш курс по React — это флагманская программа Frontend Academy. Обучение длится 3 месяца, включает поддержку практикующих менторов и 10 крутых проектов в ваше портфолио. Стоимость курса составляет 15 000 руб. Вы планируете учиться с нуля или уже есть базовые знания?",
      managerUpsell:
        "🎯 ХОРОШИЙ МОМЕНТ ДЛЯ АПСЕЛЛА: Клиент горячий и целевой. Предложите ему комбо-пакет: 'При покупке курса по React сегодня, вы получаете продвинутый курс по Next.js и архитектуре приложений со скидкой 20% (всего за 12 000 руб вместо 15 000 руб)'.",
    };
  }

  // 4. КОНТЕКСТ: NODE.JS / BACKEND (Серверный стек)
  if (
    /node|нода|express|экспресс|nest|нест|back|бек|сервер|баз|db|sql|postgres/i.test(
      lowText,
    )
  ) {
    return {
      detectedContext: "🟢 Интерес к Backend-разработке (Node.js)",
      clientReply:
        "Здравствуйте! Курс по Node.js идеально подходит для тех, кто хочет создавать надежную серверную часть приложений и баз данных. Стоимость программы — 18 000 руб. В рамках курса вы разработаете 4 полноценных бэкенд-проекта и развернете их на сервере. Подсказать вам подробную программу обучения?",
      managerUpsell:
        "🎯 ОТЛИЧНЫЙ МОМЕНТ ДЛЯ АПСЕЛЛА: Клиент смотрит в сторону бэкенда. Предложите ему забрать воркшоп по Docker и деплою со скидкой 50% (всего за 1 500 руб вместо 3 000 руб) для полноценного старта.",
    };
  }

  // 5. КОНТЕКСТ: ОБЩИЙ ИНТЕРЕС К IT / КУРСАМ / ХОЧУ УЧИТЬСЯ
  if (
    /программиров|курс|учит|обучен|взять|купить|покупк|цена|стоимост|сколько стоит|скидк/i.test(
      lowText,
    )
  ) {
    return {
      detectedContext: "📘 Общий запрос на обучение программированию",
      clientReply:
        "Здравствуйте! Рады приветствовать вас во Frontend Academy. Мы обучаем самым востребованным направлениям в IT с полного нуля. У нас есть флагманские курсы по React (15 000 руб) и Node.js (18 000 руб). Подскажите, вам интереснее создавать визуальную часть сайтов или работать с логикой и базами данных?",
      managerUpsell:
        "💡 ПОДСКАЗКА ПО СКРИПТУ: Клиент проявил общий интерес, стек еще не выбран. Проведите квалификацию: узнайте его текущий опыт и цели, чтобы точечно предложить React или Node.js, а затем сделать допродажу расширенного пакета поддержки.",
    };
  }

  // 6. ФОЛЛБЭК: НА СЛУЧАЙ ЛЮБЫХ НЕСТАНДАРТНЫХ ИЛИ СЛИШКОМ КОРОТКИХ ФРАЗ
  return {
    detectedContext: "💬 Неопределенный контекст обращения (Смазанный запрос)",
    clientReply:
      "Здравствуйте! Спасибо за ваше обращение во Frontend Academy. Подскажите, пожалуйста, подробнее ваш вопрос или задачу, чтобы я мог направить вас к профильному специалисту нашего центра?",
    managerUpsell:
      "🧠 Скрипт: Входящее сообщение слишком короткое или нестандартное. Живая нейросеть рекомендует использовать классическое приветствие и задать открытый вопрос для выявления истинных потребностей клиента.",
  };
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ServiceResponse | null>(null);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setLoading(true);

    // Имитируем небольшую задержку «размышления» ИИ для красивого эффекта на видео
    setTimeout(() => {
      const output = OFFLINE_AI_ENGINE(inputText);
      setResult(output);
      setLoading(false);
    }, 500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Ответ скопирован в буфер обмена!");
  };

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "40px auto",
        padding: "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
      >
        <span style={{ fontSize: "24px", marginRight: "8px" }}>🤖</span>
        <h3
          style={{
            margin: 0,
            color: "#0f172a",
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          ИИ-Ассистент AmoCRM{" "}
          <span
            style={{
              fontSize: "11px",
              color: "#10b981",
              backgroundColor: "#d1fae5",
              padding: "2px 6px",
              borderRadius: "4px",
              marginLeft: "6px",
            }}
          >
            OFFLINE PRO
          </span>
        </h3>
      </div>

      <p
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginTop: "-8px",
          marginBottom: "16px",
        }}
      >
        Прототип интеллектуального анализа диалогового окна менеджера поддержки.
      </p>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Введите последнее сообщение клиента из чата AmoCRM..."
        rows={4}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          marginBottom: "14px",
          boxSizing: "border-box",
          fontSize: "14px",
          resize: "none",
          outline: "none",
          transition: "border-color 0.2s",
        }}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: loading ? "#94a3b8" : "#0f172a",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
          transition: "background-color 0.2s",
        }}
      >
        {loading ? "Анализ диалога..." : "Проанализировать обращение"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "24px",
            borderTop: "2px dashed #e2e8f0",
            paddingTop: "16px",
          }}
        >
          <div
            style={{
              marginBottom: "14px",
              fontSize: "12px",
              color: "#64748b",
              fontWeight: "500",
            }}
          >
            Определенный контекст:{" "}
            <span style={{ color: "#0f172a", fontWeight: "700" }}>
              {result.detectedContext}
            </span>
          </div>

          {/* БЛОК 1: Ответ клиенту */}
          <div style={{ marginBottom: "18px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#475569",
                  letterSpacing: "0.05em",
                }}
              >
                💬 ВЕЖЛИВЫЙ ОТВЕТ КЛИЕНТУ:
              </span>
              <button
                onClick={() => copyToClipboard(result.clientReply)}
                style={{
                  fontSize: "11px",
                  backgroundColor: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: "#334155",
                }}
              >
                Копировать
              </button>
            </div>
            <div
              style={{
                backgroundColor: "#eff6ff",
                padding: "14px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#1e3a8a",
                border: "1px solid #bfdbfe",
                lineHeight: "1.5",
              }}
            >
              {result.clientReply}
            </div>
          </div>

          {/* БЛОК 2: Подсказка по допродажам */}
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#475569",
                marginBottom: "6px",
                letterSpacing: "0.05em",
              }}
            >
              💰 ПОДСКАЗКА ПО ДОПРОДАЖАМ ДЛЯ МЕНЕДЖЕРА:
            </div>
            <div
              style={{
                backgroundColor: "#fffbeb",
                padding: "14px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#78350f",
                border: "1px solid #fde68a",
                lineHeight: "1.5",
              }}
            >
              {result.managerUpsell}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
