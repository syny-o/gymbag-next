import Image from "next/image";

import {
  Ri24HoursLine,
  RiPhoneCameraLine,
  RiLuggageDepositLine,
  Ri4kLine,
} from "react-icons/ri";

const services = [
  {
    icon: <Ri24HoursLine />,
    title: "UI UX Design",
    description: "Designing compelling engaging user experiences.",
  },
  {
    icon: <Ri4kLine />,
    title: "Web Development",
    description: "Developing robust, scalable websites for all devices.",
  },
  {
    icon: <RiLuggageDepositLine />,
    title: "E-commerce Solutions",
    description: "Building secure, user-friendly online stores to drive sales.",
  },
  {
    icon: <RiPhoneCameraLine />,
    title: "Care & Support",
    description: "Providing updates, security and support for performance",
  },
];

const Services = () => {
  return (
    <section className="relative z-40">
      <div className="container mx-auto">
        <ul className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[20px] -top-12 place-items-center lg:place-items-stretch">
          {services.map((service, index) => {
            return (
              <li
                key={index}
                className="bg-grey-100 shadow-custom p-6 max-w-[350px] md:max-w-none rounded-lg"
              >
                <span className="text-3xl text-accent">{service.icon}</span>
                <h3 className="text-[20px] text-primary font-semibold mb-3">
                  {service.title}
                </h3>
                <p className="text-[15px]">{service.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Services;
