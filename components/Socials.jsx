import Link from "next/link";
import { RiFacebookFill, RiInstagramFill, RiYoutubeFill } from "react-icons/ri";

const socialsData = [
  {
    icon: <RiFacebookFill />,
    path: "https://www.facebook.com/profimachining",
  },
  {
    icon: <RiInstagramFill />,
    path: "https://www.instagram.com/profimachining/",
  },
  {
    icon: <RiYoutubeFill />,
    path: "https://www.youtube.com/@Profimachining",
  },
];

const Socials = ({ containerStyles, iconStyles }) => {
  return (
    <div className={`${containerStyles}`}>
      {socialsData.map((item, index) => {
        return (
          <Link
            key={index}
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconStyles}`}
          >
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default Socials;
