import React, { useState } from "react";
import { User, Mail, Lock, Building, Check, ArrowRight, ArrowLeft } from "lucide-react";

export const StepperSignup = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        role: "",
        password: "",
        confirmPassword: "",
    });

    const steps = [
        { id: 0, title: "Personal Info", icon: User },
        { id: 1, title: "Company Details", icon: Building },
        { id: 2, title: "Security", icon: Lock },
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-[700px] w-full flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
                    <p className="text-gray-600">Complete the steps below to create your account</p>
                </div>

                {/* Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                            <div
                                className="h-full bg-indigo-600 transition-all duration-500"
                                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                            />
                        </div>

                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = index < currentStep;
                            const isCurrent = index === currentStep;

                            return (
                                <div key={step.id} className="flex flex-col items-center relative">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isCompleted
                                                ? "bg-indigo-600 text-white"
                                                : isCurrent
                                                ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                                                : "bg-white border-2 border-gray-200 text-gray-400"
                                        }`}
                                    >
                                        {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                    </div>
                                    <span
                                        className={`mt-2 text-xs font-medium ${
                                            isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                                        }`}
                                    >
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Step 0: Personal Info */}
                    {currentStep === 0 && (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 1: Company Details */}
                    {currentStep === 1 && (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Acme Inc."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select your role</option>
                                    <option value="developer">Developer</option>
                                    <option value="designer">Designer</option>
                                    <option value="manager">Product Manager</option>
                                    <option value="founder">Founder/CEO</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Security */}
                    {currentStep === 2 && (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Create a strong password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Re-enter your password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                                <p className="text-sm text-indigo-900 font-medium mb-2">Password Requirements:</p>
                                <ul className="text-xs text-indigo-700 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-3 w-3" /> At least 8 characters
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-3 w-3" /> One uppercase letter
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-3 w-3" /> One number or special character
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 mt-8">
                        {currentStep > 0 && (
                            <button
                                onClick={prevStep}
                                className="flex-1 px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                Back
                            </button>
                        )}
                        <button
                            onClick={currentStep === steps.length - 1 ? () => alert("Form submitted!") : nextStep}
                            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 group"
                        >
                            {currentStep === steps.length - 1 ? "Create Account" : "Continue"}
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};
