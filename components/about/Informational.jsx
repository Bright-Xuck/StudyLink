import { useTranslations } from "next-intl";

export default function Informational() {
  const t = useTranslations("about");

  const stats = [
    { value: "10+", label: t("award") },
    { value: "5+", label: t("country") },
    { value: "12+", label: t("partner") },
    { value: "7K+", label: t("student") }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-6xl mx-auto">
        {/* Stats Section */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-10 lg:p-12 mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 lg:mb-16 text-primary">
            {t("number")}
          </h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="flex flex-col items-center justify-center p-4 md:p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 md:mb-3">
                  {stat.value}
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground text-center font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Students Title Section */}
        <div className="bg-card rounded-xl md:rounded-2xl shadow-lg p-6 md:p-10 lg:p-12 text-center border border-border hover:shadow-xl transition-all duration-300">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-card-foreground leading-tight">
            {t("studentstitle")}
          </h1>
        </div>
      </div>
    </section>
  );
}