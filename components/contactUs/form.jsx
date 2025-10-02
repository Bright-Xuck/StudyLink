import { Send } from "lucide-react";

export default function Form() {
  return (
    <div className="w-[95%] md:w-[90%] lg:w-[85% max-w-5xl mx-auto my-8 md:my-12 lg:my-16">
      <form className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="name" 
              className="text-sm md:text-base font-semibold text-card-foreground"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="px-4 py-3 md:py-3.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm md:text-base"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="email" 
              className="text-sm md:text-base font-semibold text-card-foreground"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="px-4 py-3 md:py-3.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm md:text-base"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-2 mb-6">
          <label 
            htmlFor="subject" 
            className="text-sm md:text-base font-semibold text-card-foreground"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="px-4 py-3 md:py-3.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm md:text-base"
            placeholder="How can we help you?"
          />
        </div>

        {/* Comment or Message */}
        <div className="flex flex-col gap-2 mb-6">
          <label 
            htmlFor="comment" 
            className="text-sm md:text-base font-semibold text-card-foreground"
          >
            Comment or Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="comment"
            id="comment"
            required
            rows="6"
            className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none text-sm md:text-base"
            placeholder="Tell us more about your inquiry..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full md:w-auto mx-auto px-8 py-3 md:py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base"
        >
          Send Message
          <Send className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </form>
    </div>
  );
}