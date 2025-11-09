"use client";

import { useTranslations } from "next-intl";
import Confetti from "react-confetti";
import { useWindowSize } from "usehooks-ts";

export default function Congratulation() {
  const { width, height } = useWindowSize();
  const t = useTranslations("congratulations");

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[var(--blue)] via-[var(--purple)] to-[var(--pink)] mt-[114px]">
      {/* Confetti */}
      <Confetti 
        width={width}
        height={height}
      />

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" 
             style={{ backgroundColor: 'var(--yellow)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" 
             style={{ backgroundColor: 'var(--purple)' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" 
             style={{ backgroundColor: 'var(--pink)' }} />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Trophy SVG */}
            <div className="flex justify-center lg:justify-end order-2 lg:order-1">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse" 
                     style={{ 
                       background: `linear-gradient(to bottom right, var(--accent), var(--yellow))` 
                     }} />
                <svg
                  className="relative w-full h-auto drop-shadow-2xl animate-float"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Trophy Base */}
                  <rect
                    x="70"
                    y="160"
                    width="60"
                    height="30"
                    rx="4"
                    fill="#D97706"
                  />
                  <rect
                    x="60"
                    y="150"
                    width="80"
                    height="15"
                    rx="4"
                    fill="#F59E0B"
                  />

                  {/* Trophy Stem */}
                  <rect x="85" y="130" width="30" height="25" fill="#FBBF24" />

                  {/* Trophy Cup */}
                  <path
                    d="M50 50 L50 80 Q50 110 70 120 L130 120 Q150 110 150 80 L150 50 Z"
                    fill="url(#goldGradient)"
                  />

                  {/* Cup Handles */}
                  <path
                    d="M50 60 Q30 60 30 80 Q30 95 40 95 L50 95"
                    fill="#F59E0B"
                  />
                  <path
                    d="M150 60 Q170 60 170 80 Q170 95 160 95 L150 95"
                    fill="#F59E0B"
                  />

                  {/* Cup Rim */}
                  <ellipse cx="100" cy="50" rx="50" ry="8" fill="#FCD34D" />

                  {/* Shine Effect */}
                  <path
                    d="M70 60 Q80 70 70 85 L75 85 Q85 70 75 60 Z"
                    fill="white"
                    opacity="0.4"
                  />

                  {/* Stars */}
                  <g>
                    <path
                      d="M100 20 L103 28 L112 28 L105 33 L108 42 L100 36 L92 42 L95 33 L88 28 L97 28 Z"
                      fill="#FCD34D"
                      className="animate-twinkle"
                    />
                    <path
                      d="M140 35 L141 38 L144 38 L142 40 L143 43 L140 41 L137 43 L138 40 L136 38 L139 38 Z"
                      fill="#FCD34D"
                      className="animate-twinkle animation-delay-1000"
                    />
                    <path
                      d="M60 35 L61 38 L64 38 L62 40 L63 43 L60 41 L57 43 L58 40 L56 38 L59 38 Z"
                      fill="#FCD34D"
                      className="animate-twinkle animation-delay-2000"
                    />
                  </g>

                  {/* Gradients */}
                  <defs>
                    <linearGradient
                      id="goldGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="50%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Right Side - Content Card */}
            <div className="order-1 lg:order-2 w-5/6 mx-auto">
              <div className="bg-success-foreground backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 border-2 border-[var(--muted-foreground)] transform hover:scale-[1.02] transition-all duration-300">
                {/* Emoji Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--yellow)] to-[var(--orange)] rounded-2xl mb-6 shadow-lg">
                  <span className="text-3xl">🎉</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] mb-4 leading-tight">
                  {t("congratulations")}
                </h1>

                <h2 className="text-xl md:text-2xl font-semibold text--accent-foreground mb-6">
                  {t("courseCompleted")}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {t("description")}
                </p>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="rounded-xl p-4 text-center border">
                    <div className="text-3xl font-bold text-secondary">
                      100%
                    </div>
                    <div className="text-xs text-secondary mt-1 font-medium">
                      {t("complete")}
                    </div>
                  </div>
                  <div className="rounded-xl p-4 text-center border">
                    <div className="text-3xl font-bold text-ring">A+</div>
                    <div className="text-xs text-ring mt-1 font-medium">
                      {t("grade")}
                    </div>
                  </div>
                  <div className="rounded-xl p-4 text-center border ">
                    <div className="text-3xl text-deep">🏆</div>
                    <div className="text-xs text-deep mt-1 font-medium">
                      {t("excellence")}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid gap-4">
                  <button className="flex-1 bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] hover:from-[var(--purple)] hover:to-[var(--pink)] text-primary font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 hover:shadow-xl">
                    {t("downloadCertificate")}
                  </button>
                  <button className="flex-1 bg-[var(--primary)] text-secondary font-bold py-4 px-6 rounded-xl border-2 transform hover:scale-105 transition-all duration-200">
                    {t("backToDashboard")}
                  </button>
                </div>

                {/* Share Section */}
                <div className="mt-8 pt-6 border-t border-primary-foreground">
                  <p className="text-sm text-primary text-center mb-3">
                    {t("shareAchievement")}
                  </p>
                  <div className="flex justify-center gap-3">
                    <button className="w-10 h-10 bg-blue hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors">
                      <span className="text-lg">📘</span>
                    </button>
                    <button className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors">
                      <span className="text-lg">🐦</span>
                    </button>
                    <button className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors">
                      <span className="text-lg">💼</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}