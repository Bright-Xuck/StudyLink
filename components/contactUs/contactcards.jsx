import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactCards() {
  const t = useTranslations("contactUs");
  
  const contactInfo = [
    {
      icon: Phone,
      title: `${t("callUs")} 24×7`,
      content: "678787884",
      href: "tel:678787884",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Mail,
      title: t("writeUs"),
      content: "email@example.com",
      href: "mailto:email@example.com",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MapPin,
      title: t("mainoffice"),
      content: "Molyko, Buea Cameroon",
      href: null,
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-7xl mx-auto mt-8 md:mt-12 lg:mt-16">
      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
        {contactInfo.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="group bg-muted rounded-xl md:rounded-2xl p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-border transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-background" />
              </div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-center mb-3 md:mb-4">
                {item.title}
              </h2>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-base md:text-lg lg:text-xl text-primary hover:text-primary/80 transition-colors text-center block font-medium"
                >
                  {item.content}
                </a>
              ) : (
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground text-center">
                  {item.content}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Send Message Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl md:rounded-2xl p-8 md:p-10 lg:p-12 shadow-xl text-center">
        <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary-foreground">
          Send Us a Message
        </p>
      </div>
    </div>
  );
}