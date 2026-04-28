import { Github, ExternalLink } from "lucide-react";

export default function ProjectBoxes({ id, name, description, image, tech, liveLink, githubLink, features }) {
  return (
    <div className="bg-muted-foreground backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden hover:border-white/40 transition-all duration-300 hover:scale-105">
      {/* Image Section */}
      <div className="w-full h-48 overflow-hidden bg-black/60">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-3">{name}</h2>
        
        <p className="text-white/80 text-sm mb-4 line-clamp-3">{description}</p>

        {/* Tech Stack */}
        <div className="mb-4">
          <h4 className="text-xs uppercase text-lime-300 font-semibold mb-2">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {tech && tech.map((t, index) => (
              <span key={index} className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          {githubLink && (
            <a 
              href={githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
            >
              <Github size={18} />
              <span className="text-sm">Code</span>
            </a>
          )}
          {liveLink && (
            <a 
              href={liveLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-lime-300/20 hover:bg-lime-300/30 text-lime-300 rounded-lg transition-all duration-300"
            >
              <ExternalLink size={18} />
              <span className="text-sm">Live</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
