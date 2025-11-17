import { MdHistoryEdu, MdTrackChanges } from "react-icons/md";

const About = () => {
  return (
    <section className="pt-24">
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-16">
          <h2 className="h2">Founded with a passion for excellence</h2>
          <div className="flex flex-col gap-12">
            <div>
              <div className="text-primary flex items-center gap-2 mb-4">
                <MdHistoryEdu className="text-2xl" />
                <h6 className="h6">Our Story</h6>
              </div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis accusantium at corporis exercitationem odio aliquid
                dicta ea consectetur, excepturi quis veniam est, dolores dolorum
                dolorem commodi laborum. Suscipit, officiis quibusdam!
              </p>
            </div>
            <div>
              <div className="text-primary flex items-center gap-2 mb-4">
                <MdTrackChanges className="text-2xl" />
                <h6 className="h6">Our Story</h6>
              </div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis accusantium at corporis exercitationem odio aliquid
                dicta ea consectetur, excepturi quis veniam est, dolores dolorum
                dolorem commodi laborum. Suscipit, officiis quibusdam!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
