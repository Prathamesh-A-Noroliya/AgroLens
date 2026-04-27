import i18n from "i18next";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
      setCurrentLang(savedLang);
    }
  }, []);

  const buttonClass = (lang: string) =>
    `px-3 py-1 rounded text-sm font-medium transition ${
      currentLang === lang
        ? "bg-primary text-white"
        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
    }`;

  return (
    <div className="flex gap-2">
      <button onClick={() => changeLanguage("en")} className={buttonClass("en")}>
        EN
      </button>

      <button onClick={() => changeLanguage("hi")} className={buttonClass("hi")}>
        HI
      </button>

      <button onClick={() => changeLanguage("mr")} className={buttonClass("mr")}>
        MR
      </button>
    </div>
  );
}