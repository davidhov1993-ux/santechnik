import type { ChangeEvent, DragEvent, FormEvent } from "react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { businessEmail, hasBusinessEmail } from "@/src/content/contact";
import {
  businessPhoneDisplay,
  businessPhoneMachine,
  businessWhatsappUrl,
} from "@/src/content/site";
import { submitContactRequest } from "@/src/lib/contactForm";
import { pagePath } from "@/src/lib/locale";
import type { Locale } from "@/src/types";

type FormStatus = "idle" | "error" | "success" | "submitting";

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface TrustFact {
  title: string;
  body: string;
}

interface TrustBulletSection {
  eyebrow: string;
  title: string;
  items: string[];
}

interface PriceLine {
  label: string;
  value: string;
  body: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface TrustCopy {
  sectionLabel: string;
  introEyebrow: string;
  introTitle: string;
  introBody: string;
  facts: TrustFact[];
  sections: TrustBulletSection[];
  serviceAreaEyebrow: string;
  serviceAreaTitle: string;
  serviceAreaBody: string;
  serviceDistricts: string[];
  pricesEyebrow: string;
  pricesTitle: string;
  priceServiceHeader: string;
  priceCostHeader: string;
  prices: PriceLine[];
  pricesNote: string;
  discountEyebrow: string;
  discountTitle: string;
  discountBody: string;
  discountNote: string;
  faqEyebrow: string;
  faqTitle: string;
  faq: FaqItem[];
  contactEyebrow: string;
  contactTitle: string;
  contactBody: string;
  formNameLabel: string;
  formNamePlaceholder: string;
  formPhoneLabel: string;
  formPhonePlaceholder: string;
  formEmailLabel: string;
  formEmailPlaceholder: string;
  formMessageLabel: string;
  formMessagePlaceholder: string;
  formFilesLabel: string;
  formFilesButton: string;
  formFilesHint: string;
  formFilesDrag: string;
  formSocialDiscountLabel: string;
  formSocialDiscountHint: string;
  formSubmit: string;
  formSubmitPending: string;
  formPrivacyPrefix: string;
  formPrivacyLink: string;
  formPrivacySuffix: string;
  statusRequired: string;
  statusInvalidEmail: string;
  statusSuccess: string;
  statusSendError: string;
}

const phone = businessPhoneDisplay;
const phoneHref = `tel:${businessPhoneMachine}`;
const whatsappHref = businessWhatsappUrl;
const email = businessEmail;
const showEmail = hasBusinessEmail;

const trustContent: Record<Locale, TrustCopy> = {
  ru: {
    sectionLabel: "Условия вызова сантехника, цены, FAQ и связь",
    introEyebrow: "ВЫЗОВ САНТЕХНИКА",
    introTitle: "Вызов сантехника в Ереване: срочно, аккуратно, по делу",
    introBody:
      "Опишите проблему по телефону или WhatsApp: район Еревана, срочность, фото или видео узла. Так мастер быстрее понимает объём, берёт нужный инструмент и согласовывает стоимость до начала ремонта.",
    facts: [
      {
        title: "Срочный выезд по Еревану",
        body: "Когда течёт труба, не уходит вода или нужен аварийный сантехник 24/7, заявку проще согласовать сразу по звонку.",
      },
      {
        title: "Оценка по фото и описанию",
        body: "Если задача понятна по фото, стоимость называем заранее. Если нужен осмотр, объясняем это до выезда.",
      },
      {
        title: "Инструмент и материалы",
        body: "По описанию подбираем инструмент, расходники и детали, чтобы не растягивать мелкий ремонт на несколько поездок.",
      },
      {
        title: "Проверка результата",
        body: "После ремонта проверяем соединения, слив, напор воды и работу установленной сантехники.",
      },
    ],
    sections: [
      {
        eyebrow: "Для быстрой оценки",
        title: "Что сказать при звонке",
        items: [
          "район Еревана и насколько срочно нужен выезд",
          "где проблема: труба, слив, унитаз, смеситель, бойлер или техника",
          "есть ли доступ к кранам, стояку и месту протечки",
          "можно ли отправить фото или короткое видео",
        ],
      },
      {
        eyebrow: "На объекте",
        title: "Что важно проверить",
        items: [
          "герметичность соединений после ремонта",
          "как уходит вода и нет ли повторного засора",
          "напор горячей и холодной воды",
          "работу смесителя, сифона, унитаза, бойлера или техники",
        ],
      },
    ],
    serviceAreaEyebrow: "ЗОНА ОБСЛУЖИВАНИЯ",
    serviceAreaTitle: "Работаем по всем административным районам Еревана",
    serviceAreaBody:
      "Выезжаем на срочные и плановые заявки в жилые дома, квартиры, офисы, магазины и кафе по всему Еревану.",
    serviceDistricts: [
      "Кентрон",
      "Арабкир",
      "Нор-Норк",
      "Малатия-Себастия",
      "Ачапняк",
      "Шенгавит",
      "Канакер-Зейтун",
      "Эребуни",
      "Норк-Мараш",
      "Аван",
      "Давташен",
      "Нубарашен",
    ],
    pricesEyebrow: "ЦЕНЫ",
    pricesTitle: "Ориентировочные цены",
    priceServiceHeader: "Услуга",
    priceCostHeader: "Цена",
    prices: [
      {
        label: "Выезд сантехника по Еревану",
        value: "10 000 ֏",
        body: "Плановый выезд сантехника по Еревану.",
      },
      {
        label: "Мелкий сантехнический ремонт",
        value: "10 000 ֏",
        body: "Небольшие протечки, неисправности смесителей, сливных механизмов и другие локальные сантехнические работы.",
      },
      {
        label: "Установка и замена сантехники",
        value: "от 5 000 ֏",
        body: "Установка и замена смесителей, раковин, кухонных моек, унитазов и другого сантехнического оборудования.",
      },
      {
        label: "Монтаж душевой кабины",
        value: "от 20 000 ֏",
        body: "Монтаж душевой кабины с подключением к подготовленным коммуникациям.",
      },
      {
        label: "Разводка воды и канализации",
        value: "от 15 000 ֏ за точку",
        body: "Разводка водоснабжения и канализации, перенос коммуникаций и создание новых точек подключения.",
      },
      {
        label: "Аварийный вызов 24/7",
        value: "20 000 ֏",
        body: "Аварийные протечки, прорывы труб и другие неисправности, требующие немедленного выезда.",
      },
    ],
    pricesNote:
      "Минимальная стоимость заказа по Еревану — 10 000 ֏. Отдельная плата за выезд не начисляется. Если стоимость работ превышает 10 000 ֏, клиент оплачивает фактический объём выполненных работ. Материалы оплачиваются отдельно. Окончательная стоимость согласовывается до начала работ.",
    discountEyebrow: "СОЦИАЛЬНАЯ СКИДКА 10%",
    discountTitle: "Пенсионерам — скидка 10% на работу",
    discountBody: "Скажите об этом при звонке или отметьте в заявке. Скидку считаем от стоимости работы, без материалов.",
    discountNote: "ФИНАЛЬНУЮ ЦЕНУ НАЗЫВАЕМ ДО НАЧАЛА РАБОТ.",
    faqEyebrow: "FAQ",
    faqTitle: "Частые вопросы",
    faq: [
      {
        question: "Работаете 24/7?",
        answer: "Да. Принимаем срочные заявки круглосуточно. Срочный выезд 24/7 стоит 20 000 ֏, окончательную стоимость согласовываем до начала работ.",
      },
      {
        question: "За сколько приезжаете по Еревану?",
        answer: "Обычно выезд занимает от 30 до 60 минут. Точное время зависит от района, дорожной ситуации и занятости мастера.",
      },
      {
        question: "Можно сначала просто проконсультироваться?",
        answer: "Да. Можно позвонить или написать в WhatsApp, коротко объяснить проблему и, при возможности, отправить фотографию или видео. Если ответ можно дать без выезда, скажем сразу.",
      },
      {
        question: "Когда вы называете цену?",
        answer: "Если стоимость можно определить по описанию или фотографии, называем её заранее. Если без осмотра нельзя, сначала объясняем стоимость выезда и диагностики. Работу начинаем только после согласования.",
      },
      {
        question: "Берёте мелкие работы?",
        answer: "Да. Можно вызвать сантехника для замены смесителя, сифона, шланга, вентиля, установки раковины, подключения техники и других небольших работ.",
      },
      {
        question: "Устраняете сложные засоры?",
        answer: "Да. Работаем с засорами в раковинах, ваннах, душевых, унитазах и канализационных трубах. Способ и стоимость зависят от места и сложности засора.",
      },
      {
        question: "Исправляете чужую плохую работу?",
        answer: "Да, если проблему можно исправить безопасно и надёжно. Сначала осматриваем объект и объясняем, что именно сделано неправильно.",
      },
      {
        question: "Покупаете материалы?",
        answer: "По договорённости мастер может помочь выбрать или приобрести необходимые материалы. Их стоимость оплачивается отдельно.",
      },
      {
        question: "Можно вызвать сантехника вечером или ночью?",
        answer: "Да. Ночные и срочные заявки принимаются круглосуточно. Для них действует тариф срочного выезда 20 000 ֏.",
      },
      {
        question: "Работаете с квартирами после ремонта?",
        answer: "Да. Подключаем сантехнику и технику, устанавливаем смесители, раковины, унитазы, душевые системы, бойлеры и проверяем соединения.",
      },
      {
        question: "Работаете с новостройками?",
        answer: "Да. Выполняем разводку водоснабжения и канализации, монтаж сантехнических точек и подготовку коммуникаций под дальнейшую отделку.",
      },
    ],
    contactEyebrow: "СВЯЗЬ",
    contactTitle: "Есть фото или видео проблемы? Прикрепите к заявке.",
    contactBody: "Если течёт труба, забился слив, нужно установить сантехнику или заменить коммуникации, приложите фото — так будет проще быстрее оценить задачу.",
    formNameLabel: "ИМЯ",
    formNamePlaceholder: "Ваше имя",
    formPhoneLabel: "ТЕЛЕФОН",
    formPhonePlaceholder: "+374",
    formEmailLabel: "EMAIL — НЕОБЯЗАТЕЛЬНО",
    formEmailPlaceholder: "name@example.com",
    formMessageLabel: "СООБЩЕНИЕ",
    formMessagePlaceholder: "Что случилось, что нужно сделать, есть ли срочность.",
    formFilesLabel: "ФАЙЛЫ",
    formFilesButton: "ПРИКРЕПИТЬ",
    formFilesHint: "Фото, PDF, Word, Excel. До 8 файлов, до 3 МБ суммарно.",
    formFilesDrag: "Видео лучше отправить в WhatsApp.",
    formSocialDiscountLabel: "Хочу уточнить скидку 10%",
    formSocialDiscountHint: "Для пенсионеров. Без документов на сайте — детали можно обсудить по телефону.",
    formSubmit: "ОТПРАВИТЬ ЗАЯВКУ",
    formSubmitPending: "Отправляем...",
    formPrivacyPrefix: "Нажимая кнопку, вы соглашаетесь с",
    formPrivacyLink: "Политикой конфиденциальности",
    formPrivacySuffix: ".",
    statusRequired: "Оставьте имя, телефон, коротко опишите задачу и подтвердите согласие с Политикой конфиденциальности.",
    statusInvalidEmail: "Проверьте email или оставьте это поле пустым.",
    statusSuccess: "Заявка отправлена. Если вопрос срочный, лучше сразу позвонить.",
    statusSendError: "Заявка не отправилась. Попробуйте ещё раз или свяжитесь с нами по телефону или WhatsApp.",
  },
  hy: {
    sectionLabel: "Սանտեխնիկի կանչի պայմաններ, գներ, FAQ և կապ",
    introEyebrow: "ՍԱՆՏԵԽՆԻԿԻ ԿԱՆՉ",
    introTitle: "Սանտեխնիկի կանչ Երևանում՝ արագ, խնամքով և ըստ գործի",
    introBody:
      "Նկարագրեք խնդիրը հեռախոսով կամ WhatsApp-ով՝ Երևանի շրջան, շտապողականություն, հանգույցի լուսանկար կամ տեսանյութ։ Այդպես վարպետն ավելի արագ է հասկանում ծավալը, վերցնում անհրաժեշտ գործիքը և համաձայնեցնում արժեքը մինչև վերանորոգումը:",
    facts: [
      {
        title: "Շտապ այց Երևանում",
        body: "Երբ խողովակն է հոսում, ջուրը չի հեռանում կամ պետք է շտապ սանտեխնիկ 24/7, հայտը հեշտ է համաձայնեցնել անմիջապես զանգով:",
      },
      {
        title: "Գնահատում լուսանկարով և նկարագրությամբ",
        body: "Եթե խնդիրը պարզ է լուսանկարով, արժեքը ասում ենք նախապես: Եթե զննում է պետք, դա բացատրում ենք մինչև այցը:",
      },
      {
        title: "Գործիքներ և նյութեր",
        body: "Նկարագրության հիման վրա ընտրում ենք անհրաժեշտ գործիքը, մանր նյութերը և դետալները, որպեսզի փոքր վերանորոգումը չձգվի մի քանի այցով:",
      },
      {
        title: "Արդյունքի ստուգում",
        body: "Վերանորոգումից հետո ստուգում ենք միացումները, ջրահեռացումը, ջրի ճնշումը և տեղադրված սանտեխնիկայի աշխատանքը:",
      },
    ],
    sections: [
      {
        eyebrow: "Արագ գնահատման համար",
        title: "Ինչ ասել զանգի ընթացքում",
        items: [
          "Երևանի շրջանը և որքան շտապ է անհրաժեշտ այցը",
          "որտեղ է խնդիրը՝ խողովակ, սլիվ, զուգարան, ծորակ, ջրատաքացուցիչ կամ տեխնիկա",
          "կա արդյոք մուտք դեպի փականները, կանգնակը և արտահոսքի տեղը",
          "կարելի է արդյոք ուղարկել լուսանկար կամ կարճ տեսանյութ",
        ],
      },
      {
        eyebrow: "Օբյեկտում",
        title: "Ինչն է կարևոր ստուգել",
        items: [
          "միացումների հերմետիկությունը վերանորոգումից հետո",
          "ինչպես է հեռանում ջուրը և չկա արդյոք կրկնվող խցանում",
          "տաք և սառը ջրի ճնշումը",
          "ծորակի, սիֆոնի, զուգարանի, ջրատաքացուցիչի կամ տեխնիկայի աշխատանքը",
        ],
      },
    ],
    serviceAreaEyebrow: "ՍՊԱՍԱՐԿՄԱՆ ՏԱՐԱԾՔ",
    serviceAreaTitle: "Աշխատում ենք Երևանի բոլոր վարչական շրջաններում",
    serviceAreaBody:
      "Շտապ և պլանային հայտերով այցելում ենք բնակարաններ, առանձնատներ, գրասենյակներ, խանութներ և սրճարաններ ամբողջ Երևանում:",
    serviceDistricts: [
      "Կենտրոն",
      "Արաբկիր",
      "Նոր Նորք",
      "Մալաթիա-Սեբաստիա",
      "Աջափնյակ",
      "Շենգավիթ",
      "Քանաքեռ-Զեյթուն",
      "Էրեբունի",
      "Նորք-Մարաշ",
      "Ավան",
      "Դավթաշեն",
      "Նուբարաշեն",
    ],
    pricesEyebrow: "ԳՆԵՐ",
    pricesTitle: "Մոտավոր գներ",
    priceServiceHeader: "Ծառայություն",
    priceCostHeader: "Արժեք",
    prices: [
      {
        label: "Սանտեխնիկի մեկնում Երևանում",
        value: "10 000 ֏",
        body: "Սանտեխնիկի պլանային մեկնում Երևանի տարածքում:",
      },
      {
        label: "Սանտեխնիկական մանր վերանորոգում",
        value: "10 000 ֏",
        body: "Փոքր արտահոսքեր, ծորակների, ջրահեռացման մեխանիզմների անսարքություններ և այլ տեղային սանտեխնիկական աշխատանքներ:",
      },
      {
        label: "Սանտեխնիկայի տեղադրում և փոխարինում",
        value: "5 000 ֏-ից",
        body: "Ծորակների, լվացարանների, զուգարանակոնքերի և այլ սանտեխնիկական սարքերի տեղադրում ու փոխարինում:",
      },
      {
        label: "Լոգախցիկի մոնտաժ",
        value: "20 000 ֏-ից",
        body: "Լոգախցիկի մոնտաժ՝ պատրաստված կոմունիկացիաներին միացումով:",
      },
      {
        label: "Ջրամատակարարման և կոյուղու անցկացում",
        value: "15 000 ֏-ից / կետ",
        body: "Ջրամատակարարման և կոյուղու անցկացում, կոմունիկացիաների տեղափոխում և նոր միացման կետերի ստեղծում:",
      },
      {
        label: "Վթարային կանչ 24/7",
        value: "20 000 ֏",
        body: "Վթարային արտահոսքեր, խողովակների վնասումներ և այլ խնդիրներ, որոնք պահանջում են անհապաղ այց:",
      },
    ],
    pricesNote:
      "Երևանում պատվերի նվազագույն արժեքը 10 000 ֏ է: Առանձին այցի վճար չի գանձվում: Եթե աշխատանքների արժեքը գերազանցում է 10 000 ֏, հաճախորդը վճարում է կատարված աշխատանքի փաստացի ծավալի համար: Նյութերը վճարվում են առանձին: Վերջնական արժեքը համաձայնեցվում է մինչև աշխատանքների սկիզբը:",
    discountEyebrow: "ՍՈՑԻԱԼԱԿԱՆ ԶԵՂՉ՝ 10%",
    discountTitle: "Թոշակառուների համար — 10% զեղչ կատարված աշխատանքների համար:",
    discountBody: "Հայտնեք այդ մասին զանգի ընթացքում կամ նշեք հայտի մեջ: Զեղչը հաշվարկվում է միայն աշխատանքի արժեքից՝ առանց նյութերի:",
    discountNote: "ՎԵՐՋՆԱԿԱՆ ԳԻՆԸ ՆՇՎՈՒՄ Է ՄԻՆՉԵՎ ԱՇԽԱՏԱՆՔՆԵՐԸ ՍԿՍԵԼԸ:",
    faqEyebrow: "FAQ (ՀԱՃԱԽ ՏՐՎՈՂ ՀԱՐՑԵՐ)",
    faqTitle: "Հաճախ տրվող հարցեր",
    faq: [
      {
        question: "Աշխատո՞ւմ եք 24/7 ռեժիմով:",
        answer: "Այո: Շտապ հայտեր ընդունում ենք շուրջօրյա: Շտապ այցը 24/7 արժե 20 000 ֏, վերջնական արժեքը համաձայնեցվում է մինչև աշխատանքի սկիզբը:",
      },
      {
        question: "Որքա՞ն ժամանակում եք հասնում Երևանի տարածքում:",
        answer: "Սովորաբար այցը տևում է 30–60 րոպե: Ճշգրիտ ժամանակը կախված է շրջանից, ճանապարհային վիճակից և վարպետի զբաղվածությունից:",
      },
      {
        question: "Կարո՞ղ եմ սկզբում պարզապես խորհրդատվություն ստանալ:",
        answer: "Այո: Կարող եք զանգահարել կամ գրել WhatsApp-ով, կարճ բացատրել խնդիրը և հնարավորության դեպքում ուղարկել լուսանկար կամ տեսանյութ:",
      },
      {
        question: "Ե՞րբ եք ասում աշխատանքի գինը:",
        answer: "Եթե արժեքը հնարավոր է որոշել նկարագրությամբ կամ լուսանկարով, ասում ենք նախապես: Եթե առանց զննման հնարավոր չէ, նախ բացատրում ենք այցի և ախտորոշման արժեքը:",
      },
      {
        question: "Վերցնո՞ւմ եք փոքր ծավալի աշխատանքներ:",
        answer: "Այո: Կարող եք կանչել սանտեխնիկին ծորակի, սիֆոնի, ճկուն խողովակի, փականի, լվացարանի տեղադրման կամ տեխնիկայի միացման համար:",
      },
      {
        question: "Բարդ խցանումներ վերացնո՞ւմ եք:",
        answer: "Այո: Աշխատում ենք լվացարանների, լոգարանների, ցնցուղների, զուգարանակոնքերի և կոյուղու խողովակների խցանումների հետ:",
      },
      {
        question: "Ուրիշների վատ արած աշխատանքը ուղղո՞ւմ եք:",
        answer: "Այո, եթե խնդիրը հնարավոր է ուղղել անվտանգ և հուսալի ձևով: Նախ զննում ենք և բացատրում, թե ինչն է սխալ արված:",
      },
      {
        question: "Նյութերը գնո՞ւմ եք:",
        answer: "Պայմանավորվածությամբ վարպետը կարող է օգնել ընտրել կամ գնել անհրաժեշտ նյութերը: Դրանց արժեքը վճարվում է առանձին:",
      },
      {
        question: "Կարելի՞ է սանտեխնիկ կանչել երեկոյան կամ գիշերը:",
        answer: "Այո: Գիշերային և շտապ հայտերն ընդունվում են շուրջօրյա: Դրանց համար գործում է շտապ այցի սակագին՝ 20 000 ֏:",
      },
      {
        question: "Աշխատո՞ւմ եք վերանորոգումից հետո բնակարանների հետ:",
        answer: "Այո: Միացնում ենք սանտեխնիկան և տեխնիկան, տեղադրում ենք ծորակներ, լվացարաններ, զուգարանակոնքեր, ցնցուղային համակարգեր, ջրատաքացուցիչներ և ստուգում միացումները:",
      },
      {
        question: "Աշխատո՞ւմ եք նորակառույցներում:",
        answer: "Այո: Կատարում ենք ջրամատակարարման և կոյուղու անցկացում, սանտեխնիկական կետերի մոնտաժ և կոմունիկացիաների պատրաստում հետագա հարդարման համար:",
      },
    ],
    contactEyebrow: "Կապ",
    contactTitle: "Խնդրի լուսանկար կամ տեսանյութ ունե՞ք։ Կցեք հայտին։",
    contactBody: "Եթե խողովակն է հոսում, ջրահեռացումն է խցանվել, պետք է սանտեխնիկա տեղադրել կամ փոխել կոմունիկացիաները, կցեք լուսանկար. այդպես ավելի արագ կգնահատենք խնդիրը:",
    formNameLabel: "Անուն",
    formNamePlaceholder: "Ձեր անունը",
    formPhoneLabel: "Հեռախոսահամար",
    formPhonePlaceholder: "+374",
    formEmailLabel: "Էլ. փոստ (պարտադիր չէ)",
    formEmailPlaceholder: "name@example.com",
    formMessageLabel: "Հաղորդագրություն",
    formMessagePlaceholder: "Ի՞նչ է պատահել, ի՞նչ է անհրաժեշտ անել, կա՞ արդյոք շտապողականություն:",
    formFilesLabel: "Ֆայլեր",
    formFilesButton: "Կցել ֆայլ",
    formFilesHint: "Լուսանկար, PDF, Word, Excel: Մինչև 8 ֆայլ, ընդհանուր մինչև 3 ՄԲ։",
    formFilesDrag: "Տեսանյութը լավ է ուղարկել WhatsApp-ով:",
    formSocialDiscountLabel: "Ցանկանում եմ ճշտել 10% զեղչը",
    formSocialDiscountHint: "Թոշակառուների համար: Կայքում փաստաթղթեր ներկայացնելու կարիք չկա — մանրամասները կարող եք քննարկել հեռախոսով:",
    formSubmit: "Ուղարկել հայտը",
    formSubmitPending: "Ուղարկվում է...",
    formPrivacyPrefix: "Սեղմելով կոճակը՝ Դուք համաձայնում եք",
    formPrivacyLink: "Գաղտնիության քաղաքականությանը",
    formPrivacySuffix: ":",
    statusRequired: "Լրացրեք Ձեր անունը, հեռախոսահամարը, հակիրճ նկարագրեք խնդիրը և հաստատեք համաձայնությունը Գաղտնիության քաղաքականության հետ:",
    statusInvalidEmail: "Ստուգեք էլ. փոստի հասցեն կամ թողեք այս դաշտը դատարկ:",
    statusSuccess: "Հայտն ուղարկված է: Եթե հարցը շտապ է, ավելի լավ է անմիջապես զանգահարել:",
    statusSendError: "Հայտը չի ուղարկվել։ Կրկնեք փորձը կամ կապ հաստատեք հեռախոսով կամ WhatsApp-ով:",
  },
};

function sanitizePhone(value: string) {
  return value.replace(/[^\d+\s()-]/g, "").slice(0, 24);
}

function applyFileLimit(files: File[] | FileList | null) {
  return Array.from(files ?? []).slice(0, 8);
}

function hasValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

function HomeTrustProcessCopy({ copy, locale }: { copy: TrustCopy; locale: Locale }) {
  const callout =
    locale === "ru"
      ? {
          eyebrow: "Как стартуем",
          title: "Сначала понимаем задачу, потом называем цену",
          body: "Фото, район и срочность помогают сразу взять правильный инструмент и не растягивать мелкий ремонт.",
          phone: "Позвонить",
          whatsapp: "WhatsApp",
        }
      : {
          eyebrow: "Ինչպես ենք սկսում",
          title: "Նախ հասկանում ենք խնդիրը, հետո ասում արժեքը",
          body: "Լուսանկարը, շրջանը և շտապությունը օգնում են անմիջապես վերցնել ճիշտ գործիքը և չերկարացնել փոքր նորոգումը։",
          phone: "Զանգել",
          whatsapp: "WhatsApp",
        };

  return (
    <section className={`home-trust-process home-trust-process--${locale}`} aria-labelledby="home-trust-process-title">
      <div className="home-trust-process__intro">
        <div className="home-trust-process__label-row">
          <span className="home-trust-process__label-mark" aria-hidden="true" />
          <p className="home-trust-process__eyebrow">{copy.introEyebrow}</p>
        </div>
        <div className="home-trust-process__intro-copy">
          <h2 id="home-trust-process-title" className="home-trust-process__title">
            {copy.introTitle}
          </h2>
          <p className="home-trust-process__lead">{copy.introBody}</p>
        </div>
        <aside className="home-trust-process__callout" aria-label={callout.eyebrow}>
          <p className="home-trust-process__callout-eyebrow">{callout.eyebrow}</p>
          <h3 className="home-trust-process__callout-title">{callout.title}</h3>
          <p className="home-trust-process__callout-body">{callout.body}</p>
          <div className="home-trust-process__callout-actions">
            <a href={phoneHref}>{callout.phone}</a>
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              {callout.whatsapp}
            </a>
          </div>
        </aside>
      </div>

      <div className="home-trust-process__facts" aria-label={copy.introEyebrow}>
        {copy.facts.map((fact, index) => (
          <article key={fact.title} className="home-trust-process__fact">
            <span className="home-trust-process__fact-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="home-trust-process__fact-copy">
              <h3 className="home-trust-process__fact-title">{fact.title}</h3>
              <p className="home-trust-process__fact-body">{fact.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="home-trust-process__details">
        {copy.sections.map((section, index) => (
          <section key={section.title} className="home-trust-process__detail">
            <span className="home-trust-process__detail-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="home-trust-process__detail-eyebrow">{section.eyebrow}</p>
            <h3 className="home-trust-process__detail-title">{section.title}</h3>
            <ul className="home-trust-process__list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

export function HomeTrustSection({ locale }: { locale: Locale }) {
  const copy = trustContent[locale];
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const messageId = useId();
  const fileId = useId();
  const privacyId = useId();
  const dragDepth = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [socialDiscountRequested, setSocialDiscountRequested] = useState(false);

  const resetStatus = () => {
    if (status !== "idle") {
      setStatus("idle");
    }

    if (statusMessage) {
      setStatusMessage("");
    }
  };

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: name === "phone" ? sanitizePhone(value) : value,
    }));
    resetStatus();
  };

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFiles(applyFileLimit(event.target.files));
    resetStatus();
  };

  const handleFileRemove = (indexToRemove: number) => {
    setFiles((current) => current.filter((_, index) => index !== indexToRemove));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    resetStatus();
  };

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current += 1;
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);

    if (dragDepth.current === 0) {
      setDragActive(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!dragActive) {
      setDragActive(true);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = 0;
    setDragActive(false);
    setFiles(applyFileLimit(event.dataTransfer.files));
    resetStatus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const phoneDigits = values.phone.replace(/\D/g, "");
    const hasRequiredFields =
      values.name.trim().length >= 2 &&
      phoneDigits.length >= 7 &&
      values.message.trim().length >= 8 &&
      privacyAccepted;
    const hasEmail = values.email.trim().length > 0;

    if (!hasRequiredFields) {
      setStatus("error");
      setStatusMessage(copy.statusRequired);
      return;
    }

    if (hasEmail && !hasValidEmail(values.email)) {
      setStatus("error");
      setStatusMessage(copy.statusInvalidEmail);
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const result = await submitContactRequest({
        locale,
        source: "home-trust-form",
        name: values.name,
        phone: values.phone,
        email: values.email,
        message: values.message,
        privacyAccepted,
        socialDiscountRequested,
        files,
      });

      if (!result.ok) {
        setStatus("error");
        setStatusMessage(result.message ?? copy.statusSendError);
        return;
      }

      setValues({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
      setFiles([]);
      setPrivacyAccepted(false);
      setSocialDiscountRequested(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setStatus("success");
      setStatusMessage(result.message ?? copy.statusSuccess);
    } catch {
      setStatus("error");
      setStatusMessage(copy.statusSendError);
    }
  };

  return (
    <section id="doverie" className="home-trust-page" aria-label={copy.sectionLabel}>
      <div className="home-trust-page__inner">
        <HomeTrustProcessCopy copy={copy} locale={locale} />

        <section className="home-trust-page__service-area" aria-labelledby="home-trust-service-area-title">
          <div className="home-trust-page__section-head">
            <p className="home-trust-page__section-eyebrow">{copy.serviceAreaEyebrow}</p>
            <h2 id="home-trust-service-area-title" className="home-trust-page__section-title">
              {copy.serviceAreaTitle}
            </h2>
          </div>

          <p className="home-trust-page__service-area-body">{copy.serviceAreaBody}</p>

          <ul className="home-trust-page__district-list" aria-label={copy.serviceAreaTitle}>
            {copy.serviceDistricts.map((district) => (
              <li key={district}>{district}</li>
            ))}
          </ul>
        </section>

        <section className="home-trust-page__prices" aria-labelledby="home-trust-prices-title">
          <div className="home-trust-page__section-head">
            <p className="home-trust-page__section-eyebrow">{copy.pricesEyebrow}</p>
            <h3 id="home-trust-prices-title" className="home-trust-page__section-title">
              {copy.pricesTitle}
            </h3>
          </div>

          <div className="home-trust-page__price-table-wrap">
            <table className="home-trust-page__price-table">
              <thead>
                <tr>
                  <th scope="col">{copy.priceServiceHeader}</th>
                  <th scope="col">{copy.priceCostHeader}</th>
                </tr>
              </thead>
              <tbody>
                {copy.prices.map((line) => (
                  <tr key={line.label}>
                    <td>
                      <span className="home-trust-page__price-service-title">{line.label}</span>
                      <span className="home-trust-page__price-service-body">{line.body}</span>
                    </td>
                    <td>
                      <span className="home-trust-page__price-value-inline">{line.value}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="home-trust-page__prices-note">{copy.pricesNote}</p>

          <article className="home-trust-page__discount">
            <div className="home-trust-page__discount-copy">
              <p className="home-trust-page__discount-eyebrow">{copy.discountEyebrow}</p>
              <h4 className="home-trust-page__discount-title">{copy.discountTitle}</h4>
              <p className="home-trust-page__discount-body">{copy.discountBody}</p>
            </div>
            <p className="home-trust-page__discount-note">{copy.discountNote}</p>
          </article>
        </section>

        <section id="svyaz" className="home-trust-page__contact" aria-labelledby="home-trust-contact-title">
          <div className="home-trust-page__contact-intro">
            <div className="home-trust-page__section-head">
              <p className="home-trust-page__section-eyebrow">{copy.contactEyebrow}</p>
              <h3 id="home-trust-contact-title" className="home-trust-page__section-title">
                {copy.contactTitle}
              </h3>
            </div>

            <p className="home-trust-page__contact-text">{copy.contactBody}</p>

            <div className="home-trust-page__contact-links">
              <a href={phoneHref}>{phone}</a>
              <a href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
              {showEmail ? <a href={`mailto:${email}`}>{email}</a> : null}
            </div>
          </div>

          <form className="home-trust-form" onSubmit={handleSubmit} noValidate>
            <div className="home-trust-form__contact-row">
              <label className="home-trust-form__field" htmlFor={nameId}>
                <span className="home-trust-form__field-label">{copy.formNameLabel}</span>
                <input
                  id={nameId}
                  className="home-trust-form__input"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleFieldChange}
                  placeholder={copy.formNamePlaceholder}
                  autoComplete="name"
                />
              </label>

              <label className="home-trust-form__field" htmlFor={phoneId}>
                <span className="home-trust-form__field-label">{copy.formPhoneLabel}</span>
                <input
                  id={phoneId}
                  className="home-trust-form__input"
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleFieldChange}
                  placeholder={copy.formPhonePlaceholder}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </label>

              <label className="home-trust-form__field" htmlFor={emailId}>
                <span className="home-trust-form__field-label">{copy.formEmailLabel}</span>
                <input
                  id={emailId}
                  className="home-trust-form__input"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleFieldChange}
                  placeholder={copy.formEmailPlaceholder}
                  autoComplete="email"
                />
              </label>
            </div>

            <label className="home-trust-form__social-option">
              <input
                type="checkbox"
                checked={socialDiscountRequested}
                onChange={(event) => {
                  setSocialDiscountRequested(event.target.checked);
                  resetStatus();
                }}
              />
              <span className="home-trust-form__social-option-copy">
                <strong>{copy.formSocialDiscountLabel}</strong>
                <small>{copy.formSocialDiscountHint}</small>
              </span>
            </label>

            <label className="home-trust-form__field" htmlFor={messageId}>
              <span className="home-trust-form__field-label">{copy.formMessageLabel}</span>
              <textarea
                id={messageId}
                className="home-trust-form__textarea"
                rows={7}
                name="message"
                value={values.message}
                onChange={handleFieldChange}
                placeholder={copy.formMessagePlaceholder}
              />
            </label>

            <div className="home-trust-form__bottom">
              <label
                className={`home-trust-form__field home-trust-form__field--files ${dragActive ? "is-drag-active" : ""}`.trim()}
                htmlFor={fileId}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <span className="home-trust-form__field-label">{copy.formFilesLabel}</span>
                <input
                  id={fileId}
                  ref={fileInputRef}
                  className="home-trust-form__file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.heic,.webp,.txt"
                  onChange={handleFilesChange}
                />

                <span className="home-trust-form__file-shell">
                  <span className="home-trust-form__file-button">{copy.formFilesButton}</span>
                  <span className="home-trust-form__file-copy">
                    <span className="home-trust-form__file-hint">{copy.formFilesHint}</span>
                    <span className="home-trust-form__file-drag">{copy.formFilesDrag}</span>
                  </span>
                </span>

                {files.length > 0 ? (
                  <span className="home-trust-form__file-list" aria-live="polite">
                    {files.map((file, index) => (
                      <span key={`${file.name}-${file.lastModified}-${index}`} className="home-trust-form__file-item">
                        <span className="home-trust-form__file-name">{file.name}</span>
                        <button
                          type="button"
                          className="home-trust-form__file-remove"
                          aria-label={`Удалить файл ${file.name}`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleFileRemove(index);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </span>
                ) : null}
              </label>

              <div className="home-trust-form__actions">
                <button type="submit" className="home-trust-form__submit" disabled={status === "submitting"}>
                  {status === "submitting" ? copy.formSubmitPending : copy.formSubmit}
                </button>
                <label className="home-trust-form__consent" htmlFor={privacyId}>
                  <input
                    id={privacyId}
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(event) => {
                      setPrivacyAccepted(event.target.checked);
                      resetStatus();
                    }}
                    required
                  />
                  <span>
                    {copy.formPrivacyPrefix} <Link to={pagePath(locale, "privacy")}>{copy.formPrivacyLink}</Link>
                    {copy.formPrivacySuffix}
                  </span>
                </label>

                {status === "error" ? (
                  <p className="home-trust-form__note" role="status" aria-live="polite">
                    {statusMessage}
                  </p>
                ) : null}

                {status === "success" || status === "submitting" ? (
                  <p className="home-trust-form__note" role="status" aria-live="polite">
                    {status === "submitting" ? copy.formSubmitPending : statusMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </form>
        </section>
      </div>
    </section>
  );
}
