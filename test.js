import React, { useState, useMemo } from "react";

export default function MasterProfileUI() {
  const [step, setStep] = useState("welcome");
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    experienceYears: "",
    services: {},
    prices: {},
    photo: null,
    certificate: null,
  });

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const [clients, setClients] = useState([
    { id: 1, name: "Анна", phone: "+7 912 345-67-89", services: ["маникюр/покрытие"], visits: 3, discount: 0, blocked: false },
    { id: 2, name: "Марина", phone: "+7 999 123-45-67", services: ["брови/коррекция"], visits: 1, discount: 0, blocked: false },
  ]);

  const [reviews] = useState([
    { id: 1, author: "Елена", stars: 5, text: "Отлично! Очень аккуратно и быстро.", date: "2025-11-01" },
    { id: 2, author: "Мария", stars: 4, text: "Все понравилось, но хотелось бы больше цветов лаков.", date: "2025-10-28" }
  ]);
  const [showReviews, setShowReviews] = useState(false);

  const servicesCatalog = useMemo(() => ({
    "маникюр": ["аппаратный", "комбинированный", "покрытие", "наращивание"],
    "брови": ["коррекция", "ламинирование"],
    "ресницы": ["окрашивание", "ламинирование"],
  }), []);

  // settings catalog (for adding new services in settings)
  const settingsCatalog = useMemo(() => ({
    "маникюр": ["укрепление гелем", "архитектура ногтей"],
    "брови": ["окрашивание", "уход"],
    "ресницы": ["окрашивание", "ламинирование"],
  }), []);

  // calendar sample data
  const [calendarData, setCalendarData] = useState({
    "2025-11-05": ["archived"],
    "2025-11-06": ["active"],
    "2025-11-07": ["cancelled"],
  });

  const [appointments, setAppointments] = useState({
    "2025-11-05": [ { id: 1, client: "Мария", services: ["маникюр/аппаратный"], time: "10:00", status: "archived" } ],
    "2025-11-06": [ { id: 2, client: "Анна", services: ["маникюр/покрытие"], time: "11:00", status: "active" }, { id: 4, client: "Ирина", services: ["брови/коррекция"], time: "12:00", status: "cancelled" } ],
    "2025-11-07": [ { id: 3, client: "Ольга", services: ["брови/коррекция"], time: "15:00", status: "cancelled" } ],
  });

  const goNext = to => setStep(to);
  const goPrev = to => setStep(to);

  const toggleService = (cat, sub) => {
    setProfile(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next.services[cat]) next.services[cat] = {};
      next.services[cat][sub] = !next.services[cat][sub];
      return next;
    });
  };

  const selectedServicesList = useMemo(() => {
    const list = [];
    for (const cat of Object.keys(profile.services)) {
      for (const sub of Object.keys(profile.services[cat] || {})) {
        if (profile.services[cat][sub]) list.push(`${cat}/${sub}`);
      }
    }
    return list;
  }, [profile.services]);

  const setPriceFor = (key, value) => {
    setProfile(p => ({ ...p, prices: { ...p.prices, [key]: value } }));
  };

  const Container = ({ children }) => (
    <div className="min-h-screen bg-[#e8f0fc] p-4 sm:p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6">
        {children}
      </div>
    </div>
  );

  // helpers for calendar
  const months = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
  const weekdays = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

  // pick one appointment per day (priority active > archived > cancelled)
  const pickOneAppointment = list => {
    if (!list || list.length === 0) return null;
    return list.find(a => a.status === "active") || list.find(a => a.status === "archived") || list[0];
  };
