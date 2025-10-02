import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";

export default function Reviews() {
  const t = useTranslations("aboutReviews");

  const reviews = [
    { 
      name: "Kevin Black", 
      location: t("location1"), 
      review: t("review1"),
      color: "bg-gradient-to-br from-red-400 to-red-600"
    },
    { 
      name: "Mark", 
      location: t("location2"), 
      review: t("review2"),
      color: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    { 
      name: "Joseph Mbeye", 
      location: t("location3"), 
      review: t("review3"),
      color: "bg-gradient-to-br from-green-400 to-green-600"
    },
    { 
      name: "Justin", 
      location: t("location4"), 
      review: t("review4"),
      color: "bg-gradient-to-br from-purple-400 to-purple-600"
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-neutral-50">
      <div className="w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 lg:mb-16 text-primary">
          What Our Students Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 md:p-8 flex flex-col gap-4 md:gap-5 border border-border transform hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="flex justify-start">
                <Quote className="w-8 h-8 md:w-10 md:h-10 text-primary/20" />
              </div>
              
              {/* Review Text */}
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed italic flex-grow">
                "{review.review}"
              </p>
              
              {/* Reviewer Info */}
              <div className="flex items-center gap-3 md:gap-4 pt-4 border-t border-border">
                <div className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full ${review.color} flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-md flex-shrink-0`}>
                  {review.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base md:text-lg font-semibold text-card-foreground">
                    {review.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}