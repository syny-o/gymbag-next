"use client"
import Image from "next/image";
import Link from "next/link";

import {
  RiMapPin2Fill,
  RiPhoneFill,
  RiMailFill,
  RiArrowRightLine,
} from "react-icons/ri";

import Socials from "./Socials";

import { motion } from "framer-motion";

import Logo from "./Logo";

const Footer = () => {
  return (
    <motion.footer
      // variants={fadeIn("up", 0.1)}
      // initial="hidden"
      // whileInView="show"
      // viewport={{ once: false, amount: 0.1 }}
      className=" bg-primary"
    >
      <div className="container mx-auto">
        <div className="py-8 xl:py-[80px] flex flex-col xl:flex-row gap-[60px] xl:gap-[30px] items-center">
          {/* logo & text */}
          <div className="flex-1 text-center xl:text-left">

              <Logo />
            {/* <p className="text-white max-w-[270px]">
              Jsme dynamická firma, která se neustále vyvíjí a adaptuje. Naším
              hlavním zaměřením je poskytování operativních a efektivních řešení
              ve výrobních a montážních procesech.
            </p> */}
          </div>
          {/* contact */}
          <div className="flex-1 text-white text-center xl:text-left">
            {/* <h4 className="h4 text-white mb-10">Kontakt</h4> */}
            <ul className="flex flex-col gap-6 items-center xl:items-start">
              <li className="flex items-center gap-4">
                <RiMapPin2Fill className="text-accent text-xl" />
                <p>Větrná 1919/20A 46601 Jablonec n/N</p>
              </li>
              <li className="flex items-center gap-4">
                <RiPhoneFill className="text-accent text-xl" />
                <p>+420 724 777 078</p>
              </li>
              <li className="flex items-center gap-4">
                <RiMailFill className="text-accent text-xl" />
                <p>info@profimachining.eu</p>
              </li>
            </ul>
          </div>
          {/* mapa sídla */}
          <div className="flex-1 text-white text-center xl:text-left">
            {/* <h4 className="h4 text-white mb-10">Kde nás najdete</h4> */}

            <div className="overflow-hidden shadow-lg border border-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2525.567113130459!2d15.161647393742845!3d50.727969694242624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470ecad39cb0af17%3A0x719eea92018d4bff!2sV%C4%9Btrn%C3%A1%201919%2F20A%2C%20466%2001%20Jablonec%20nad%20Nisou%201!5e0!3m2!1scs!2scz!4v1761576313403!5m2!1scs!2scz"
                width="100%"
                height="200"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[200px] border-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      {/* copyright */}
      <div className="container mx-auto xl:px-0 py-6 border-t border-border/10 flex flex-col gap-6 xl:flex-row items-center justify-between">
        <p className="text-white">
          Copyright &copy; 2025 Profi Machining s.r.o.
        </p>
        <Socials
          containerStyles="flex gap-6 text-white"
          iconStyles="hover:text-accent transition-all"
        />
      </div>
      
    </motion.footer>
  );
};

export default Footer;
