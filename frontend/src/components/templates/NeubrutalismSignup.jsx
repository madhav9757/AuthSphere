import React, { useState } from "react";
import { Mail, Lock, User, Github, Twitter, ArrowRight } from "lucide-react";

export const NeubrutalismSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    /* The outer container uses w-full and h-full to occupy the entire viewport space provided by the parent */
    <div className="h-full w-full flex items-center justify-center bg-yellow-300 p-[5%] font-sans">
      {/* Main Wrapper: Uses a percentage max-width for desktop readability */}
      <div className="w-full max-w-[95%] md:max-w-[50%] lg:max-w-[35%] flex flex-col">
        {/* Header Section */}
        <div className="mb-[8%]">
          <div className="inline-block bg-black text-yellow-300 px-[6%] py-[3%] font-black text-[1.5rem] border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-[4%]">
            SIGN UP
          </div>
          <p className="text-black font-bold text-[1.1rem]">
            Join the revolution. <br />
            No BS, just pure functionality.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-[10%] flex flex-col gap-[5%]">
          {/* Social Buttons Grid */}
          <div className="grid grid-cols-2 gap-[5%]">
            <button className="bg-black text-white border-[3px] border-black py-[12%] font-bold hover:bg-white hover:text-black transition-all active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-[8%] text-[0.8rem]">
              <Github className="w-[1.2rem] h-[1.2rem]" />
              GITHUB
            </button>
            <button className="bg-cyan-400 text-black border-[3px] border-black py-[12%] font-bold hover:bg-white transition-all active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-[8%] text-[0.8rem]">
              <Twitter className="w-[1.2rem] h-[1.2rem]" />
              TWITTER
            </button>
          </div>

          {/* Fluid Divider */}
          <div className="relative py-[4%]">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-[3px] border-black border-dashed"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-[5%] text-black font-bold text-[0.75rem]">
                OR
              </span>
            </div>
          </div>

          {/* Input Fields */}
          <div className="flex flex-col gap-[4%]">
            {["name", "email", "password"].map((field) => (
              <div key={field}>
                <label className="block text-[0.75rem] font-black text-black mb-[2%] uppercase">
                  {field === "name" ? "Your Name" : field}
                </label>
                <div className="relative">
                  {field === "name" && (
                    <User className="absolute left-[4%] top-1/2 -translate-y-1/2 w-[1.2rem] h-[1.2rem]" />
                  )}
                  {field === "email" && (
                    <Mail className="absolute left-[4%] top-1/2 -translate-y-1/2 w-[1.2rem] h-[1.2rem]" />
                  )}
                  {field === "password" && (
                    <Lock className="absolute left-[4%] top-1/2 -translate-y-1/2 w-[1.2rem] h-[1.2rem]" />
                  )}

                  <input
                    type={field === "password" ? "password" : "text"}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    placeholder={
                      field === "password" ? "••••••••" : `Enter ${field}`
                    }
                    className="w-full pl-[15%] pr-[5%] py-[5%] border-[3px] border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Checkbox Section */}
          <div className="flex items-start gap-[5%] mt-[2%]">
            <input
              type="checkbox"
              id="terms"
              className="mt-[1%] h-[1.2rem] w-[1.2rem] border-[3px] border-black focus:ring-0 text-black cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-[0.8rem] font-bold text-black leading-tight"
            >
              I agree to the{" "}
              <span className="underline decoration-[2px] decoration-pink-400">
                Terms
              </span>{" "}
              and{" "}
              <span className="underline decoration-[2px] decoration-cyan-400">
                Privacy
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-pink-400 text-black border-[4px] border-black py-[6%] font-black text-[1.1rem] hover:bg-yellow-300 transition-all active:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-[4%] group uppercase mt-[4%]">
            Create Account
            <ArrowRight className="w-[1.4rem] h-[1.4rem] group-hover:translate-x-[20%] transition-transform" />
          </button>

          {/* Footer Link */}
          <p className="text-center text-[0.8rem] font-bold text-black pt-[2%]">
            Already a member?{" "}
            <a
              href="#"
              className="underline decoration-[3px] decoration-cyan-400 hover:decoration-pink-400"
            >
              SIGN IN
            </a>
          </p>
        </div>

        {/* Bottom Notification */}
        <div className="mt-[8%] bg-black text-yellow-300 border-[4px] border-black p-[5%] font-bold text-[0.8rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
          ⚡ Join 10,000+ developers building the future
        </div>
      </div>
    </div>
  );
};
