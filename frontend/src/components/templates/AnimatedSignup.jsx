import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Asterisk } from "lucide-react";

export const UniqueMinimalSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <div className="h-full w-full flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      {/* Left Side: Dynamic Visual Zone (40% width on Desktop) */}
      <div className="h-[30%] lg:h-full lg:w-[40%] bg-black relative flex items-center justify-center p-[5%] overflow-hidden">
        {/* Abstract Shape: A simple rotating percentage-based element */}
        <div className="absolute w-[60%] h-[60%] border-[1px] border-white/20 rounded-full animate-spin [animation-duration:20s]"></div>
        <div className="absolute w-[40%] h-[40%] border-[1px] border-white/40 rounded-full animate-spin [animation-duration:10s] direction-reverse"></div>

        <div className="relative z-10 text-center lg:text-left">
          <Asterisk className="text-yellow-400 w-[3rem] h-[3rem] mb-[5%] animate-pulse mx-auto lg:mx-0" />
          <h1 className="text-white text-[2.5rem] lg:text-[4rem] font-light leading-tight tracking-tighter">
            START <br />
            <span className="font-serif italic text-yellow-400">
              Something
            </span>{" "}
            <br />
            NEW.
          </h1>
        </div>

        {/* Bottom percentage-based label */}
        <div className="absolute bottom-[5%] left-[5%] text-white/30 text-[0.7rem] uppercase tracking-[0.5rem] hidden lg:block">
          © Edition 2026
        </div>
      </div>

      {/* Right Side: The Form (60% width on Desktop) */}
      <div className="h-[70%] lg:h-full lg:w-[60%] flex items-center justify-center p-[8%] bg-gray-50">
        <div className="w-full max-w-[90%] md:max-w-[70%] lg:max-w-[60%] space-y-[8%]">
          <div className="space-y-[2%]">
            <h2 className="text-[1.5rem] font-bold text-black uppercase tracking-widest">
              Create Account
            </h2>
            <div className="h-[2px] w-[10%] bg-black"></div>
          </div>

          <div className="space-y-[6%]">
            {/* Fluid Input Groups */}
            {[
              {
                id: "name",
                label: "Identity",
                icon: User,
                placeholder: "Your Name",
              },
              {
                id: "email",
                label: "Contact",
                icon: Mail,
                placeholder: "Email Address",
              },
              {
                id: "password",
                label: "Security",
                icon: Lock,
                placeholder: "Password",
              },
            ].map((field) => (
              <div
                key={field.id}
                className="group relative border-b-[1px] border-black/10 focus-within:border-black transition-colors pb-[2%]"
              >
                <label className="block text-[0.6rem] uppercase tracking-widest text-gray-400 mb-[1%] group-focus-within:text-black transition-colors">
                  {field.label}
                </label>
                <div className="flex items-center">
                  <input
                    type={field.id === "password" ? "password" : "text"}
                    placeholder={field.placeholder}
                    className="w-full bg-transparent border-none outline-none text-[1.1rem] py-[1%] placeholder:text-gray-200"
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                  />
                  <field.icon className="w-[1.2rem] h-[1.2rem] text-gray-300 group-focus-within:text-black transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Simple Action Area */}
          <div className="flex flex-col sm:flex-row items-center gap-[5%] pt-[4%]">
            <button className="w-full sm:w-[60%] bg-black text-white py-[4%] lg:py-[3%] group flex items-center justify-center gap-[5%] hover:bg-yellow-400 hover:text-black transition-all duration-500">
              <span className="uppercase font-bold tracking-widest text-[0.9rem]">
                Join Now
              </span>
              <ArrowRight className="w-[1rem] h-[1rem] group-hover:translate-x-[50%] transition-transform" />
            </button>

            <a
              href="#"
              className="text-[0.7rem] uppercase tracking-widest text-gray-400 hover:text-black transition-colors mt-[4%] sm:mt-0"
            >
              I have an account
            </a>
          </div>

          {/* Minimal Footer */}
          <p className="text-[0.65rem] text-gray-400 leading-relaxed max-w-[80%]">
            By joining, you agree to our minimal terms. We promise not to
            clutter your inbox or your headspace.
          </p>
        </div>
      </div>
    </div>
  );
};
