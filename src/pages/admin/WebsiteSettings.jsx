import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";

export const defaultWebsiteSettings = {
  businessName: "CHAFADIA ENTERPRISE",
  slogan: "Beauty • Wellness • Fashion • Halal Drinks",
  tagline: "Premium products for beauty, wellness, fashion, snacks and family care.",

  email: "chafadiaenterprise@gmail.com",
  phone: "+237 652 433 338",
  whatsapp: "+237 688 332 699",
  supportPhone: "+237 6 52 43 33 33",
  paymentPhone: "+237 6 88 33 26 99",
  address: "Nkolmesseng, Yaoundé, Cameroon",
  city: "Yaoundé",
  country: "Cameroon",
  businessHours: "Monday - Saturday: 8:00 AM - 5:00 PM",

  contactHeroLabel: "Customer Care & Business Support",
  contactTitle: "Contact Chafadia Enterprise",
  contactIntro:
    "We are here for orders, product inquiries, partnerships, customer care, payment confirmation and support. Your message matters to us, and we are always happy to help.",

  receiptFooter:
    "Thank you for shopping with Chafadia Enterprise. We appreciate your trust.",

  aboutHeroLabel: "Our Brand • Our Story • Our Promise",
  aboutTitle: "About CHAFADIA ENTERPRISE",
  aboutText:
    "Chafadia Enterprise is a premium multi-division brand created to serve homes, families, women, students, professionals and communities through beauty, wellness, halal drinks, snacks, cleaning products and trusted everyday essentials. We are built on quality, dignity, purpose and customer happiness.",
  aboutStoryTitle: "A Brand Built on Love, Faith and Purpose",
  aboutStory:
    "CHAFADIA ENTERPRISE is a purpose-driven global brand founded on excellence, integrity and innovation. Our mission is to create premium products that inspire confidence, promote healthier lifestyles and enrich everyday living. With an unwavering commitment to quality, customer satisfaction and continuous improvement, we strive to build lasting relationships and deliver exceptional value to individuals, families and businesses around the world.",
  aboutLegacy:
    "The memory of my beloved late husband, Chafiou Hamidou, remains a source of strength and inspiration. His kindness, sacrifice, patience, support and beautiful soul continue to live in my heart and motivate this journey every day.",
  aboutMission:
    "To provide trusted, affordable and high-quality products that support beauty, wellness, refreshment, modest living, hygiene, clean homes and everyday family care with professionalism, elegance and love.",
  aboutVision:
    "To become a recognized enterprise known for excellence, creativity, customer satisfaction, premium branding, worldwide delivery and products that bring real value to communities.",
  aboutRepresent:
    "We represent resilience, faith, elegance, service, honest business, customer care and the belief that a brand can carry both quality products and a meaningful legacy.",

  chafadiaSolutionsIntro:
    "Beyond CHAFADIA ENTERPRISE products, CHAFADIA SOLUTIONS is our professional service and development wing created to support individuals, businesses, women, girls, families and communities through technology, design, cybersecurity, education, writing and empowerment.",
  chafadiaSolutionsNote:
    "A modern portfolio of creative, digital, business and community-focused services built with professionalism, purpose and excellence.",

  websiteStatus: "Open",
  maintenanceMessage:
    "Our website is currently under maintenance. Please check back soon.",

  currency: "FCFA",
  language: "English",
  deliveryFee: 1000,
  freeDeliveryFrom: 25000,

  primaryColor: "#004aad",
  goldColor: "#d4af37",
  darkBlue: "#001f4d",
  backgroundColor: "#f6f8ff",

  showPromotions: true,
  allowOrders: true,
  allowSignup: true,
  allowGoogleLogin: true,
  allowCashPayment: true,
  allowMobileMoney: true,
  allowBankTransfer: true,
  showBusinessContact: true,
  showSocialLinks: true,

  facebook: "",
  instagram: "",
  tiktok: "",
  website: "",
};

export function getWebsiteSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem("websiteSettings"));
    return {
      ...defaultWebsiteSettings,
      ...(saved || {}),
    };
  } catch {
    return defaultWebsiteSettings;
  }
}

function WebsiteSettings() {
  const [activeTab, setActiveTab] = useState("Business");

  const [settings, setSettings] = useState(() => ({
    ...defaultWebsiteSettings,
    ...getWebsiteSettings(),
  }));

  const [savedMessage, setSavedMessage] = useState("");

  const completion = useMemo(() => {
    const importantFields = [
      "businessName",
      "slogan",
      "tagline",
      "email",
      "phone",
      "whatsapp",
      "supportPhone",
      "paymentPhone",
      "address",
      "city",
      "country",
      "aboutText",
      "aboutMission",
      "aboutVision",
      "contactIntro",
      "receiptFooter",
    ];

    const completed = importantFields.filter((field) =>
      String(settings[field] || "").trim()
    ).length;

    return Math.round((completed / importantFields.length) * 100);
  }, [settings]);

  useEffect(() => {
    applySettingsToDocument(settings);
  }, [settings]);

  const applySettingsToDocument = (currentSettings) => {
    document.documentElement.style.setProperty(
      "--blue",
      currentSettings.primaryColor
    );
    document.documentElement.style.setProperty(
      "--gold",
      currentSettings.goldColor
    );
    document.documentElement.style.setProperty(
      "--dark-blue",
      currentSettings.darkBlue
    );
    document.documentElement.style.setProperty(
      "--page-bg",
      currentSettings.backgroundColor
    );

    document.title = currentSettings.businessName || "Chafadia Enterprise";
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSetting = (field) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const saveSettings = () => {
    const cleanSettings = {
      ...settings,
      deliveryFee: Number(settings.deliveryFee || 0),
      freeDeliveryFrom: Number(settings.freeDeliveryFrom || 0),
    };

    localStorage.setItem("websiteSettings", JSON.stringify(cleanSettings));

    window.dispatchEvent(
      new CustomEvent("websiteSettingsUpdated", {
        detail: cleanSettings,
      })
    );

    applySettingsToDocument(cleanSettings);

    setSavedMessage(
      "Website settings saved successfully. Contact details and About Us content are now ready for other pages."
    );

    setTimeout(() => {
      setSavedMessage("");
    }, 3000);
  };

  const resetSettings = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all website settings?"
    );

    if (!confirmReset) return;

    setSettings(defaultWebsiteSettings);
    localStorage.setItem(
      "websiteSettings",
      JSON.stringify(defaultWebsiteSettings)
    );

    window.dispatchEvent(
      new CustomEvent("websiteSettingsUpdated", {
        detail: defaultWebsiteSettings,
      })
    );

    applySettingsToDocument(defaultWebsiteSettings);

    setSavedMessage("Website settings reset successfully.");

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "chafadia-website-settings.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const tabs = [
    "Business",
    "About Us",
    "Contact",
    "Operations",
    "Branding",
    "Social",
    "Permissions",
    "Preview",
  ];

  const toggleItems = [
    {
      key: "showPromotions",
      title: "Show Promotions",
      desc: "Display discounts, special offers and campaigns.",
    },
    {
      key: "allowOrders",
      title: "Allow Orders",
      desc: "Customers can place orders from the website.",
    },
    {
      key: "allowSignup",
      title: "Allow Signup",
      desc: "New customers can create accounts.",
    },
    {
      key: "allowGoogleLogin",
      title: "Google Login",
      desc: "Customers can continue with Google.",
    },
    {
      key: "allowCashPayment",
      title: "Cash Payment",
      desc: "Allow customers to pay by cash.",
    },
    {
      key: "allowMobileMoney",
      title: "Mobile Money",
      desc: "Allow MTN MoMo and Orange Money.",
    },
    {
      key: "allowBankTransfer",
      title: "Bank Transfer",
      desc: "Allow bank transfer payments.",
    },
    {
      key: "showBusinessContact",
      title: "Show Contacts",
      desc: "Show phone, email and WhatsApp on public pages.",
    },
    {
      key: "showSocialLinks",
      title: "Show Social Links",
      desc: "Show Facebook, Instagram and TikTok links.",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="settings-page">
        <style>{`
          .settings-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.25), transparent 26%),
              radial-gradient(circle at 88% 14%, rgba(0, 74, 173, 0.16), transparent 28%),
              radial-gradient(circle at 90% 92%, rgba(212, 175, 55, 0.12), transparent 28%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 48%, #f6f8ff 100%);
          }

          .settings-container {
            max-width: 1280px;
            margin: 0 auto;
          }

          .settings-hero {
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 28px;
            padding: 36px;
            border-radius: 38px;
            background:
              linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,248,255,0.9));
            border: 1px solid rgba(212, 175, 55, 0.38);
            box-shadow:
              0 30px 80px rgba(0, 31, 77, 0.15),
              inset 0 1px 0 rgba(255,255,255,0.96);
            margin-bottom: 24px;
          }

          .settings-hero::before {
            content: "";
            position: absolute;
            width: 320px;
            height: 320px;
            right: -135px;
            top: -145px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.35), transparent 68%);
          }

          .settings-hero::after {
            content: "";
            position: absolute;
            width: 165px;
            height: 165px;
            left: -72px;
            bottom: -78px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0,74,173,0.2), transparent 70%);
          }

          .settings-hero-content {
            position: relative;
            z-index: 2;
          }

          .settings-label {
            display: inline-flex;
            padding: 8px 15px;
            border-radius: 999px;
            margin-bottom: 14px;
            background: rgba(212, 175, 55, 0.15);
            color: #001f4d;
            border: 1px solid rgba(212, 175, 55, 0.35);
            font-size: 12px;
            font-weight: 950;
            letter-spacing: 0.9px;
            text-transform: uppercase;
          }

          .settings-hero h1 {
            color: #001f4d;
            font-size: clamp(34px, 5vw, 58px);
            font-weight: 950;
            letter-spacing: -1.3px;
            margin-bottom: 10px;
          }

          .settings-hero h1 span {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .settings-hero p {
            color: #667085;
            max-width: 790px;
            line-height: 1.78;
            font-weight: 650;
            font-size: 15.5px;
          }

          .settings-hero-side {
            position: relative;
            z-index: 2;
            display: grid;
            gap: 13px;
            min-width: 210px;
          }

          .settings-status {
            padding: 13px 18px;
            border-radius: 999px;
            background:
              ${settings.websiteStatus === "Open"
                ? "linear-gradient(135deg, #dcfce7, #86efac)"
                : "linear-gradient(135deg, #fee2e2, #fca5a5)"};
            color:
              ${settings.websiteStatus === "Open" ? "#166534" : "#991b1b"};
            font-weight: 950;
            text-align: center;
            box-shadow: 0 14px 30px rgba(0,31,77,0.12);
          }

          .completion-box {
            padding: 16px;
            border-radius: 24px;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            box-shadow: 0 18px 40px rgba(0,31,77,0.2);
          }

          .completion-box strong {
            display: block;
            color: #d4af37;
            font-size: 30px;
            line-height: 1;
            margin-bottom: 7px;
          }

          .completion-box span {
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.7px;
          }

          .completion-track {
            height: 8px;
            border-radius: 999px;
            background: rgba(255,255,255,0.16);
            margin-top: 12px;
            overflow: hidden;
          }

          .completion-fill {
            height: 100%;
            width: ${completion}%;
            border-radius: 999px;
            background: linear-gradient(135deg, #fff7d6, #d4af37);
          }

          .settings-message {
            margin-bottom: 18px;
            padding: 15px 18px;
            border-radius: 18px;
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            color: #166534;
            font-weight: 900;
            border: 1px solid rgba(22,101,52,0.14);
            box-shadow: 0 12px 30px rgba(22,101,52,0.08);
          }

          .settings-layout {
            display: grid;
            grid-template-columns: 260px minmax(0, 1fr);
            gap: 22px;
            align-items: start;
          }

          .settings-sidebar {
            position: sticky;
            top: 92px;
            background: rgba(255,255,255,0.985);
            border-radius: 28px;
            padding: 16px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
          }

          .settings-tab {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 13px 14px;
            border: none;
            border-radius: 16px;
            margin-bottom: 8px;
            background: transparent;
            color: #001f4d;
            font-weight: 900;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .settings-tab:hover {
            background: #f8fbff;
            transform: translateX(2px);
          }

          .settings-tab.active {
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            box-shadow: 0 12px 24px rgba(0,31,77,0.18);
          }

          .settings-content {
            display: grid;
            gap: 22px;
          }

          .settings-card {
            background: rgba(255,255,255,0.985);
            border-radius: 28px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
            overflow: hidden;
          }

          .settings-card-head {
            padding: 22px;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.08), rgba(212,175,55,0.13));
            border-bottom: 1px solid rgba(0,74,173,0.08);
          }

          .settings-card-head h2 {
            color: #001f4d;
            font-size: 24px;
            margin-bottom: 7px;
          }

          .settings-card-head p {
            color: #667085;
            font-size: 13.5px;
            line-height: 1.65;
            font-weight: 650;
          }

          .settings-form {
            padding: 22px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .settings-form.single {
            grid-template-columns: 1fr;
          }

          .field-group {
            display: grid;
            gap: 7px;
          }

          .field-group.full {
            grid-column: 1 / -1;
          }

          .field-group label {
            color: #001f4d;
            font-weight: 950;
            font-size: 13px;
          }

          .field-group input,
          .field-group select,
          .field-group textarea {
            width: 100%;
            padding: 14px 15px;
            border-radius: 18px;
            border: 1px solid rgba(0,74,173,0.14);
            background: #fff;
            color: #001f4d;
            font-weight: 750;
            box-shadow: 0 10px 25px rgba(0,31,77,0.05);
            outline: none;
            transition: 0.28s ease;
          }

          .field-group input:focus,
          .field-group select:focus,
          .field-group textarea:focus {
            border-color: #d4af37;
            box-shadow: 0 0 0 4px rgba(212,175,55,0.14);
          }

          .field-group textarea {
            min-height: 110px;
            resize: vertical;
            font-family: inherit;
            line-height: 1.6;
          }

          .field-group textarea.large-textarea {
            min-height: 150px;
          }

          .hint {
            color: #667085;
            font-size: 11.5px;
            font-weight: 700;
            line-height: 1.5;
          }

          .color-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 70px;
            gap: 10px;
            align-items: center;
          }

          .color-row input[type="color"] {
            padding: 4px;
            height: 48px;
            cursor: pointer;
          }

          .editable-preview-panel {
            grid-column: 1 / -1;
            padding: 16px;
            border-radius: 22px;
            background:
              radial-gradient(circle at top right, rgba(212,175,55,0.16), transparent 34%),
              linear-gradient(135deg, #ffffff, #f8fbff);
            border: 1px solid rgba(212,175,55,0.2);
            box-shadow: 0 12px 28px rgba(0,31,77,0.06);
          }

          .editable-preview-panel h3 {
            color: #001f4d;
            font-size: 17px;
            font-weight: 950;
            margin-bottom: 8px;
          }

          .editable-preview-panel p {
            color: #667085;
            line-height: 1.65;
            font-size: 13px;
            font-weight: 680;
          }

          .toggle-grid {
            padding: 22px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 14px;
          }

          .toggle-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 16px;
            border-radius: 20px;
            background: #f8fbff;
            border: 1px solid rgba(0,74,173,0.08);
            transition: 0.3s ease;
          }

          .toggle-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 28px rgba(0,31,77,0.08);
          }

          .toggle-card h3 {
            color: #001f4d;
            font-size: 15px;
            margin-bottom: 4px;
          }

          .toggle-card p {
            color: #667085;
            font-size: 12px;
            line-height: 1.4;
            font-weight: 650;
          }

          .switch {
            width: 56px;
            height: 31px;
            border-radius: 999px;
            padding: 4px;
            border: none;
            background: #cbd5e1;
            cursor: pointer;
            transition: 0.3s ease;
            flex-shrink: 0;
          }

          .switch.active {
            background: linear-gradient(135deg, #004aad, #001f4d);
          }

          .switch span {
            display: block;
            width: 23px;
            height: 23px;
            border-radius: 50%;
            background: #fff;
            transition: 0.3s ease;
          }

          .switch.active span {
            transform: translateX(25px);
          }

          .preview-grid {
            padding: 22px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }

          .brand-preview {
            border-radius: 26px;
            overflow: hidden;
            border: 1px solid rgba(212,175,55,0.22);
            background: #fff;
            box-shadow: 0 16px 40px rgba(0,31,77,0.08);
          }

          .preview-top {
            padding: 24px;
            background:
              radial-gradient(circle at top right, rgba(212,175,55,0.28), transparent 38%),
              linear-gradient(135deg, ${settings.primaryColor}, ${settings.darkBlue});
            color: #fff;
          }

          .preview-top h3 {
            font-size: 25px;
            margin-bottom: 8px;
          }

          .preview-top p {
            color: #fff3c4;
            font-weight: 750;
            line-height: 1.5;
          }

          .preview-body {
            padding: 22px;
          }

          .preview-pill {
            display: inline-flex;
            padding: 10px 16px;
            border-radius: 999px;
            background: linear-gradient(135deg, #fff7d6, ${settings.goldColor});
            color: #001f4d;
            font-weight: 950;
            margin-bottom: 14px;
          }

          .preview-body p {
            color: #667085;
            line-height: 1.7;
            font-weight: 650;
          }

          .preview-info-list {
            display: grid;
            gap: 11px;
            margin-top: 16px;
          }

          .preview-info-list div {
            padding: 12px;
            border-radius: 15px;
            background: #f8fbff;
            color: #001f4d;
            font-weight: 850;
            border: 1px solid rgba(0,74,173,0.08);
          }

          .settings-actions {
            display: flex;
            justify-content: flex-end;
            flex-wrap: wrap;
            gap: 14px;
            margin-top: 24px;
          }

          .settings-actions button {
            padding: 13px 20px;
            border-radius: 999px;
            border: none;
            font-weight: 950;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .save-settings {
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            box-shadow: 0 14px 30px rgba(0,31,77,0.2);
          }

          .export-settings {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
            box-shadow: 0 14px 30px rgba(212,175,55,0.16);
          }

          .reset-settings {
            background: #fff;
            color: #dc2626;
            border: 1px solid rgba(220,38,38,0.18) !important;
          }

          .settings-actions button:hover {
            transform: translateY(-2px);
          }

          .integration-note {
            margin-top: 18px;
            padding: 16px;
            border-radius: 20px;
            background: #fff7d6;
            border: 1px solid rgba(212,175,55,0.25);
            color: #001f4d;
            line-height: 1.6;
            font-weight: 750;
          }

          .integration-note code {
            background: rgba(0,31,77,0.08);
            padding: 2px 6px;
            border-radius: 8px;
            font-weight: 950;
          }

          @media (max-width: 1000px) {
            .settings-hero {
              flex-direction: column;
              align-items: flex-start;
            }

            .settings-layout {
              grid-template-columns: 1fr;
            }

            .settings-sidebar {
              position: static;
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
              gap: 8px;
            }

            .settings-tab {
              margin-bottom: 0;
            }

            .preview-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 700px) {
            .settings-page {
              padding: 14px;
            }

            .settings-hero {
              padding: 22px 16px;
              border-radius: 26px;
            }

            .settings-card-head,
            .settings-form,
            .toggle-grid,
            .preview-grid {
              padding: 17px;
            }

            .settings-form {
              grid-template-columns: 1fr;
            }

            .settings-actions {
              flex-direction: column;
            }

            .settings-actions button {
              width: 100%;
            }
          }
        `}</style>

        <div className="settings-container">
          <div className="settings-hero">
            <div className="settings-hero-content">
              <span className="settings-label">Core Website Control</span>

              <h1>
                Website <span>Settings</span>
              </h1>

              <p>
                Edit business identity, About Us, contact details, location,
                colors, delivery rules, payment options, social links and public
                brand information from one central admin control panel.
              </p>
            </div>

            <div className="settings-hero-side">
              <div className="settings-status">
                Website: {settings.websiteStatus}
              </div>

              <div className="completion-box">
                <strong>{completion}%</strong>
                <span>Profile Complete</span>
                <div className="completion-track">
                  <div className="completion-fill"></div>
                </div>
              </div>
            </div>
          </div>

          {savedMessage && (
            <div className="settings-message">{savedMessage}</div>
          )}

          <div className="settings-layout">
            <div className="settings-sidebar">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={
                    activeTab === tab ? "settings-tab active" : "settings-tab"
                  }
                  onClick={() => setActiveTab(tab)}
                >
                  <span>{tab}</span>
                  <span>›</span>
                </button>
              ))}
            </div>

            <div className="settings-content">
              {activeTab === "Business" && (
                <div className="settings-card">
                  <div className="settings-card-head">
                    <h2>Business Identity</h2>
                    <p>
                      These details can be used for the navbar, receipts,
                      reports, home page, about page and contact page.
                    </p>
                  </div>

                  <div className="settings-form">
                    <div className="field-group">
                      <label>Business Name</label>
                      <input
                        value={settings.businessName}
                        onChange={(e) =>
                          handleChange("businessName", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Slogan</label>
                      <input
                        value={settings.slogan}
                        onChange={(e) =>
                          handleChange("slogan", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Short Tagline</label>
                      <input
                        value={settings.tagline}
                        onChange={(e) =>
                          handleChange("tagline", e.target.value)
                        }
                      />
                      <span className="hint">
                        Use this on the home page, login page and customer dashboard.
                      </span>
                    </div>

                    <div className="field-group full">
                      <label>Receipt Footer Message</label>
                      <textarea
                        value={settings.receiptFooter}
                        onChange={(e) =>
                          handleChange("receiptFooter", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "About Us" && (
                <div className="settings-card">
                  <div className="settings-card-head">
                    <h2>About Us Page Content</h2>
                    <p>
                      Edit the public About Us page, brand story, mission,
                      vision, legacy message and CHAFADIA SOLUTIONS portfolio
                      from here.
                    </p>
                  </div>

                  <div className="settings-form">
                    <div className="field-group">
                      <label>About Hero Label</label>
                      <input
                        value={settings.aboutHeroLabel}
                        onChange={(e) =>
                          handleChange("aboutHeroLabel", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>About Page Title</label>
                      <input
                        value={settings.aboutTitle}
                        onChange={(e) =>
                          handleChange("aboutTitle", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Main About Text</label>
                      <textarea
                        className="large-textarea"
                        value={settings.aboutText}
                        onChange={(e) =>
                          handleChange("aboutText", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Story Section Title</label>
                      <input
                        value={settings.aboutStoryTitle}
                        onChange={(e) =>
                          handleChange("aboutStoryTitle", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Business Story</label>
                      <textarea
                        className="large-textarea"
                        value={settings.aboutStory}
                        onChange={(e) =>
                          handleChange("aboutStory", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Legacy / Personal Inspiration Text</label>
                      <textarea
                        className="large-textarea"
                        value={settings.aboutLegacy}
                        onChange={(e) =>
                          handleChange("aboutLegacy", e.target.value)
                        }
                      />
                      <span className="hint">
                        This appears inside the legacy section on the About Us page.
                      </span>
                    </div>

                    <div className="field-group full">
                      <label>Mission</label>
                      <textarea
                        value={settings.aboutMission}
                        onChange={(e) =>
                          handleChange("aboutMission", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Vision</label>
                      <textarea
                        value={settings.aboutVision}
                        onChange={(e) =>
                          handleChange("aboutVision", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>What We Represent</label>
                      <textarea
                        value={settings.aboutRepresent}
                        onChange={(e) =>
                          handleChange("aboutRepresent", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>CHAFADIA SOLUTIONS Introduction</label>
                      <textarea
                        className="large-textarea"
                        value={settings.chafadiaSolutionsIntro}
                        onChange={(e) =>
                          handleChange("chafadiaSolutionsIntro", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>CHAFADIA SOLUTIONS Portfolio Note</label>
                      <textarea
                        value={settings.chafadiaSolutionsNote}
                        onChange={(e) =>
                          handleChange("chafadiaSolutionsNote", e.target.value)
                        }
                      />
                    </div>

                    <div className="editable-preview-panel">
                      <h3>About Page Preview</h3>
                      <p>
                        <strong>{settings.aboutTitle}</strong> —{" "}
                        {settings.aboutText}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Contact" && (
                <div className="settings-card">
                  <div className="settings-card-head">
                    <h2>Contacts & Location</h2>
                    <p>
                      Update phone, WhatsApp, email, payment contact, location
                      and contact page text. Contact pages can read these from
                      localStorage.
                    </p>
                  </div>

                  <div className="settings-form">
                    <div className="field-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) =>
                          handleChange("email", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Main Phone Number</label>
                      <input
                        value={settings.phone}
                        onChange={(e) =>
                          handleChange("phone", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>WhatsApp Number</label>
                      <input
                        value={settings.whatsapp}
                        onChange={(e) =>
                          handleChange("whatsapp", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Call Support Number</label>
                      <input
                        value={settings.supportPhone}
                        onChange={(e) =>
                          handleChange("supportPhone", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Payment / Orange Money Contact</label>
                      <input
                        value={settings.paymentPhone}
                        onChange={(e) =>
                          handleChange("paymentPhone", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Website Link</label>
                      <input
                        value={settings.website}
                        placeholder="https://..."
                        onChange={(e) =>
                          handleChange("website", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>City</label>
                      <input
                        value={settings.city}
                        onChange={(e) =>
                          handleChange("city", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Country</label>
                      <input
                        value={settings.country}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Contact Hero Label</label>
                      <input
                        value={settings.contactHeroLabel}
                        onChange={(e) =>
                          handleChange("contactHeroLabel", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Contact Page Title</label>
                      <input
                        value={settings.contactTitle}
                        onChange={(e) =>
                          handleChange("contactTitle", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Contact Page Introduction</label>
                      <textarea
                        className="large-textarea"
                        value={settings.contactIntro}
                        onChange={(e) =>
                          handleChange("contactIntro", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Business Address</label>
                      <textarea
                        value={settings.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Business Hours</label>
                      <input
                        value={settings.businessHours}
                        onChange={(e) =>
                          handleChange("businessHours", e.target.value)
                        }
                      />
                    </div>

                    <div className="editable-preview-panel">
                      <h3>Contact Preview</h3>
                      <p>
                        <strong>{settings.contactTitle}</strong> —{" "}
                        {settings.contactIntro}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Operations" && (
                <div className="settings-card">
                  <div className="settings-card-head">
                    <h2>Website Operations</h2>
                    <p>
                      Control website status, currency, language and delivery
                      rules.
                    </p>
                  </div>

                  <div className="settings-form">
                    <div className="field-group">
                      <label>Website Status</label>
                      <select
                        value={settings.websiteStatus}
                        onChange={(e) =>
                          handleChange("websiteStatus", e.target.value)
                        }
                      >
                        <option value="Open">Open</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div className="field-group">
                      <label>Default Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) =>
                          handleChange("currency", e.target.value)
                        }
                      >
                        <option value="FCFA">FCFA</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="NGN">NGN</option>
                      </select>
                    </div>

                    <div className="field-group">
                      <label>Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          handleChange("language", e.target.value)
                        }
                      >
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Bilingual">Bilingual</option>
                      </select>
                    </div>

                    <div className="field-group">
                      <label>Delivery Fee</label>
                      <input
                        type="number"
                        value={settings.deliveryFee}
                        onChange={(e) =>
                          handleChange("deliveryFee", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Free Delivery From</label>
                      <input
                        type="number"
                        value={settings.freeDeliveryFrom}
                        onChange={(e) =>
                          handleChange("freeDeliveryFrom", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group full">
                      <label>Maintenance Message</label>
                      <textarea
                        value={settings.maintenanceMessage}
                        onChange={(e) =>
                          handleChange("maintenanceMessage", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Branding" && (
                <div className="settings-card">
                  <div className="settings-card-head">
                    <h2>Brand Colors</h2>
                    <p>
                      These colors are saved as CSS variables and applied across
                      pages that use <code>var(--blue)</code>,{" "}
                      <code>var(--gold)</code> and{" "}
                      <code>var(--dark-blue)</code>.
                    </p>
                  </div>

                  <div className="settings-form">
                    <div className="field-group">
                      <label>Primary Blue</label>
                      <div className="color-row">
                        <input
                          value={settings.primaryColor}
                          onChange={(e) =>
                            handleChange("primaryColor", e.target.value)
                          }
                        />

                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) =>
                            handleChange("primaryColor", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label>Premium Gold</label>
                      <div className="color-row">
                        <input
                          value={settings.goldColor}
                          onChange={(e) =>
                            handleChange("goldColor", e.target.value)
                          }
                        />

                        <input
                          type="color"
                          value={settings.goldColor}
                          onChange={(e) =>
                            handleChange("goldColor", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label>Dark Blue</label>
                      <div className="color-row">
                        <input
                          value={settings.darkBlue}
                          onChange={(e) =>
                            handleChange("darkBlue", e.target.value)
                          }
                        />

                        <input
                          type="color"
                          value={settings.darkBlue}
                          onChange={(e) =>
                            handleChange("darkBlue", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label>Background Color</label>
                      <div className="color-row">
                        <input
                          value={settings.backgroundColor}
                          onChange={(e) =>
                            handleChange("backgroundColor", e.target.value)
                          }
                        />

                        <input
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) =>
                            handleChange("backgroundColor", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Social" && (
                <div className="settings-card">
                  <div className="settings-card-head">
                    <h2>Social Media</h2>
                    <p>
                      Add public social media links for the footer, contact page
                      and brand sections.
                    </p>
                  </div>

                  <div className="settings-form">
                    <div className="field-group">
                      <label>Facebook Link</label>
                      <input
                        value={settings.facebook}
                        placeholder="https://facebook.com/..."
                        onChange={(e) =>
                          handleChange("facebook", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Instagram Link</label>
                      <input
                        value={settings.instagram}
                        placeholder="https://instagram.com/..."
                        onChange={(e) =>
                          handleChange("instagram", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>TikTok Link</label>
                      <input
                        value={settings.tiktok}
                        placeholder="https://tiktok.com/@..."
                        onChange={(e) =>
                          handleChange("tiktok", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Permissions" && (
                <div className="settings-card">
                  <div className="settings-card-head">
                    <h2>Website Permissions</h2>
                    <p>
                      Enable or disable core website features without deleting
                      the pages.
                    </p>
                  </div>

                  <div className="toggle-grid">
                    {toggleItems.map((item) => (
                      <div className="toggle-card" key={item.key}>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.desc}</p>
                        </div>

                        <button
                          type="button"
                          className={
                            settings[item.key] ? "switch active" : "switch"
                          }
                          onClick={() => toggleSetting(item.key)}
                        >
                          <span />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Preview" && (
                <div className="settings-card">
                  <div className="settings-card-head">
                    <h2>Live Brand Preview</h2>
                    <p>
                      Check how your saved business identity, About Us and
                      contact details will appear across the website.
                    </p>
                  </div>

                  <div className="preview-grid">
                    <div className="brand-preview">
                      <div className="preview-top">
                        <h3>{settings.businessName}</h3>
                        <p>{settings.slogan}</p>
                      </div>

                      <div className="preview-body">
                        <span className="preview-pill">
                          {settings.websiteStatus}
                        </span>

                        <p>{settings.tagline}</p>

                        <div className="preview-info-list">
                          <div>📍 {settings.address}</div>
                          <div>📞 Main: {settings.phone}</div>
                          <div>📞 Support: {settings.supportPhone}</div>
                          <div>💳 Payment Contact: {settings.paymentPhone}</div>
                          <div>✉ {settings.email}</div>
                          <div>💬 WhatsApp: {settings.whatsapp}</div>
                        </div>
                      </div>
                    </div>

                    <div className="brand-preview">
                      <div className="preview-top">
                        <h3>{settings.aboutTitle}</h3>
                        <p>{settings.aboutHeroLabel}</p>
                      </div>

                      <div className="preview-body">
                        <span className="preview-pill">
                          {settings.currency}
                        </span>

                        <p>{settings.aboutText}</p>

                        <div className="preview-info-list">
                          <div>Mission: {settings.aboutMission}</div>
                          <div>Contact: {settings.contactTitle}</div>
                          <div>Business Hours: {settings.businessHours}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="integration-note">
                    To make About and Contact update automatically, read this
                    saved object with{" "}
                    <code>JSON.parse(localStorage.getItem("websiteSettings"))</code>{" "}
                    or import <code>getWebsiteSettings()</code> from this file.
                    Pages using CSS variables like <code>var(--blue)</code> and{" "}
                    <code>var(--gold)</code> will immediately follow the saved
                    colors.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="settings-actions">
            <button
              type="button"
              className="reset-settings"
              onClick={resetSettings}
            >
              Reset Settings
            </button>

            <button
              type="button"
              className="export-settings"
              onClick={exportSettings}
            >
              Export Settings
            </button>

            <button
              type="button"
              className="save-settings"
              onClick={saveSettings}
            >
              Save & Apply Everywhere
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default WebsiteSettings;
