import projectData from "./data.json";
import ProjectBoxes from './ProjectBoxes';

export default function Projects(){
    return(
        <section className="w-full px-8 py-20 bg-gradient-to-b from-background to-muted/50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-foreground mb-4">Featured Courses</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Discover comprehensive courses designed specifically for Cameroonian secondary and high school students. Excel in your studies with interactive lessons, practice exams, and expert guidance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectData.map((project) => (
                        <ProjectBoxes
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            description={project.description}
                            image={project.image}
                            subjects={project.subjects}
                            liveLink={project.liveLink}
                            githubLink={project.githubLink}
                            features={project.features}
                            comingSoon={project.comingSoon}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}