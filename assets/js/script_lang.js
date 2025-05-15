const translations = {
  en: {
    title: "Structura web fiduciary",
    description: "Accounting, Finance, Data, AI",
    buttons: [
      { label: "ai", description: "Artificial Intelligence tools and insights." },
      { label: "dr", description: "Director ad interim and Board member." },
      { label: "fi/ac", description: "Finance and Accounting services." },
      { label: "data", description: "Data extraction and visualization." },
      { label: "web", description: "Web development and automation." }
    ]
  },
  fr: {
    title: "Structura Fiduciaire Web",
    description: "Comptabilité, Finances, Données, IA",
    buttons: [
      { label: "ia", description: "Outils et perspectives en intelligence artificielle." },
      { label: "dr", description: "Directeur intérimaire et membre du conseil." },
      { label: "fi/ac", description: "Services financiers et comptables." },
      { label: "données", description: "Extraction et visualisation de données." },
      { label: "web", description: "Développement web et automatisation." }
    ]
  },
  de: {
    title: "Structura Web Treuhand",
    description: "Rechnungswesen, Finanzen, Datein, KI",
    buttons: [
      { label: "ki", description: "Künstliche Intelligenz für Finanzen." },
      { label: "dr", description: "Interimsdirektor und Vorstandsmitglied." },
      { label: "fi/ac", description: "Finanz- und Buchhaltungsdienste." },
      { label: "daten", description: "Datenextraktion und Visualisierung." },
      { label: "web", description: "Webentwicklung und Automatisierung." }
    ]
  }
};


/*const descriptions = [
  { label: "ai", description: "Artificial Intelligence tools and insights." },
  { label: "dr", description: "Director ad interim and Board member." },
  { label: "fi/ac", description: "Finance and Accounting services." },
  { label: "data", description: "Data extraction, cleaning, and visualization tools." },
  { label: "web", description: "Web development and automation solutions." }
];

const translations = {
  en: {
    ai: "AI tools and insights.",
    dr: "Interim director and board member.",
    // ...
  },
  fr: {
    ai: "Outils et perspectives d'IA.",
    dr: "Directeur intérimaire et membre du conseil.",
    // ...
  },
  de: {
    ai: "KI-Tools und Erkenntnisse.",
    dr: "Interimsdirektor und Vorstandsmitglied.",
    // ...
  }
};*/

function translate(currentLang) {
  if currentLang = 'en' {

    const textualvariations = [
      { label: "ai", title: "Data scientist", description: "Artificial Intelligence tools and insights.", details: ai_details},
      { label: "dr", title: "Chief Financial Officer", description:"Director ad interim or Board member.", details: dr_details},
      { label: "fi/ac", title: "Certified Public Accountant", description:"Finance and Accounting services.", details: fi_details},
      { label: "data", title: "Data Engenieer & Data Analyst", description:"Data extraction, cleaning and visualization.", details: data_details},
      { label: "web", title: "Web developer", description: "Web programmation and automation solutions.", details: web_details}
    ];
  }  
  const ai_details = {
    document.getElementById('info-text').innerHTML = `
      <details>
        <summary>About AI</summary>
        <p>I am a Data scientist in becoming. I use libraries like TensorFlow and Sicitlearn to build Machine Learing modeles integrated in web applications, 
        which you can access anytime anywhere. 
        Artificial Intelligence tools and insights to boost financial automation and decision making.</p>
      </details>
      <details>
        <summary>Use Cases</summary>
        <p>Invoice reading, anomaly detection, predictive reporting, and more.</p>
      </details>
    `;
  }
}