import { ChevronDown } from "lucide-react"
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function FAQ(){
  const t = useTranslations("contactfaq")
  const [openFaqs, setOpenFaqs] = useState({
    faq1: false,
    faq2: false,
    faq3: false,
    faq4: false,
  });

  function toggleFaq(name) {
    setOpenFaqs((prev) => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      newState[name] = !prev[name];
      return newState;
    });
  }

  const faqs = [
    { key: "faq1", question: t('question1'), answer: t('answer1') },
    { key: "faq2", question: t('question2'), answer: t('answer2') },
    { key: "faq3", question: t('question3'), answer: t('answer3') },
    { key: "faq4", question: t('question4'), answer: t('answer4') }
  ];

  return(
    <section className="w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-5xl mx-auto my-12 md:my-16 lg:my-20 bg-white rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg border border-border">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 lg:mb-10 text-primary">
        {t('title')}
      </h1>
      <ul className="grid gap-4 md:gap-5">
        {faqs.map((faq) => (
          <li 
            key={faq.key}
            className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
          >
            <div 
              onClick={() => toggleFaq(faq.key)}
              className="flex justify-between items-center p-4 md:p-5 cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors duration-300"
            >
              <span className="font-semibold text-sm md:text-base lg:text-lg text-card-foreground pr-4">
                {faq.question}
              </span>
              <ChevronDown 
                className={`w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                  openFaqs[faq.key] ? "rotate-180" : ""
                }`} 
              />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${
              openFaqs[faq.key] ? "max-h-96" : "max-h-0"
            }`}>
              <p className="p-4 md:p-5 text-sm md:text-base text-muted-foreground leading-relaxed bg-white">
                {faq.answer}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}