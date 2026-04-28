import { Github, ExternalLink, Clock, BookOpen } from "lucide-react";

export default function ProjectBoxes({ id, name, description, image, subjects, liveLink, githubLink, features, comingSoon }) {
  return (
    <div className="bg-card backdrop-blur-sm border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:scale-105 relative shadow-sm">
      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-3 py-1 bg-warning/20 text-warning-foreground text-xs rounded-full border border-warning/30">
            <Clock size={12} />
            <span className="font-medium">Coming Soon</span>
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="w-full h-48 overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-3">{name}</h2>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{description}</p>

        {/* Subjects */}
        <div className="mb-4">
          <h4 className="text-xs uppercase text-primary font-semibold mb-2 flex items-center gap-1">
            <BookOpen size={12} />
            Subjects Covered
          </h4>
          <div className="flex flex-wrap gap-2">
            {subjects && subjects.map((subject, index) => (
              <span key={index} className="px-3 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full border border-secondary/20">
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-4 border-t border-border">
          {comingSoon ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg cursor-not-allowed">
              <Clock size={18} />
              <span className="text-sm">Enroll Soon</span>
            </div>
          ) : (
            <>
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground rounded-lg transition-all duration-300"
                >
                  <Github size={18} />
                  <span className="text-sm">Resources</span>
                </a>
              )}
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-300"
                >
                  <ExternalLink size={18} />
                  <span className="text-sm">Enroll</span>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
