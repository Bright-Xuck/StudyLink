import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

const WhatsAppIcon = ({ className, ...props }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
  </svg>
);

export default function ContactCards() {
  const t = useTranslations("contactUs");
  
  const contactInfo = [
    {
      icon: Phone,
      title: `${t("callUs")} 24×7`,
      content: "691311346",
      href: "tel:691311346",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Mail,
      title: t("writeUs"),
      content: "btversea@gmail.com",
      href: "mailto:btversea@gmail.com",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: MapPin,
      title: t("mainoffice"),
      content: "Molyko, Buea Cameroon",
      href: null,
      color: "from-green-500 to-green-600",
    },
    {
      icon: WhatsAppIcon,
      title: t("messageUsOnWhatsApp"), 
      content: "691311346",
      href: "https://wa.me/237691311346",
      color: "from-emerald-500 to-emerald-600",
    },
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
          {t("message")}
        </p>
      </div>
    </div>
  );
}