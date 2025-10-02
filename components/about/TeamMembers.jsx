export default function TeamMembers() {
  return (
    <div className="w-9/10 md:grid-cols-2 mx-auto grid justify-center gap-15 py-20">
      <div className="grid justify-center gap-2">
        <img src="/teammembers/about-1-free-img.jpg" alt="teammember1"/>
        <div className="flex justify-center">
          <h3 className="after:content-['-'] after:mx-1">Andison Harrison</h3>
          <h3> CMO</h3>
        </div>
      </div>
      <div className="grid justify-center gap-2">
        <img src="/teammembers/about-2-free-img.jpg" alt="teammember1" />
        <div className="flex justify-center ">
          <h3 className="after:content-['-'] after:mx-1">Leader Two</h3>
          <h3>Founder & CEO</h3>
        </div>
      </div>
    </div>
  );
}
