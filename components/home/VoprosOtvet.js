import Image from "next/image";

// /components/home/VoprosOtvet.jsx
const questionsAndAnswers = [
  {
    question: "Где в Минске можно купить аниме фигурки?",
    answer:
      "В магазинах сети «Акани» (адреса ниже) и в нашем интернет-магазине. Можно забрать самовывозом или заказать доставку.",
  },
  {
    question: "Осуществляете ли вы доставку по Беларуси?",
    answer:
      "Да. По Минску — курьером, по Беларуси — почтой. Сроки зависят от города и службы доставки: обычно 1–3 рабочих дня.",
  },
  {
    question: "Как оформить предзаказ на фигурку?",
    answer:
      "Напишите нам в мессенджеры или через форму на сайте — подскажем сроки и условия. Предзаказ оформляется при частичной предоплате.",
  },
  {
    question: "Какие способы оплаты доступны?",
    answer:
      "Наличные и банковские карты при самовывозе/курьере, а также онлайн-оплата для интернет-заказов.",
  },
  {
    question: "Можно ли проверить товар при получении?",
    answer:
      "Да, мы рекомендуем осмотреть фигурку и упаковку. Если есть вопросы по комплектации — сразу сообщите нам.",
  },
  {
    question: "Есть ли у вас мягкие игрушки и мерч?",
    answer:
      "Да. В ассортименте мягкие игрушки, брелоки, коврики, постеры и другой мерч по популярным тайтлам.",
  },
  {
    question: "Как узнать о новинках и поступлениях?",
    answer:
      "Подписывайтесь на наш Telegram-канал — мы в режиме реального времени публикуем обновления ассортимента.",
  },
  {
    question: "Можно ли обменять или вернуть покупку?",
    answer:
      "Если товар новый, без следов эксплуатации и сохранена упаковка — возможен обмен/возврат согласно законодательству РБ.",
  },
  {
    question: "Делаете ли вы скидки?",
    answer:
      "Да, у нас регулярно проходят акции. Следите за разделом «Скидки» и за анонсами в Telegram.",
  },
  {
    question: "Поможете подобрать подарок фанату аниме?",
    answer:
      "Конечно. Расскажите, какие тайтлы нравятся, — предложим подходящие фигурки и мерч в нужном бюджете.",
  },
];

const VoprosOtvet = () => {
  return (
    <section className="py-16 relative z-10" id="voprosotvet">
      <div className="container mx-auto px-0 sd:px-12">
        <h2 className="sd:text-5xl xz:text-3xl font-normal">Часто задаваемые вопросы (FAQ)</h2>
        <div className="mt-9">
          {questionsAndAnswers.map((item, index) => (
            <details key={index} className="collapse bg-base-200 mb-3">
              <summary className="collapse-title sd:text-xl xz:text-sm font-medium">
                {item.question}
              </summary>
              <div className="collapse-content">
                <p className="sd:text-base xz:text-xs">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

       <Image
          src='/images/anime/anime-2.webp'
          alt='Аниме фигурка'
          width={200} height={200}
          className="absolute top-0 left-8 -z-10"
        />
    </section>
  );
};

export default VoprosOtvet;
