import { Facebook, Linkedin, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Instructors() {
  const t = useTranslations("about");

  const instructors = [
    {
      name: "Jack Lee",
      image: "/instructors/instructor-1-free-img.jpg",
      description: t("instructor1"),
      alt: "instructor1",
    },
    {
      name: "Nathaniel",
      image: "/instructors/instructor-2-free-img.jpg",
      description: t("instructor2"),
      alt: "instructor2",
    },
    {
      name: "Brice Norman",
      image: "/instructors/instructor-3-free-img.jpg",
      description: t("instructor3"),
      alt: "instructor3",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-7xl mx-auto py-8 md:py-12 lg:py-16">
      {instructors.map((instructor, index) => (
        <div
          key={index}
          className="group bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="relative overflow-hidden aspect-square">
            <img
              src={instructor.image}
              alt={instructor.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col items-center gap-2 md:gap-3 p-5 md:p-6 lg:p-8">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-center">
              {instructor.name}
            </h3>
            <p className="text-sm md:text-base font-normal text-muted-foreground text-center leading-relaxed">
              {instructor.description}
            </p>
            <div className="flex text-foreground gap-3 mt-2">
              <a
                href="#"
                className="bg-primary rounded-full p-2 hover:bg-primary/80 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="#"
                className="bg-primary rounded-full p-2 hover:bg-primary/80 transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="#"
                className="bg-primary rounded-full p-2 hover:bg-primary/80 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
